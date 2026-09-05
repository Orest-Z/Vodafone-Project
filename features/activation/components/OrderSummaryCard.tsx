"use client";

import Image from "next/image";
import {
  Infinity as InfinityIcon,
  Phone,
  CalendarDays,
  Wifi,
  Zap,
  Gift,
  Headset,
  MessageSquare,
  CheckCircle2,
  Lock,
  ShieldCheck,
  CreditCard,
  Clock,
} from "lucide-react";
import type { PackDetails } from "../types/tourist";
import { allToEur, formatAll } from "../lib/currency";

// Best-effort icon match against the backend's iconKey string. Falls back
// to a generic check if nothing matches — this list is presentational
// only, it never blocks a feature from rendering.
const FEATURE_ICON_MAP: Record<string, typeof CheckCircle2> = {
  coverage: Wifi,
  network: Wifi,
  instant: Zap,
  activation: Zap,
  offer: Gift,
  discount: Gift,
  support: Headset,
  sms: MessageSquare,
};

function iconForFeature(iconKey: string) {
  const key = (iconKey || "").toLowerCase();
  const match = Object.keys(FEATURE_ICON_MAP).find((k) => key.includes(k));
  return match ? FEATURE_ICON_MAP[match] : CheckCircle2;
}

interface OrderSummaryCardProps {
  pack: PackDetails;
  /** Optional pill shown over the hero image, e.g. "Best Value". Backend
   *  has no badge field today, so this is left for the caller to pass in
   *  (or omit) rather than guessed here. */
  badgeLabel?: string;
}

export default function OrderSummaryCard({ pack, badgeLabel }: OrderSummaryCardProps) {
  return (
    <aside className="order-summary-card">
      <div className="order-summary-hero">
        <Image
          src={
            pack.imageUrl ||
            "https://kigosmhsxdyewcdleaov.supabase.co/storage/v1/object/public/vodafone-assets/city.webp"
          }
          alt={pack.title}
          fill
          className="order-summary-hero-img"
        />
        {badgeLabel && <span className="order-summary-hero-badge">{badgeLabel}</span>}
      </div>

      <p className="order-summary-eyebrow">Pack Summary</p>
      <h3 className="order-summary-title">{pack.title}</h3>

      <div className="order-summary-specs">
        <div className="order-summary-spec">
          <InfinityIcon size={16} />
          <span>{pack.dataAllowance || "Unlimited"}</span>
          <small>Data</small>
        </div>
        <div className="order-summary-spec">
          <Phone size={16} />
          <span>{pack.minutesAllowance ?? "N/A"}</span>
          <small>Minutes</small>
        </div>
        <div className="order-summary-spec">
          <CalendarDays size={16} />
          <span>{pack.durationDays}</span>
          <small>Days</small>
        </div>
      </div>

      <div className="order-summary-price">
        <span className="order-summary-price-amount">{formatAll(pack.priceAll)}</span>
        <span className="order-summary-price-eur">~{allToEur(pack.priceAll)} EUR</span>
      </div>

      {pack.features?.length > 0 && (
        <>
          <p className="order-summary-section-label">Included in your pack</p>
          <ul className="order-summary-feature-list">
            {pack.features.map((feature, i) => {
              const Icon = iconForFeature(feature.iconKey);
              return (
                <li key={i}>
                  <Icon size={16} />
                  <span>{feature.label}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="order-summary-divider" />

      <p className="order-summary-section-label">Secure Checkout</p>
      <ul className="order-summary-secure-list">
        <li>
          <Lock size={14} />
          <span>End-to-end encrypted payment</span>
        </li>
        <li>
          <Clock size={14} />
          <span>24h cancellation policy</span>
        </li>
        <li>
          <ShieldCheck size={14} />
          <span>Vodafone network guarantee</span>
        </li>
        <li>
          <CreditCard size={14} />
          <span>PayPal · Debit · Credit Card</span>
        </li>
      </ul>
    </aside>
  );
}