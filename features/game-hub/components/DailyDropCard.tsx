"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { useGame } from "@/features/game-hub/context/GameContext";
import ScratchCard from "./ScratchCard";
import NextCreditTimer from "./NextCreditTimer";
import { DropResult } from "@/features/game-hub/types/game";

export default function DailyDropCard({
  onFinish,
}: {
  onFinish: (result: DropResult) => void;
}) {
  const {
    touristName,
    credits,
    hasPlayedToday,
    dailyClaimAvailable,
    nextClaimAt,
    loading,
    error,
    canPlay,
    refresh,
    claimDailyCredit,
    playDrop,
  } = useGame();

  const [revealing, setRevealing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading && credits === 0 && !hasPlayedToday) {
    return (
      <div className="game-hub-wrap">
        <div className="game-hub-skeleton">
          <div className="game-hub-skeleton-header">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="skeleton skeleton-line" style={{ width: 72, height: 12 }} />
              <div className="skeleton skeleton-line" style={{ width: 220, height: 24 }} />
              <div className="skeleton skeleton-line" style={{ width: 180, height: 13 }} />
            </div>
            <div className="game-hub-skeleton-credits">
              <div className="skeleton skeleton-line" style={{ width: 80, height: 12 }} />
              <div className="skeleton skeleton-line" style={{ width: 40, height: 32 }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 220, borderRadius: 16, marginTop: 24 }} />
        </div>
      </div>
    );
  }

  const handleClaim = async () => {
    setBusy(true);
    try {
      await claimDailyCredit();
    } catch {
    } finally {
      setBusy(false);
    }
  };

  const handleRevealed = async () => {
    setBusy(true);
    try {
      const result = await playDrop();
      onFinish(result);
    } catch {
      setRevealing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="game-hub-wrap">
      <div className="game-hub-header">
        <div>
          <p className="game-eyebrow" style={{ color: "var(--primary)" }}>Daily Drop</p>
          <h1 className="game-hub-title">
            {touristName ? `Welcome back, ${touristName}!` : "One scratch. Real prizes."}
          </h1>
          {touristName && (
            <p className="game-hub-subtitle">
              {hasPlayedToday
                ? "You've claimed today's prize — come back tomorrow for more."
                : canPlay
                ? "Your scratch card is ready. Good luck!"
                : "Scratch to win real, local prizes on us."}
            </p>
          )}
        </div>
        <div className="game-hub-credits">
          <span className="game-hub-credits-label">Game Credits</span>
          <span className="game-hub-credits-value">{credits}</span>
        </div>
      </div>

      {error && <p className="game-hub-empty-note">{error}</p>}

      {!dailyClaimAvailable && nextClaimAt && (
        <NextCreditTimer nextClaimAt={nextClaimAt} onElapsed={refresh} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card"
        style={{ marginTop: 24 }}
      >
        <div className="game-card-body">
          {hasPlayedToday ? (
            <div className="scratch-drop-done">
              <Sparkles size={28} />
              <p>You've already opened today's drop.</p>
              <p className="reward-note">Come back tomorrow for another one.</p>
            </div>
          ) : !revealing ? (
            <div className="scratch-drop-intro">
              <Gift size={32} />
              {dailyClaimAvailable ? (
                <>
                  <p>Claim today's credit to unlock your scratch card.</p>
                  <button
                    className="game-btn game-btn--primary"
                    disabled={busy}
                    onClick={handleClaim}
                  >
                    Claim daily credit
                  </button>
                </>
              ) : canPlay ? (
                <>
                  <p>Your scratch card is ready.</p>
                  <button
                    className="game-btn game-btn--primary"
                    disabled={busy}
                    onClick={() => setRevealing(true)}
                  >
                    Reveal today's drop
                  </button>
                </>
              ) : (
                <p className="reward-note">
                  You're out of game credits for today — the timer above shows when your
                  next one unlocks.
                </p>
              )}
            </div>
          ) : (
            <ScratchCard onRevealed={handleRevealed} disabled={busy} />
          )}
        </div>
      </motion.div>
    </div>
  );
}