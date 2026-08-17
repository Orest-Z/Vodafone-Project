"use client";

import { QrCode } from "lucide-react";

interface Sponsor {
  name: string;
  discount: string;
  logo: string; // pass your own image src here
}

const sponsors: Sponsor[] = [
  { name: "OPA", discount: "15% ULJE", logo: "/assets/sponsors/opa.png" },
  { name: "HOBUS Albania", discount: "15% ULJE", logo: "/assets/sponsors/hobus.png" },
  { name: "Mon Cheri", discount: "1+1 Coffee", logo: "/assets/sponsors/mon-cheri.png" },
  { name: "Burger King", discount: "10% ULJE", logo: "/assets/sponsors/burger-king.png" },
  { name: "Smart Taxi", discount: "20% ULJE", logo: "/assets/sponsors/smart-taxi.png" },
  { name: "Rentout", discount: "10% OFF", logo: "/assets/sponsors/rentout.png" },
  { name: "Glow Skin", discount: "10% OFF", logo: "/assets/sponsors/glow-skin.png" },
];

// Radial spread as a percentage of the container. Tweak these if boxes feel
// too cramped or too far out once you have more (or fewer) sponsors.
const RADIUS_X = 42;
const RADIUS_Y = 38;

// Evenly spaces `total` points around an ellipse, starting at 12 o'clock and
// moving clockwise — works for any sponsor count, not just 5.
function getPosition(index: number, total: number) {
  const angle = -90 + index * (360 / total);
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + RADIUS_X * Math.cos(rad),
    y: 50 + RADIUS_Y * Math.sin(rad),
  };
}

export default function ExclusiveOffers() {
  const positions = sponsors.map((_, i) => getPosition(i, sponsors.length));

  return (
    <section className="offers-section">
      <h2 className="offers-title">Tap &amp; enjoy exclusive offers</h2>

      <div className="offers-network">
        {/* Connecting lines — sit behind every card */}
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

        {/* Central Vodafone Tourist Pass card */}
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

        {/* Sponsor boxes */}
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

            {/* Visible only on mobile — draws the vertical connector in the stack */}
            <span className="mobile-connector" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}