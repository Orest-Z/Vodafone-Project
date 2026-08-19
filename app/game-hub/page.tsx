"use client";

import React, { useState } from "react";
import { GameProvider, useGame } from "@/components/game/GameContext";
import GameHubDashboard from "@/components/game/GameHubDashboard";
import ShqiperiaWheel from "@/components/game/ShqiperiaWheel";
import CultureQuizCard from "@/components/game/CultureQuizCard";
import TOBiKeeperGame from "@/components/game/TOBiKeeperGame";
import RewardPassReveal from "@/components/game/RewardPassReveal";

// Inner component to access the context and manage state
function GameHubContent() {
  const { recordResult } = useGame();
  
  // Manage which game overlay is open, or if the reward screen is open
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [rewardResult, setRewardResult] = useState<any | null>(null); // Uses your GameResult type implicitly

  const handleGameFinish = (result: any) => {
    recordResult(result);
    setActiveGame(null); // Close the game
    
    // If they won, show the reward pass reveal
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

// Main page wrapper providing the context
export default function GameHubPage() {
  return (
    <GameProvider>
      <GameHubContent />
    </GameProvider>
  );
}