import Image from "next/image";
import { PhoneCall, Globe2, CheckCircle2 } from "lucide-react";
import { SignalBarsIcon } from "@/shared/components/icons";
import { allToEur } from "@/features/activation/lib/currency";

export type PackBadge = "starter" | "popular" | "best-value";

const BADGE_LABEL: Record<PackBadge, string> = {
  starter: "Starter",
  popular: "Most Popular",
  "best-value": "Best Value",
};

export default function PackCard({
  pack,
  badge,
}: {
  pack: any;
  badge?: PackBadge;
}) {
  let roaming = [];
  try {
    roaming = typeof pack.roamingDetails === 'string' 
      ? JSON.parse(pack.roamingDetails) 
      : (pack.roamingDetails || []);
  } catch (e) {
    console.error("Failed to parse roaming details", e);
  }

  return (
    <div
      // Card background comes entirely from the .pack-card class (var(--card-bg)),
      // so it automatically follows the light/dark theme toggle — nothing here
      // hardcodes a color. .pack-card--popular just adds a highlighted border/glow.
      className={`pack-card ${badge === "popular" ? "pack-card--popular" : ""}`}
      style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", justifyContent: "flex-start" }}
    >
      
      {/* Image Header: flexShrink: 0 ensures it doesn't get squished by the content below.
          overflow hidden here + .pack-card-image's hover transform is what gives the
          "image nudges up" effect without the image spilling out of its rounded corners. */}
      <div className="pack-card-media" style={{ height: "200px", position: "relative", width: "100%", flexShrink: 0, overflow: "hidden" }}>
        {badge && (
          <span className={`pack-badge pack-badge--${badge}`}>{BADGE_LABEL[badge]}</span>
        )}
        <Image 
          src={pack.imageUrl || "https://kigosmhsxdyewcdleaov.supabase.co/storage/v1/object/public/vodafone-assets/city.webp"} 
          alt={pack.title}
          fill
          className="pack-card-image"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Info Section: We add padding here since we removed it from the parent card */}
      <div 
        className="pack-details-body" 
        style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <h3 className="pack-title" style={{ marginTop: 0 }}>{pack.title}</h3>
        <p className="pack-subtitle" style={{ marginBottom: "20px" }}>{pack.subtitle}</p>
        
        <p className="pack-price" style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
          <span className="pack-price-amount">{pack.priceAll}</span>
          <span className="pack-price-currency">LEK</span>
          <span className="pack-price-eur">
            (~{allToEur(pack.priceAll)} EUR)
          </span>
        </p>
        <p className="pack-duration">Valid for {pack.durationDays} Days</p>
        
        <ul className="pack-features" style={{ marginTop: "20px", marginBottom: "24px", padding: 0, listStyle: "none" }}>
          
          {pack.dataAllowance && (
            <li className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <SignalBarsIcon size={16} color="#e60000" />
              <span>{pack.dataAllowance} Data</span>
            </li>
          )}
          
          {pack.minutesAllowance && (
            <li className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <PhoneCall size={18} color="#e60000" />
              <span>{pack.minutesAllowance} National Mins</span>
            </li>
          )}

          {roaming.length > 0 && (
            <li className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Globe2 size={18} color="#e60000" />
              <span>
                Roaming: {roaming.map((r: any) => `${r.allowance} in ${r.region}`).join(', ')}
              </span>
            </li>
          )}

          {pack.features?.map((feature: any, i: number) => (
            <li key={i} className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <CheckCircle2 size={18} color="#e60000" />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>

        {/* Footer: mt-auto pushes the button to the bottom if cards are different heights */}
        <div className="pack-footer" style={{ marginTop: "auto" }}>
          <button 
            className="pack-button" 
            style={{ width: "100%" }}
            onClick={() => window.location.href = `/activate?packId=${pack.id}`}
          >
            Buy & Activate
          </button>
        </div>
      </div>
    </div>
  );
}