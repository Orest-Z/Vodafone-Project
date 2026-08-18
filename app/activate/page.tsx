"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Lock,
  CheckCircle2,
  Globe,
  Phone,
  Smartphone,
  Compass,
  MapPin,
  Zap,
  Loader2,
} from "lucide-react";
import TouristDetailsForm from "@/components/TouristDetailsForm";
import { TouristDetails } from "@/types/tourist";
import WalletSyncStatus from "@/components/game/WalletSyncStatus";

const QUEST_STEPS = ["Choose Pack", "Your Details", "Processing", "Reward"];

function QuestStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="quest-stepper dark-stepper" role="list" aria-label="Activation progress">
      <div className="stepper-title">Quest Progress</div>
      {QUEST_STEPS.map((label, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        return (
          <div
            key={label}
            role="listitem"
            aria-current={isActive ? "step" : undefined}
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

/* Left-column marketing copy. The faint emblem behind the text is a subtle
   compass mark — a nod to "finding your way" while traveling Albania. */
function ActivationIntro({ packTitle }: { packTitle: string }) {
  return (
    <div className="activation-intro">
      <div className="intro-watermark" aria-hidden="true">
        <Compass size={220} strokeWidth={1} />
      </div>
      <span className="intro-eyebrow">Activation</span>
      <h1 className="intro-title">
        Just a few details.
        <span className="intro-title-accent">You&apos;re almost connected.</span>
      </h1>
      <p className="intro-subtext">Enter your info to activate {packTitle}.</p>
    </div>
  );
}

/* Right-column pack summary. The illustration strip at the base carries a
   faint map pin, echoing the "Covering all of Albania" caption above it. */
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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <span className="summary-label">Your Pack</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
            color: "var(--primary)",
            background: "rgba(230, 0, 0, 0.1)",
            padding: "3px 8px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          <Zap size={11} /> Instant
        </span>
      </div>
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

      <div className="summary-art" aria-hidden="true">
        <MapPin size={56} strokeWidth={1.5} />
      </div>
      <span className="summary-art-caption">Covering all of Albania</span>
    </div>
  );
}

/* Post-submit confirmation. The receipt side is fully live. The reward side
   now hands off to the real WalletSyncStatus component — on completion it
   routes straight into /game-hub, where the actual mini-games live. */
function SuccessPanel({
  packTitle,
  packPrice,
  packDuration,
  orderRef,
  onWalletSynced,
}: {
  packTitle: string;
  packPrice: string;
  packDuration: string;
  orderRef: string;
  onWalletSynced: () => void;
}) {
  return (
    <div className="form-card fade-in-up" style={{ maxWidth: 880, margin: "0 auto" }} role="status" aria-live="polite">
      <div className="success-check">
        <CheckCircle2 size={30} />
      </div>
      <h2 className="success-title">You&apos;re all set!</h2>
      <p className="success-subtext">
        We&apos;ve confirmed your activation for {packTitle}. Setup instructions are on their way to your inbox.
      </p>

      <div className="success-grid">
        <div className="receipt-block">
          <span className="summary-label">Order Summary</span>
          <div className="receipt-row">
            <span>Pack</span>
            <span>{packTitle}</span>
          </div>
          {packDuration && (
            <div className="receipt-row">
              <span>Duration</span>
              <span>{packDuration}</span>
            </div>
          )}
          <div className="receipt-row">
            <span>Total</span>
            <span>{packPrice}</span>
          </div>
          <div className="receipt-row">
            <span>Reference</span>
            <span>{orderRef}</span>
          </div>
        </div>

        <div className="spin-panel" style={{ padding: 0, background: "none", boxShadow: "none" }}>
          <WalletSyncStatus packTitle={packTitle} onComplete={onWalletSynced} />
        </div>
      </div>
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
  const [orderRef, setOrderRef] = useState("");

  const handleFormSubmit = (data: TouristDetails) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setOrderRef(`VF-${Date.now().toString(36).toUpperCase().slice(-6)}`);
    }, 900);
  };

  const activeStepIndex = isSuccess ? 3 : isSubmitting ? 2 : 1;

  return (
    <div className="checkout-dark-wrapper">
      {isSuccess ? (
        <div style={{ maxWidth: 900, margin: "20px auto", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ maxWidth: 320, width: "100%", margin: "0 auto" }}>
            <QuestStepper activeIndex={activeStepIndex} />
          </div>
          <SuccessPanel
            packTitle={packTitle}
            packPrice={packPrice}
            packDuration={packDuration}
            orderRef={orderRef}
            onWalletSynced={() => router.push("/game-hub")}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
}

function ActivatePageFallback() {
  return (
    <div
      className="checkout-dark-wrapper"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <Loader2 size={28} style={{ animation: "quest-spin 1s linear infinite" }} />
        <p style={{ marginTop: 12 }}>Loading your pack…</p>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<ActivatePageFallback />}>
      <ActivateContent />
    </Suspense>
  );
}