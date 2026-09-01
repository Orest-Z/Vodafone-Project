"use client";

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { fetchPrizeCatalog, PrizeCatalogEntry } from "@/features/game-hub/lib/api";

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
      .catch(() => {
        // Silently degrade — the daily drop still works without this panel.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || prizes.length === 0) return null;

  return (
    <div className="game-prizes-panel">
      <div className="game-prizes-header">
        <Ticket size={18} />
        <h2 className="game-prizes-title">What you could win today</h2>
      </div>
      <ul className="game-prizes-list">
        {prizes.map((prize, i) => (
          <li key={i} className="game-prizes-row">
            <div className="game-prizes-row-info">
              <span className="game-prizes-row-label">{prize.label}</span>
              {prize.sponsor && (
                <span className="game-prizes-row-sponsor">at {prize.sponsor}</span>
              )}
            </div>
            <span className="game-prizes-row-chance">{formatChance(prize.chancePercent)} chance</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
