"use client";

import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { fetchSponsorOffers, SponsorOffer } from "@/features/game-hub/lib/api";

interface Sponsor {
  name: string;
  discount: string;
  logo: string;
}

const RADIUS_X = 42;
const RADIUS_Y = 38;

function getPosition(index: number, total: number) {
  const angle = -90 + index * (360 / total);
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + RADIUS_X * Math.cos(rad),
    y: 50 + RADIUS_Y * Math.sin(rad),
  };
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

  const positions = sponsors.map((_, i) => getPosition(i, sponsors.length));

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
      <h2 className="offers-title">Tap &amp; enjoy exclusive offers</h2>

      <div className="offers-network">
        <svg
          className="offers-connector-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {positions.map((pos, i) => (
            <line
              key={i}
              x1={50}
              y1={50}
              x2={pos.x}
              y2={pos.y}
              className="offers-connector-line"
            />
          ))}
        </svg>

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

        {sponsors.map((sponsor, i) => (
          <div
            key={sponsor.name}
            className="sponsor-box"
            style={{ top: `${positions[i].y}%`, left: `${positions[i].x}%` }}
          >
            <div className="sponsor-logo">
              <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
            </div>
            <div className="sponsor-copy">
              <span className="sponsor-name">{sponsor.name}</span>
              <span className="sponsor-discount">{sponsor.discount}</span>
            </div>
            <span className="mobile-connector" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}