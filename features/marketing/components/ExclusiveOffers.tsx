"use client";

import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { fetchSponsorOffers, SponsorOffer } from "@/features/game-hub/lib/api";

interface Sponsor {
  name: string;
  discount: string;
  logo: string;
}

export default function ExclusiveOffers() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsorOffers()
      .then((data: SponsorOffer[]) =>
        setSponsors(
          data.map((d) => ({
            name: d.name,
            discount: d.discountLabel,
            logo: d.logoUrl ?? "/fallback-logo.png",
          }))
        )
      )
      .catch((err) => {
        console.error("Failed to load sponsor offers", err);
        setSponsors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="offers-section">
        <h2 className="offers-title">Tap &amp; enjoy exclusive offers</h2>
      </section>
    );
  }

  if (sponsors.length === 0) return null;

  return (
    <section className="offers-section">
      <div className="offers-header">
        <h2 className="offers-title">Tap &amp; enjoy exclusive offers</h2>
        <p className="offers-subtitle">
          Every Tourist Pass unlocks instant discounts at {sponsors.length} partners across Albania —
          just show your QR code, no coupons or sign-up needed.
        </p>
      </div>

      <div className="pass-card">
        <div className="pass-card-top">
          <span className="pass-card-brand">Vodafone</span>
          <span className="pass-card-badge">TOURIST PASS</span>
        </div>

        <p className="pass-card-label">Scan to activate benefits</p>

        <div className="pass-card-perforation" aria-hidden="true" />

        <div className="pass-card-bottom">
          <div className="pass-card-info">
            <span className="pass-card-count">{sponsors.length}</span>
            <span className="pass-card-count-label">Partner offers</span>
          </div>
          <div className="pass-card-qr">
            <QrCode size={34} strokeWidth={1.5} color="#e60000" />
          </div>
        </div>
      </div>

      <div className="offers-grid">
        {sponsors.map((sponsor, i) => (
          <div
            key={sponsor.name}
            className="offer-chip"
            style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
          >
            <div className="offer-chip-logo">
              <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
            </div>
            <div className="offer-chip-copy">
              <span className="offer-chip-name">{sponsor.name}</span>
              <span className="offer-chip-discount">{sponsor.discount}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
