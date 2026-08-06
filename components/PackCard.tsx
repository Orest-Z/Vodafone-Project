"use client";

import Link from "next/link";

interface PackCardProps {
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  features: string[];
}

export default function PackCard({
  title,
  subtitle,
  price,
  duration,
  features,
}: PackCardProps) {
  // Construct URL with query parameters
  const activateUrl = `/activate?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}`;

  return (
    <div className="pack-card">
      <div className="pack-header">
        <h3 className="pack-title">{title}</h3>
        <p className="pack-subtitle">{subtitle}</p>
        <div className="pack-price">{price}</div>
        <div className="pack-duration">{duration}</div>
      </div>

      <div className="pack-body">
        <ul className="pack-features">
          {features.map((feature, index) => (
            <li key={index} className="pack-feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="pack-footer">
        <Link href={activateUrl} className="pack-button">
          Activate
        </Link>
      </div>
    </div>
  );
}