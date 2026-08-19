"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { GameId, GameResult, Prize } from "@/types/game";

interface GameContextValue {
  credits: number;
  playedGames: GameId[];
  lastResult: GameResult | null;
  canPlay: boolean;
  spendCredit: () => boolean;
  recordResult: (result: GameResult) => void;
  clearLastResult: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
  initialCredits = 1,
}: {
  children: ReactNode;
  initialCredits?: number;
}) {
  const [credits, setCredits] = useState(initialCredits);
  const [playedGames, setPlayedGames] = useState<GameId[]>([]);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  const spendCredit = () => {
    if (credits <= 0) return false;
    setCredits((c) => c - 1);
    return true;
  };

  const recordResult = (result: GameResult) => {
    setPlayedGames((prev) =>
      prev.includes(result.gameId) ? prev : [...prev, result.gameId]
    );
    setLastResult(result);
  };

  const clearLastResult = () => setLastResult(null);

  const value = useMemo(
    () => ({
      credits,
      playedGames,
      lastResult,
      canPlay: credits > 0,
      spendCredit,
      recordResult,
      clearLastResult,
    }),
    [credits, playedGames, lastResult]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}

// Fixed prize pool tied to the existing partner network (ExclusiveOffers.tsx)
export const PRIZE_POOL: Prize[] = [
  { id: "opa", label: "15% off your bill", sponsor: "OPA", code: "VF-OPA-2291" },
  { id: "hobus", label: "15% off intercity travel", sponsor: "HOBUS Albania", code: "VF-HBS-4417" },
  { id: "mon-cheri", label: "1+1 coffee", sponsor: "Mon Cheri", code: "VF-MCH-6603" },
  { id: "burger-king", label: "10% off your order", sponsor: "Burger King", code: "VF-BKA-1258" },
  { id: "smart-taxi", label: "20% off your ride", sponsor: "Smart Taxi", code: "VF-STX-8842" },
  { id: "rentout", label: "10% off rental", sponsor: "Rentout", code: "VF-RNT-3390" },
  { id: "glow-skin", label: "10% off treatment", sponsor: "Glow Skin", code: "VF-GLW-7715" },
];

export function rollPrize(): Prize {
  return PRIZE_POOL[Math.floor(Math.random() * PRIZE_POOL.length)];
}
