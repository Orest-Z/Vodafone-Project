"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { useGame } from "@/features/game-hub/context/GameContext";
import ScratchCard from "./ScratchCard";
import { DropResult } from "@/features/game-hub/types/game";

function formatClaimTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? `today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : date.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

export default function DailyDropCard({
  onFinish,
}: {
  onFinish: (result: DropResult) => void;
}) {
  const {
    credits,
    hasPlayedToday,
    dailyClaimAvailable,
    nextClaimAt,
    loading,
    error,
    canPlay,
    claimDailyCredit,
    playDrop,
  } = useGame();

  const [revealing, setRevealing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading && credits === 0 && !hasPlayedToday) {
    return (
      <div className="game-hub-wrap">
        <p className="game-hub-empty-note">Loading your daily drop…</p>
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
          <h1 className="game-hub-title">One scratch. Real prizes.</h1>
        </div>
        <div className="game-hub-credits">
          <span className="game-hub-credits-label">Game Credits</span>
          <span className="game-hub-credits-value">{credits}</span>
        </div>
      </div>

      {error && <p className="game-hub-empty-note">{error}</p>}

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
                nextClaimAt && (
                  <p className="reward-note">
                    Next credit unlocks {formatClaimTime(nextClaimAt)}.
                  </p>
                )
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