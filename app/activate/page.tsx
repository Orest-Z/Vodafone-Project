"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Check } from "lucide-react";
import TouristDetailsForm from "@/components/TouristDetailsForm";
import WalletSyncStatus from "@/components/game/WalletSyncStatus";
import type { TouristDetails, PackDetails } from "@/types/tourist";
import { allToEur, formatAll } from "@/lib/currency";

type Step = "DETAILS" | "PAYMENT" | "SUCCESS";

function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packId = searchParams.get("packId");

  const [packDetails, setPackDetails] = useState<PackDetails | null>(null);
  const [step, setStep] = useState<Step>("DETAILS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Details captured in Step 1, used to render the Step 2 summary and
  // ultimately sent to /api/paypal/capture-order once payment clears.
  const [formData, setFormData] = useState<TouristDetails | null>(null);

  const [orderRef, setOrderRef] = useState("");
  const [touristId, setTouristId] = useState("");
  const [transactionId, setTransactionId] = useState("");

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

  // STEP 1 -> STEP 2: TouristDetailsForm is expected to validate its own
  // fields (name/email/passport/terms) before calling onSubmit.
  const handleDetailsSubmit = (data: TouristDetails) => {
    setFormData(data);
    setPaymentError(null);
    setStep("PAYMENT");
  };

  // STEP 2: ask our server to open a PayPal order for this pack.
  // The server looks the price up itself — we never send an amount here.
  const createOrder = async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Could not start PayPal checkout");
    }
    return data.orderID as string;
  };

  // STEP 2: PayPal has approved the payment on their side — capture it
  // server-side, then persist the paid activation.
  const onApprove = async (data: { orderID: string }, actions: any) => {
    if (!formData) return;
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID, packId, formData }),
      });
      const result = await res.json();
      if (!res.ok) {
        // INSTRUMENT_DECLINED means the *funding source* was rejected, not
        // that the order/integration is broken — the order itself is still
        // open. PayPal's own guidance is to let the buyer pick a different
        // funding source rather than dead-ending the checkout.
        if (result.issue === "INSTRUMENT_DECLINED" && actions?.restart) {
          setPaymentError(
            "That payment method was declined. Please choose a different funding source to try again."
          );
          return actions.restart();
        }

        // TEMP DEBUG — remove once fully verified. Puts PayPal's raw error
        // directly in the on-screen message so it's visible without digging
        // through devtools/server logs.
        const debugText = result.debug
          ? ` [DEBUG name=${result.debug.name} message=${result.debug.message} details=${JSON.stringify(result.debug.details)}]`
          : "";
        throw new Error((result.error || "Payment capture failed") + debugText);
      }

      setOrderRef(result.orderRef);
      setTouristId(result.touristId);
      setTransactionId(result.transactionId);
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

  const onPayPalError = (err: any) => {
    console.error("PayPal error:", err);
    setPaymentError("PayPal ran into a problem. Please try again.");
  };

  if (!packId) {
    return (
      <div className="checkout-dark-wrapper">
        <div className="activate-loading">No pack selected.</div>
      </div>
    );
  }
  if (!packDetails) {
    return (
      <div className="checkout-dark-wrapper">
        <div className="activate-loading">Loading pack details...</div>
      </div>
    );
  }

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  // NOTE: the backend PackDto has no `currency` field — prices (priceAll) are
  // stored in Albanian Lek (see PackCard.tsx, which shows "LEK"). This EUR
  // default is preserved as-is for now; flag with the team if PayPal should
  // actually be charging in ALL/Lek instead.
  const currency = "EUR";

  return (
    <div className="checkout-dark-wrapper">
      <div className="activate-shell">
        <div className="activate-header">
          <span className="activate-eyebrow">Tourist Pack Activation</span>
          <h1 className="activate-title">Activate {packDetails.title}</h1>
        </div>

        {/* Step indicator */}
        <div className="activate-steps">
          <span className={`activate-step ${step === "DETAILS" ? "active" : "completed"}`}>
            1. Your details
          </span>
          <span className="activate-step-arrow">→</span>
          <span className={`activate-step ${step === "PAYMENT" ? "active" : step === "SUCCESS" ? "completed" : ""}`}>
            2. Payment
          </span>
        </div>

        {step === "DETAILS" && (
          <div className="form-card">
            <TouristDetailsForm onSubmit={handleDetailsSubmit} isSubmitting={isSubmitting} />
          </div>
        )}

        {step === "PAYMENT" && formData && (
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
                <div className="activate-loading" style={{ minHeight: "auto", padding: "16px 0" }}>
                  Confirming your payment...
                </div>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency,
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
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
                </PayPalScriptProvider>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep("DETAILS")}
              className="activate-back-link"
              disabled={isSubmitting}
            >
              ← Back to details
            </button>
          </div>
        )}

        {step === "SUCCESS" && formData && (
          <>
            <div className="form-card" style={{ textAlign: "center" }}>
              <div className="activate-success-icon">
                <Check size={26} color="#fff" strokeWidth={3} />
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

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="checkout-dark-wrapper"><div className="activate-loading">Loading...</div></div>}>
      <ActivateContent />
    </Suspense>
  );
}