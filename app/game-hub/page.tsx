"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GameProvider } from "@/features/game-hub/context/GameContext";
import DailyDropCard from "@/features/game-hub/components/DailyDropCard";
import RewardPassReveal from "@/features/game-hub/components/RewardPassReveal";
import TodaysPrizes from "@/features/game-hub/components/TodaysPrizes";
import GameFAQ from "@/features/game-hub/components/GameFAQ";
import type { DropResult } from "@/features/game-hub/types/game";
import "@/features/game-hub/components/scratchDrop.css";

function GameHubContent({ touristId }: { touristId: string }) {
  const [rewardResult, setRewardResult] = useState<DropResult | null>(null);

  const handleFinish = (result: DropResult) => {
    if (result.won) {
      setRewardResult(result);
    }
  };

  return (
    <main className="game-hub-main">
      <DailyDropCard onFinish={handleFinish} />
      <TodaysPrizes />
      <GameFAQ />

      {rewardResult && (
        <div className="game-overlay-wrapper">
          <div className="game-overlay-backdrop" onClick={() => setRewardResult(null)} />
          <div className="game-overlay-content">
            <RewardPassReveal result={rewardResult} touristId={touristId} onClose={() => setRewardResult(null)} />
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
      <GameHubContent touristId={touristId} />
    </GameProvider>
  );
}

export default function GameHubPage() {
  return (
    <Suspense fallback={<main className="game-hub-main" />}>
      <GameHubWithTourist />
    </Suspense>
  );
}