import { PhoneCall, Globe2, CheckCircle2, Clock } from "lucide-react";
import { SignalBarsIcon } from "@/shared/components/icons";

// Shared detail rows (data / national mins / roaming / extra features /
// validity) so the pack grid cards and the quiz "Perfect Match" result card
// render identical details instead of drifting out of sync. Renders a
// fragment of <li className="pack-feature"> rows — the caller supplies the
// surrounding <ul>.
export default function PackFeatureList({ pack }: { pack: any }) {
  let roaming: any[] = [];
  try {
    roaming = typeof pack.roamingDetails === "string"
      ? JSON.parse(pack.roamingDetails)
      : (pack.roamingDetails || []);
  } catch {
    roaming = [];
  }

  return (
    <>
      {pack.dataAllowance && (
        <li className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <SignalBarsIcon size={18} color="#e60000" />
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
            Roaming: {roaming.map((r: any) => `${r.allowance} in ${r.region}`).join(", ")}
          </span>
        </li>
      )}

      {pack.features?.map((feature: any, i: number) => (
        <li key={i} className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <CheckCircle2 size={18} color="#e60000" />
          <span>{feature.label}</span>
        </li>
      ))}

      {pack.durationDays && (
        <li className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Clock size={18} color="#e60000" />
          <span>Valid for {pack.durationDays} Days</span>
        </li>
      )}
    </>
  );
}
