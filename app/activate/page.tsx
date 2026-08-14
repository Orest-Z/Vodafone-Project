"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Lock, CheckCircle2, Globe, Phone, Smartphone } from "lucide-react";
import TouristDetailsForm from "@/components/TouristDetailsForm";
import { TouristDetails } from "@/types/tourist";

const QUEST_STEPS = ["Choose Pack", "Your Details", "Payment", "Reward"];

function QuestStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="quest-stepper dark-stepper">
      <div className="stepper-title">Quest Progress</div>
      {QUEST_STEPS.map((label, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        return (
          <div
            key={label}
            className={`quest-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
          >
            <div className="quest-marker">
              {isCompleted ? <CheckCircle2 size={14} /> : index + 1}
            </div>
            <div className="quest-label">
              <div>{label}</div>
              <span className="quest-status">
                {isCompleted ? "Completed" : isActive ? "In Progress" : "Upcoming"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Left-column marketing copy. The faint emblem behind the text is left as an
   empty hook (.intro-watermark) — drop your own background art in via CSS. */
function ActivationIntro({ packTitle }: { packTitle: string }) {
  return (
    <div className="activation-intro">
      <div className="intro-watermark" aria-hidden="true" />
      <span className="intro-eyebrow">Activation</span>
      <h1 className="intro-title">
        Just a few details.
        <span className="intro-title-accent">You&apos;re almost connected.</span>
      </h1>
      <p className="intro-subtext">Enter your info to activate {packTitle}.</p>
    </div>
  );
}

/* Right-column pack summary. Kept content-only (label, name, price, features) —
   the illustration area (.summary-art) is left empty for a custom background image. */
function PackSummary({
  packTitle,
  packPrice,
  packDuration,
}: {
  packTitle: string;
  packPrice: string;
  packDuration: string;
}) {
  const features = [
    { icon: Globe, primary: "1.1 TB", secondary: "High-Speed Data" },
    { icon: Phone, primary: "1000", secondary: "National Minutes" },
    { icon: Smartphone, primary: "Instant eSIM", secondary: "Delivery" },
  ];

  return (
    <div className="summary-card fade-in-up">
      <span className="summary-label">Your Pack</span>
      <h3 className="pack-name">{packTitle}</h3>
      {packDuration && <p className="pack-duration-tag">{packDuration}</p>}
      <p className="pack-price">{packPrice}</p>

      <ul className="pack-features-list">
        {features.map(({ icon: Icon, primary, secondary }) => (
          <li key={secondary}>
            <span className="pack-feature-icon">
              <Icon size={16} />
            </span>
            <span className="pack-feature-copy">
              <span className="pack-feature-primary">{primary}</span>
              <span className="pack-feature-secondary">{secondary}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="summary-art" />
      <span className="summary-art-caption">Covering all of Albania</span>
    </div>
  );
}

function ActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const packTitle = searchParams.get("title") || "Selected Pack";
  const packPrice = searchParams.get("price") || "2700 ALL";
  const packDuration = searchParams.get("duration") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = (data: TouristDetails) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const activeStepIndex = isSuccess ? 3 : isSubmitting ? 2 : 1;

  return (
    <div className="checkout-dark-wrapper">
      <div className="checkout-grid">
        {/* Left column: progress tracker + marketing copy */}
        <div className="checkout-sidebar">
          <QuestStepper activeIndex={activeStepIndex} />
          <ActivationIntro packTitle={packTitle} />
        </div>

        {/* Middle column: details form */}
        <div className="form-card fade-in-up">
          <TouristDetailsForm
            onSubmit={handleFormSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
          <div className="checkout-footer-badge">
            <Lock size={14} />
            <span>Your data is safe with us.</span>
          </div>
        </div>

        {/* Right column: selected pack summary */}
        <PackSummary packTitle={packTitle} packPrice={packPrice} packDuration={packDuration} />
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center", padding: 60, color: "#fff" }}>Loading...</p>}>
      <ActivateContent />
    </Suspense>
  );
}