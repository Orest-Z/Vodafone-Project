import Image from "next/image";
import { allToEur } from "@/features/activation/lib/currency";
import PackFeatureList from "@/features/activation/components/PackFeatureList";

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
      <div className="pack-card-media skeleton" style={{ height: "200px", position: "relative", width: "100%", flexShrink: 0, overflow: "hidden", borderRadius: 0 }}>
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

        {/* Data / national mins / roaming / validity — validity is last so
            it sits directly above the Buy & Activate button. */}
        <ul className="pack-features" style={{ marginTop: "20px", marginBottom: "24px", padding: 0, listStyle: "none" }}>
          <PackFeatureList pack={pack} />
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
