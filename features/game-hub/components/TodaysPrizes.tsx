"use client";

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { fetchPrizeCatalog, PrizeCatalogEntry } from "@/features/game-hub/lib/api";

type Rarity = "common" | "rare" | "epic";

function getRarity(chance: number): Rarity {
  if (chance >= 15) return "common";
  if (chance >= 5) return "rare";
  return "epic";
}

const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
};

function formatChance(chancePercent: number) {
  if (chancePercent >= 10) return `${Math.round(chancePercent)}%`;
  return `${chancePercent.toFixed(1)}%`;
}

export default function TodaysPrizes() {
  const [prizes, setPrizes] = useState<PrizeCatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPrizeCatalog()
      .then((data) => {
        if (!cancelled) setPrizes(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || prizes.length === 0) return null;

  const maxChance = Math.max(...prizes.map((p) => p.chancePercent));

  return (
    <div className="game-prizes-panel">
      <div className="game-prizes-header">
        <Ticket size={18} />
        <h2 className="game-prizes-title">What you could win today</h2>
      </div>

      <div className="game-prizes-grid">
        {prizes.map((prize, i) => {
          const rarity = getRarity(prize.chancePercent);
          const barWidth = maxChance > 0 ? (prize.chancePercent / maxChance) * 100 : 0;
          return (
            <div key={i} className="prize-card">
              <div className="prize-card-top">
                <span className={`prize-rarity-badge prize-rarity-badge--${rarity}`}>
                  {RARITY_LABEL[rarity]}
                </span>
                <span className="prize-card-chance-text">
                  {formatChance(prize.chancePercent)} chance
                </span>
              </div>
              <span className="prize-card-label">{prize.label}</span>
              {prize.sponsor && (
                <span className="prize-card-sponsor">at {prize.sponsor}</span>
              )}
              <div className="prize-card-bar-wrap">
                <div className="prize-card-bar-track">
                  <div
                    className="prize-card-bar-fill"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
