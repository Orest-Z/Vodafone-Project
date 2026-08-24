"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GameProvider } from "@/components/game/GameContext";
import GameHubDashboard from "@/components/game/GameHubDashboard";
import ShqiperiaWheel from "@/components/game/ShqiperiaWheel";
import CultureQuizCard from "@/components/game/CultureQuizCard";
import TOBiKeeperGame from "@/components/game/TOBiKeeperGame";
import RewardPassReveal from "@/components/game/RewardPassReveal";
import type { GameResult } from "@/types/game";

// Inner component to access the context and manage state
function GameHubContent() {
  // Manage which game overlay is open, or if the reward screen is open
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [rewardResult, setRewardResult] = useState<GameResult | null>(null);

  // The mini-games call the backend themselves (via useGame().playGame)
  // and hand back whatever the server actually decided — this just
  // reacts to that outcome, it never invents one.
  const handleGameFinish = (result: GameResult) => {
    setActiveGame(null); // Close the game
    if (result.won) {
      setRewardResult(result);
    }
  };

  return (
    <main className="game-hub-main">
      {/* Dashboard handles game selection */}
      <GameHubDashboard onSelectGame={(id) => setActiveGame(id)} />

      {/* Render the Overlay if a game or reward is active */}
      {(activeGame || rewardResult) && (
        <div className="game-overlay-wrapper">
          <div
            className="game-overlay-backdrop"
            onClick={() => setActiveGame(null)} // Optional: clicking outside closes the game
          />
          <div className="game-overlay-content">
            {activeGame === "shqiperia-wheel" && (
              <ShqiperiaWheel onFinish={handleGameFinish} />
            )}
            {activeGame === "culture-quiz" && (
              <CultureQuizCard onFinish={handleGameFinish} />
            )}
            {activeGame === "tobi-keeper" && (
              <TOBiKeeperGame onFinish={handleGameFinish} />
            )}
            {rewardResult && (
              <RewardPassReveal
                result={rewardResult}
                onClose={() => setRewardResult(null)}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function GameHubWithTourist() {
  const searchParams = useSearchParams();
  const touristId = searchParams.get("touristId");

  if (!touristId) {
    return (
      <main className="game-hub-main">
        <div className="game-hub-wrap">
          <p className="game-hub-empty-note">
            We couldn&apos;t find your session. Please activate a tourist pack first to
            unlock the Game Hub.
          </p>
        </div>
      </main>
    );
  }

  return (
    <GameProvider touristId={touristId}>
      <GameHubContent />
    </GameProvider>
  );
}

// Main page wrapper — useSearchParams needs a Suspense boundary
export default function GameHubPage() {
  return (
    <Suspense fallback={<main className="game-hub-main" />}>
      <GameHubWithTourist />
    </Suspense>
  );
}