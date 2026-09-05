"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Trophy } from "lucide-react";
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
  const [dropResult, setDropResult] = useState<DropResult | null>(null);

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

  // The random draw happens now, server-side, the moment the tourist asks
  // to play — not after they finish scratching. That's what lets the
  // scratch card show the *real* prize underneath as they clear it off,
  // instead of a blank/black layer with the outcome decided afterward.
  const handleReveal = async () => {
    setBusy(true);
    try {
      const result = await playDrop();
      setDropResult(result);
      setRevealing(true);
    } catch {
    } finally {
      setBusy(false);
    }
  };

  const handleScratchRevealed = () => {
    if (dropResult) onFinish(dropResult);
    setRevealing(false);
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
                ? "You've claimed today's prize. Come back tomorrow for more."
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
          {/* `revealing` must be checked before `hasPlayedToday`: playDrop()
              records the play server-side immediately, and its background
              refresh() flips hasPlayedToday to true right away — before the
              tourist has actually scratched anything. Without the
              `!revealing` guard here, that refresh yanks the "claimed"
              state in front of the scratch card the instant they hit
              Reveal, so they never see it. */}
          {hasPlayedToday && !revealing ? (
            <div className="scratch-drop-done">
              <div className="scratch-done-icon">
                <Trophy size={22} />
              </div>
              <p className="scratch-done-title">Today's drop claimed!</p>
              <p className="reward-note">
                Come back tomorrow to keep your streak alive. Your next scratch unlocks automatically.
              </p>
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
                    onClick={handleReveal}
                  >
                    Reveal today's drop
                  </button>
                </>
              ) : (
                <p className="reward-note">
                  You're out of game credits for today. The timer above shows when your
                  next one unlocks.
                </p>
              )}
            </div>
          ) : (
            dropResult && (
              <ScratchCard result={dropResult} onRevealed={handleScratchRevealed} disabled={busy} />
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}