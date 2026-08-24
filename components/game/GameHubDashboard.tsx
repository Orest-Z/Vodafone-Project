"use client";

import { motion } from "framer-motion";
import { Goal, CircleDot, Timer, Lock, ArrowRight, Gift } from "lucide-react";
import { useGame } from "./GameContext";
import { GameDefinition, GameId } from "@/types/game";

const GAMES: (GameDefinition & { icon: typeof Goal })[] = [
  {
    id: "tobi-keeper",
    title: "Beat TOBi",
    tagline: "Penalty shootout vs. our AI keeper.",
    playLabel: "Take the shot",
    icon: Goal,
  },
  {
    id: "shqiperia-wheel",
    title: "Shqipëria Wheel",
    tagline: "Spin for a local partner discount.",
    playLabel: "Spin the wheel",
    icon: CircleDot,
  },
  {
    id: "culture-quiz",
    title: "10-Second Culture Quiz",
    tagline: "3 rapid questions on Albania.",
    playLabel: "Start the clock",
    icon: Timer,
  },
];

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

function formatClaimTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? `today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : date.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

export default function GameHubDashboard({
  onSelectGame,
}: {
  onSelectGame: (id: GameId) => void;
}) {
  const {
    credits,
    playedGames,
    dailyClaimAvailable,
    nextClaimAt,
    loading,
    error,
    claimDailyCredit,
  } = useGame();

  if (loading && credits === 0 && playedGames.length === 0) {
    return (
      <div className="game-hub-wrap">
        <p className="game-hub-empty-note">Loading your game hub…</p>
      </div>
    );
  }

  return (
    <div className="game-hub-wrap">
      <div className="game-hub-header">
        <div>
          <p className="game-eyebrow" style={{ color: "var(--primary)" }}>Game Hub</p>
          <h1 className="game-hub-title">One shot. Real prizes.</h1>
        </div>
        <div className="game-hub-credits">
          <span className="game-hub-credits-label">Game Credits</span>
          <span className="game-hub-credits-value">{credits}</span>
        </div>
      </div>

      <div className="game-hub-credits-mobile">
        <span className="game-hub-credits-label">Game Credits</span>
        <span className="game-hub-credits-value">{credits}</span>
      </div>

      <p className="game-hub-intro">
        You&apos;ve got {credits} credit{credits === 1 ? "" : "s"} to spend on any game below.
        Win, and the discount lands straight in your wallet pass — no app, no printout.
      </p>

      {error && <p className="game-hub-empty-note">{error}</p>}

      {dailyClaimAvailable ? (
        <button
          onClick={() => claimDailyCredit().catch(() => {})}
          className="game-btn game-btn--primary"
          style={{ marginBottom: 24 }}
        >
          <Gift size={16} />
          Claim your free daily credit
        </button>
      ) : (
        nextClaimAt && (
          <p className="game-hub-empty-note" style={{ marginBottom: 24 }}>
            You&apos;ve claimed today&apos;s free credit — your next one unlocks{" "}
            {formatClaimTime(nextClaimAt)}.
          </p>
        )
      )}

      <div className="game-hub-grid">
        {GAMES.map((game, i) => {
          const Icon = game.icon;
          const played = playedGames.includes(game.id);
          const locked = credits <= 0 && !played;

          return (
            <motion.button
              key={game.id}
              disabled={locked || played}
              onClick={() => onSelectGame(game.id)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: i * 0.08 }}
              whileHover={locked || played ? undefined : { y: -3 }}
              whileTap={locked || played ? undefined : { scale: 0.98 }}
              className="game-tile"
            >
              <div className={`game-tile-icon ${locked ? "game-tile-icon--locked" : ""}`}>
                {locked ? (
                  <Lock size={18} color="var(--text-main)" strokeWidth={2} />
                ) : (
                  <Icon size={20} color="#fff" strokeWidth={2} />
                )}
              </div>

              <h3 className="game-tile-title">{game.title}</h3>
              <p className="game-tile-tagline">{game.tagline}</p>

              {played ? (
                <span className="game-tile-played">Already played</span>
              ) : (
                <span className={`game-tile-cta ${locked ? "game-tile-cta--locked" : ""}`}>
                  {locked ? "No credits left" : game.playLabel}
                  {!locked && <ArrowRight size={12} />}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {credits <= 0 && !dailyClaimAvailable && (
        <p className="game-hub-empty-note">
          Out of credits — activate another tourist pack, or come back for your next daily credit.
        </p>
      )}
    </div>
  );
}