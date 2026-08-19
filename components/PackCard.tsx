import Image from "next/image";
import { Wifi, PhoneCall, Globe2, CheckCircle2 } from "lucide-react";

export default function PackCard({ pack }: { pack: any }) {
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
      className="pack-card" 
      // 1. Force the card to behave as a column, remove any stray padding, and hide overflow for rounded corners
      style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", justifyContent: "flex-start" }}
    >
      
      {/* 2. Image Header: flexShrink: 0 ensures it doesn't get squished by the content below */}
      <div style={{ height: "200px", position: "relative", width: "100%", flexShrink: 0 }}>
        <Image 
          src={pack.imageUrl || "https://kigosmhsxdyewcdleaov.supabase.co/storage/v1/object/public/vodafone-assets/city.webp"} 
          alt={pack.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* 3. Info Section: We add padding here since we removed it from the parent card */}
      <div 
        className="pack-details-body" 
        style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <h3 className="pack-title" style={{ marginTop: 0 }}>{pack.title}</h3>
        <p className="pack-subtitle" style={{ marginBottom: "20px" }}>{pack.subtitle}</p>
        
        <p className="pack-price">
          {pack.priceAll} LEK
        </p>
        <p className="pack-duration">Valid for {pack.durationDays} Days</p>
        
        <ul className="pack-features" style={{ marginTop: "20px", marginBottom: "24px", padding: 0, listStyle: "none" }}>
          
          {pack.dataAllowance && (
            <li className="pack-feature" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Wifi size={18} color="#e60000" />
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

        {/* 4. Footer: mt-auto pushes the button to the bottom if cards are different heights */}
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