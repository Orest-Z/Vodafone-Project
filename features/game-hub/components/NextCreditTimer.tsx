"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Live countdown to `nextClaimAt`. Calls `onElapsed` once when the timer
 * hits zero so the parent can refresh game hub state and flip the UI
 * over to "claim available" without the tourist needing to reload.
 */
export default function NextCreditTimer({
  nextClaimAt,
  onElapsed,
}: {
  nextClaimAt: string;
  onElapsed?: () => void;
}) {
  const target = new Date(nextClaimAt).getTime();
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const tick = () => {
      const msLeft = target - Date.now();
      setRemaining(msLeft);
      if (msLeft <= 0) {
        onElapsed?.();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <div className="game-hub-timer">
      <span className="game-hub-timer-label">Next daily credit in</span>
      <span className="game-hub-timer-value">{formatRemaining(remaining)}</span>
    </div>
  );
}
