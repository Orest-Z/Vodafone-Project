"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { BadgeCheckIcon } from "@/shared/components/icons";
import WalletSyncStatus from "@/features/activation/components/WalletSyncStatus";
import CheckoutStepper from "@/features/activation/components/CheckoutStepper";
import OrderSummaryCard from "@/features/activation/components/OrderSummaryCard";
import CardPaymentForm from "@/features/activation/components/CardPaymentForm";
import type { TouristDetails, PackDetails } from "@/features/activation/types/tourist";
import { allToEur, formatAll } from "@/features/activation/lib/currency";
import { readCheckoutFormData, clearCheckoutFormData } from "@/features/activation/lib/checkoutSession";
import { useState, useEffect, useMemo, Suspense } from "react";
import PageLoader from "@/shared/components/PageLoader";
type Step = "PAYMENT" | "SUCCESS";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packId = searchParams.get("packId");
  const orderId = searchParams.get("orderId");

  const [packDetails, setPackDetails] = useState<PackDetails | null>(null);
  const [formData, setFormData] = useState<TouristDetails | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const [step, setStep] = useState<Step>("PAYMENT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [orderRef, setOrderRef] = useState("");
  const [touristId, setTouristId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [clientToken, setClientToken] = useState<string | null>(null);
   const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const currency = "EUR";
  const paypalOptions = useMemo(
  () => ({
    clientId: paypalClientId,
    currency,
    intent: "capture",
    components: "buttons,card-fields",
    dataClientToken: clientToken || "",
  }),
  [paypalClientId, currency, clientToken]
);

  // The tourist's form data was handed off via sessionStorage when
  // /activate redirected here (see features/activation/lib/checkoutSession.ts).
  // It only exists if the user actually came from that redirect, so a miss
  // here is an expected case (bookmarked/reloaded link, expired session,
  // etc.), not an error to recover from silently.
  useEffect(() => {
    setFormData(readCheckoutFormData(orderId));
    setSessionChecked(true);
  }, [orderId]);

  // PayPal's SDK closes its own popup right after approval, and its internal
  // cross-window messenger (postrobot) occasionally has a message still in
  // flight when that happens — a known, harmless upstream quirk that has no
  // effect on the actual capture, but surfaces as an unhandled rejection.
  // Swallow only that specific one so it doesn't trip Next's dev overlay.
  useEffect(() => {
    const handlePayPalPostRobotNoise = (event: PromiseRejectionEvent) => {
      const message = String(event.reason?.message || event.reason || "");
      if (message.includes("postrobot_method")) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handlePayPalPostRobotNoise);
    return () => window.removeEventListener("unhandledrejection", handlePayPalPostRobotNoise);
  }, []);

  

  useEffect(() => {
    if (!packId) return;
    const fetchPack = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/packs/${packId}`);
      if (res.ok) {
        setPackDetails(await res.json());
      }
    };
    fetchPack();
  }, [packId]);

    const createOrder = async () => {
    const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, email: formData?.email }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Could not start PayPal checkout");
    }
    return data.orderID as string;
    };

    //use effect to get the paypal client token from the server
  useEffect(() => {
  fetch("/api/paypal/client-token")
    .then((res) => res.json())
    .then((data) => setClientToken(data.clientToken))
    .catch((err) => {
      console.error("Failed to fetch PayPal client token:", err);
      setPaymentError("Payment setup failed. Please refresh and try again.");
    });
}, []);
  // Shared by both the PayPal button flow and the card fields flow below —
  // once an order is approved, capturing it and recording the activation
  // is identical regardless of which funding source the buyer picked.
  const captureOrder = async (orderID: string, actions?: any) => {
    if (!formData) return;
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, packId, formData }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.issue === "INSTRUMENT_DECLINED" && actions?.restart) {
          setPaymentError(
            "That payment method was declined. Please choose a different funding source to try again."
          );
          return actions.restart();
        }

        throw new Error(result.error || "Payment capture failed");
      }

      setOrderRef(result.orderRef);
      setTouristId(result.touristId);
      setTransactionId(result.transactionId);
      // The handoff data has done its job — clear it so it doesn't linger
      // in sessionStorage for the rest of the tab's life.
      clearCheckoutFormData(orderId);
      setStep("SUCCESS");
    } catch (error: any) {
      console.error(error);
      setPaymentError(
        error.message || "We couldn't confirm your payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onApprove = (data: { orderID: string }, actions: any) =>
    captureOrder(data.orderID, actions);

  const onCardApprove = (data: { orderID: string }) => captureOrder(data.orderID);

  const onPayPalError = (err: any) => {
    console.error("PayPal error:", err);
    setPaymentError("PayPal ran into a problem. Please try again.");
  };

  const onCardError = (message: string) => {
    setPaymentError(message);
  };

  if (!packId || !orderId) {
    return (
      <div className="checkout-dark-wrapper">
        <div className="activate-loading">Missing order information.</div>
      </div>
    );
  }

  if (!sessionChecked || !packDetails) {
    return (
      <div className="checkout-dark-wrapper">
        <PageLoader label="Loading your order..." />
      </div>
    );
  }

  // sessionStorage only carries over when this tab was opened directly
  // via window.open()/target="_blank" from /activate. If it's missing,
  // the tourist's details never arrived (bookmarked link, tab reopened
  // after being closed, storage disabled, etc.) — send them back rather
  // than trying to capture a payment with no details to attach it to.
  if (!formData) {
    return (
      <div className="checkout-dark-wrapper">
        <div className="activate-shell">
          <div className="form-card" style={{ textAlign: "center" }}>
            <h2 className="activate-success-title">Your session has expired</h2>
            <p className="step-text">
              We couldn't find your order details in this tab. Please go back and
              restart checkout.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => router.push(`/activate?packId=${packId}`)}
            >
              Back to activation
            </button>
          </div>
        </div>
      </div>
    );
  }

 

  return (
    <div className="checkout-dark-wrapper">
      <div className="activate-shell activate-shell--wide">
        <div className="activate-header">
          <span className="activate-eyebrow">Tourist Pack Activation</span>
          <h1 className="activate-title">Pay for {packDetails.title}</h1>
        </div>

        <CheckoutStepper currentStep={step} />

        {step === "PAYMENT" && (
          <div className="activate-two-col">
            <div className="form-card">
              <h3 className="form-section-title">Order summary</h3>

              <div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Pack</span>
                  <span className="order-summary-value">{packDetails.title}</span>
                </div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Price</span>
                  <span className="order-summary-value">
                    {allToEur(packDetails.priceAll)} {currency}
                    <span className="order-summary-subvalue">({formatAll(packDetails.priceAll)})</span>
                  </span>
                </div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Name</span>
                  <span className="order-summary-value">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Email</span>
                  <span className="order-summary-value">{formData.email}</span>
                </div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Delivery</span>
                  <span className="order-summary-value">
                    {formData.deliveryMethod === "ESIM" ? "eSIM" : "Physical SIM"}
                  </span>
                </div>
              </div>

              {paymentError && <div className="form-alert-error">{paymentError}</div>}

                <div style={{ marginTop: 24 }}>
                {isSubmitting ? (
                    <div className="page-loader" style={{ minHeight: "auto", padding: "20px 0" }}>
                      <div className="page-loader-ring" />
                      <span>Confirming your payment...</span>
                    </div>
                ) : !clientToken ? (
                    <div className="page-loader" style={{ minHeight: "auto", padding: "20px 0" }}>
                      <div className="page-loader-ring" />
                      <span>Preparing secure payment...</span>
                    </div>
                ) : (
                    <PayPalScriptProvider options={paypalOptions}>
                    {/* Restricted to the PayPal funding source only — the default
                        "Debit or Credit Card" button opens PayPal's own hosted,
                        unstyled overlay (see screenshots). Card payments are handled
                        below instead, inline and themed to match the rest of the site. */}
                    <PayPalButtons
                      fundingSource={FUNDING.PAYPAL}
                      style={{ layout: "vertical" }}
                      disabled={isSubmitting}
                      createOrder={async (data, actions) => {
                        try {
                          return await createOrder();
                        } catch (error: any) {
                          console.error("Error creating PayPal order:", error);
                          setPaymentError(
                            error.message || "We couldn't start the PayPal checkout. Please try again."
                          );
                          throw error;
                        }
                      }}
                      onApprove={onApprove}
                      onError={onPayPalError}
                    />

                    <div className="payment-divider">
                      <span>or pay with card</span>
                    </div>

                    <CardPaymentForm
                      createOrder={async () => {
                        try {
                          return await createOrder();
                        } catch (error: any) {
                          console.error("Error creating card order:", error);
                          setPaymentError(
                            error.message || "We couldn't start the card checkout. Please try again."
                          );
                          throw error;
                        }
                      }}
                      onApprove={onCardApprove}
                      onError={onCardError}
                      disabled={isSubmitting}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
            </div>
            <OrderSummaryCard pack={packDetails} badgeLabel="Best Value" />
          </div>
        )}

        {step === "SUCCESS" && (
          <>
            <div className="form-card" style={{ textAlign: "center" }}>
              <div className="activate-success-icon">
                <BadgeCheckIcon size={40} color="#e60000" />
              </div>
              <h2 className="activate-success-title">Activation Successful!</h2>

              <div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Order Reference</span>
                  <span className="order-summary-value" style={{ fontFamily: "monospace" }}>
                    {orderRef}
                  </span>
                </div>
                <div className="order-summary-row">
                  <span className="order-summary-label">Transaction ID</span>
                  <span className="order-summary-value" style={{ fontFamily: "monospace" }}>
                    {transactionId}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <WalletSyncStatus
                packTitle={packDetails.title}
                email={formData.email}
                deliveryMethod={formData.deliveryMethod}
                onComplete={() => router.push(`/game-hub?touristId=${touristId}`)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="checkout-dark-wrapper"><PageLoader /></div>}>
      <PaymentContent />
    </Suspense>
  );
}