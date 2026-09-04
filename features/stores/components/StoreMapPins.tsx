"use client";

import { useState, type CSSProperties } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { SignalBarsIcon } from "@/shared/components/icons";
import { vodafoneStores } from "@/features/stores/data/vodafoneStores";

export default function StoreMapPins() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      {vodafoneStores.map((store, i) => {
        const { top, left } = store.position;
        const isActive = activeId === store.id;
        // Staggering each pin's signal pulse keeps it reading as a live
        // network rather than one synchronized blink.
        const pinStyle = { top, left, "--pulse-delay": `${i * 0.35}s` } as CSSProperties;

        return (
          <div
            key={store.id}
            className="store-pin"
            style={pinStyle}
            tabIndex={0}
            onMouseEnter={() => setActiveId(store.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(store.id)}
            onBlur={() => setActiveId(null)}
            onClick={() => setActiveId(isActive ? null : store.id)}
          >
            <span className="store-pin-dot" aria-hidden="true" />
            <span className="sr-only">{store.name} — 4G/5G coverage</span>

            {isActive && (
              <div className="store-pin-popup" onClick={(e) => e.stopPropagation()}>
                <p className="store-pin-popup-title">
                  <MapPin size={13} color="#e60000" />
                  {store.name}
                </p>
                <p className="store-pin-popup-coverage">
                  <SignalBarsIcon size={11} color="#e60000" />
                  4G/5G coverage in {store.city}
                </p>
                <a
                  href={store.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-pin-popup-link"
                >
                  View on Google Maps <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}