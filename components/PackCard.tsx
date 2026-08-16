"use client";

import React from "react";

interface PackFeature {
  text: string;
  icon: React.ReactNode;
}

interface PackCardProps {
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  features: PackFeature[];
  imageUrl: string; // Add this to pass the specific image
}

export default function PackCard({
  title, subtitle, price, duration, features, imageUrl
}: PackCardProps) {
  const activateUrl = `/activate?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&duration=${encodeURIComponent(duration)}`;

  return (
    <div className="pack-card">
      {/* TOP PORTION: Image Background + Title */}
      <div 
        className="pack-media-header" 
      >
        <h3 className="pack-title">{title}</h3>
      </div>

      {/* BOTTOM PORTION: Solid Background + Details */}
      <div className="pack-details-body">
        <div className="pack-price">{price}</div>
        <div className="pack-duration">{duration}</div>
        
        <ul className="pack-features">
          {features.map((feature, index) => (
            <li key={index} className="pack-feature">
              <span className="feature-icon">{feature.icon}</span>
              <span className="feature-text">{feature.text}</span>
            </li>
          ))}
        </ul>

        <div className="pack-footer">
          <button className="pack-button" onClick={() => window.location.href = activateUrl}>
            Activate
          </button>
        </div>
      </div>
    </div>
  );
}