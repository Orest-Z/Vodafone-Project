"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { vodafoneStores } from "@/features/stores/data/vodafoneStores";

export default function StoreMapPins() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      {vodafoneStores.map((store) => {
        const { top, left } = store.position;
        const isActive = activeId === store.id;

        return (
          <div
            key={store.id}
            className="store-pin"
            style={{ top, left }}
            tabIndex={0}
            onMouseEnter={() => setActiveId(store.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(store.id)}
            onBlur={() => setActiveId(null)}
            onClick={() => setActiveId(isActive ? null : store.id)}
          >
            <span className="store-pin-dot" aria-hidden="true" />
            <span className="sr-only">{store.name}</span>

            {isActive && (
              <div className="store-pin-popup" onClick={(e) => e.stopPropagation()}>
                <p className="store-pin-popup-title">
                  <MapPin size={13} color="#e60000" />
                  {store.name}
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