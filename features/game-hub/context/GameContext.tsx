"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DropResult } from "@/features/game-hub/types/game";
import { fetchGameState, claimDailyCreditApi, playDropApi, GameHubState } from "@/features/game-hub/lib/api";

interface GameContextValue {
  touristName: string;
  credits: number;
  hasPlayedToday: boolean;
  dailyClaimAvailable: boolean;
  nextClaimAt: string | null;
  loading: boolean;
  error: string | null;
  canPlay: boolean;
  refresh: () => Promise<void>;
  claimDailyCredit: () => Promise<void>;
  playDrop: () => Promise<DropResult>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
  touristId,
}: {
  children: ReactNode;
  touristId: string;
}) {
  const [touristName, setTouristName] = useState("");
  const [credits, setCredits] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [dailyClaimAvailable, setDailyClaimAvailable] = useState(false);
  const [nextClaimAt, setNextClaimAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyState = (state: GameHubState) => {
    setTouristName(state.touristFirstName);
    setCredits(state.credits);
    setHasPlayedToday(state.hasPlayedToday);
    setDailyClaimAvailable(state.dailyClaimAvailable);
    setNextClaimAt(state.nextClaimAt);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await fetchGameState(touristId);
      applyState(state);
    } catch (e: any) {
      setError(e.message || "Failed to load game hub state");
    } finally {
      setLoading(false);
    }
  }, [touristId]);

  useEffect(() => {
    if (touristId) refresh();
  }, [touristId, refresh]);

  const claimDailyCredit = async () => {
    setError(null);
    try {
      const state = await claimDailyCreditApi(touristId);
      applyState(state);
    } catch (e: any) {
      setError(e.message || "Failed to claim daily credit");
      throw e;
    }
  };

  const playDrop = async (): Promise<DropResult> => {
    setError(null);
    try {
      const res = await playDropApi(touristId);
      return { won: res.won, prize: res.won && res.prize ? res.prize : null };
    } catch (e: any) {
      setError(e.message || "Failed to play drop");
      throw e;
    } finally {
      refresh();
    }
  };

  const value = useMemo(
    () => ({
      touristName,
      credits,
      hasPlayedToday,
      dailyClaimAvailable,
      nextClaimAt,
      loading,
      error,
      canPlay: credits > 0 && !hasPlayedToday,
      refresh,
      claimDailyCredit,
      playDrop,
    }),
    [touristName, credits, hasPlayedToday, dailyClaimAvailable, nextClaimAt, loading, error, refresh]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}