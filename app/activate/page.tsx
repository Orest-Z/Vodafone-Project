"use client";

import { useState, useEffect, Suspense } from "react";
import PageLoader from "@/shared/components/PageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import TouristDetailsForm from "@/features/activation/components/TouristDetailsForm";
import CheckoutStepper from "@/features/activation/components/CheckoutStepper";
import OrderSummaryCard from "@/features/activation/components/OrderSummaryCard";
import type { TouristDetails, PackDetails } from "@/features/activation/types/tourist";
import { createOrderId, saveCheckoutFormData } from "@/features/activation/lib/checkoutSession";

// Payment now lives entirely on its own route (/payment). Clicking
// "Continue to Payment" redirects there in the same tab — this page's
// job stops at handing the tourist's details off and navigating away.
type Step = "DETAILS";

function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packId = searchParams.get("packId");

  const [packDetails, setPackDetails] = useState<PackDetails | null>(null);
  const [step] = useState<Step>("DETAILS");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDetailsSubmit = (data: TouristDetails) => {
    setIsSubmitting(true);
    const orderId = createOrderId();
    saveCheckoutFormData(orderId, data);
    router.push(`/payment?orderId=${encodeURIComponent(orderId)}&packId=${encodeURIComponent(packId!)}`);
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
        <PageLoader label="Loading pack details..." />
      </div>
    );
  }

  return (
    <div className="checkout-dark-wrapper">
      <div className="activate-shell activate-shell--wide">
        <div className="activate-header">
          <span className="activate-eyebrow">Tourist Pack Activation</span>
          <h1 className="activate-title">Activate {packDetails.title}</h1>
        </div>

        {/* CheckoutStepper's steps are DETAILS/PAYMENT/SUCCESS; PAYMENT and
            SUCCESS now happen entirely on /payment after the redirect, so
            this route only ever shows the DETAILS state. */}
        <CheckoutStepper currentStep={step} />

        {step === "DETAILS" && (
          <div className="activate-two-col">
            <div className="form-card">
              <TouristDetailsForm onSubmit={handleDetailsSubmit} isSubmitting={isSubmitting} />
            </div>
            <OrderSummaryCard pack={packDetails} badgeLabel="Best Value" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="checkout-dark-wrapper"><PageLoader /></div>}>
      <ActivateContent />
    </Suspense>
  );
}