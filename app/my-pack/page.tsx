"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, CreditCard, Package, Gamepad2, ChevronRight, Wifi, Phone, Wallet } from "lucide-react";
import PageLoader from "@/shared/components/PageLoader";
import { fetchSubscriptionStatus, SubscriptionStatus } from "@/features/my-pack/lib/api";

function formatDate(iso: string | null): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const STATUS_CONFIG: Record<string, { label: string; mod: string }> = {
  ACTIVE:    { label: "Active",    mod: "active" },
  PENDING:   { label: "Pending",   mod: "pending" },
  CANCELLED: { label: "Cancelled", mod: "cancelled" },
  FAILED:    { label: "Failed",    mod: "cancelled" },
};

function MyPackContent() {
  const searchParams = useSearchParams();
  const touristId = searchParams.get("touristId");

  const [data, setData] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!touristId) { setLoading(false); return; }
    fetchSubscriptionStatus(touristId)
      .then(setData)
      .catch(() =>
        setError("We couldn't find your pack details. Please use the link from your activation email.")
      )
      .finally(() => setLoading(false));
  }, [touristId]);

  if (!touristId) {
    return (
      <div className="my-pack-wrap">
        <p className="game-hub-empty-note">
          No session found. Please use the link from your activation email.
        </p>
      </div>
    );
  }

  if (loading) return <PageLoader label="Loading your pack..." />;

  if (error || !data) {
    return (
      <div className="my-pack-wrap">
        <p className="game-hub-empty-note">{error ?? "Something went wrong."}</p>
      </div>
    );
  }

  const remaining = daysRemaining(data.expiresAt);
  const statusCfg = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.PENDING;

  return (
    <div className="my-pack-wrap">
      {/* Header */}
      <div className="my-pack-header">
        <div>
          <p className="game-eyebrow" style={{ color: "var(--primary)" }}>Your Pack</p>
          <h1 className="game-hub-title">{data.touristFirstName}&apos;s Tourist Pack</h1>
          <p className="game-hub-subtitle">{data.packSubtitle}</p>
        </div>
        <span className={`my-pack-badge my-pack-badge--${statusCfg.mod}`}>
          {statusCfg.label}
        </span>
      </div>

      {/* Wallet pass — the tourist's real Vodafone Tourist Pass, with the
          partner-discount QR built into the pass itself (not a separate
          code shown on this site). */}
      <a href={data.appleWalletUrl} className="my-pack-wallet-btn" target="_blank" rel="noopener noreferrer">
        <Wallet size={18} />
        Add Vodafone Tourist Pass to Apple Wallet
      </a>

      {/* Days remaining banner */}
      {remaining !== null && data.status === "ACTIVE" && (
        <div className="my-pack-days-banner">
          <span className="my-pack-days-number">{remaining}</span>
          <span className="my-pack-days-label">
            {remaining === 1 ? "day remaining" : "days remaining"}
          </span>
        </div>
      )}

      {/* Pack details */}
      <div className="my-pack-card">
        <div className="my-pack-card-title">
          <Package size={15} />
          <span>Pack details</span>
        </div>
        <div className="my-pack-row">
          <span className="my-pack-row-label">Pack</span>
          <span className="my-pack-row-value">{data.packTitle}</span>
        </div>
        <div className="my-pack-row">
          <span className="my-pack-row-label"><Wifi size={12} /> Data</span>
          <span className="my-pack-row-value">{data.dataAllowance}</span>
        </div>
        {data.minutesAllowance > 0 && (
          <div className="my-pack-row">
            <span className="my-pack-row-label"><Phone size={12} /> Minutes</span>
            <span className="my-pack-row-value">{data.minutesAllowance} min</span>
          </div>
        )}
        <div className="my-pack-row">
          <span className="my-pack-row-label">Duration</span>
          <span className="my-pack-row-value">{data.durationDays} days</span>
        </div>
        <div className="my-pack-row">
          <span className="my-pack-row-label">Delivery</span>
          <span className="my-pack-row-value">
            {data.deliveryMethod === "ESIM" ? "eSIM" : "Physical SIM"}
          </span>
        </div>
      </div>

      {/* Key dates */}
      <div className="my-pack-card">
        <div className="my-pack-card-title">
          <Calendar size={15} />
          <span>Key dates</span>
        </div>
        <div className="my-pack-row">
          <span className="my-pack-row-label">Activated</span>
          <span className="my-pack-row-value">{formatDate(data.activatedAt)}</span>
        </div>
        <div className="my-pack-row">
          <span className="my-pack-row-label">Expires</span>
          <span className="my-pack-row-value">{formatDate(data.expiresAt)}</span>
        </div>
      </div>

      {/* Order */}
      <div className="my-pack-card">
        <div className="my-pack-card-title">
          <CreditCard size={15} />
          <span>Order</span>
        </div>
        <div className="my-pack-row">
          <span className="my-pack-row-label">Reference</span>
          <span className="my-pack-row-value" style={{ fontFamily: "monospace" }}>
            {data.orderRef}
          </span>
        </div>
        {data.amountPaid !== null && (
          <div className="my-pack-row">
            <span className="my-pack-row-label">Amount paid</span>
            <span className="my-pack-row-value">
              {Number(data.amountPaid).toFixed(2)} {data.currency}
            </span>
          </div>
        )}
      </div>

      {/* Game hub CTA */}
      <div className="my-pack-game-banner">
        <div className="my-pack-game-info">
          <Gamepad2 size={22} />
          <div>
            <p className="my-pack-game-credits-label">Game Credits</p>
            <p className="my-pack-game-credits-value">{data.gameCredits}</p>
          </div>
        </div>
        <a href={`/game-hub?touristId=${touristId}`} className="my-pack-game-btn">
          Play Daily Drop
          <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}

export default function MyPackPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading your pack..." />}>
      <MyPackContent />
    </Suspense>
  );
}
