"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { GameId, GameResult, GAME_CODE_BY_ID, GAME_ID_BY_CODE } from "@/types/game";
import { fetchGameState, claimDailyCreditApi, playGameApi, GameHubState } from "@/lib/api";

interface GameContextValue {
  credits: number;
  playedGames: GameId[];
  dailyClaimAvailable: boolean;
  nextClaimAt: string | null;
  loading: boolean;
  error: string | null;
  canPlay: boolean;
  refresh: () => Promise<void>;
  claimDailyCredit: () => Promise<void>;
  // Calls the backend to actually play a game and returns the
  // server-decided outcome. Throws on failure (already played,
  // insufficient credits, network error, etc.) — callers should catch it.
  playGame: (gameId: GameId) => Promise<GameResult>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
  touristId,
}: {
  children: ReactNode;
  touristId: string;
}) {
  const [credits, setCredits] = useState(0);
  const [playedGames, setPlayedGames] = useState<GameId[]>([]);
  const [dailyClaimAvailable, setDailyClaimAvailable] = useState(false);
  const [nextClaimAt, setNextClaimAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyState = (state: GameHubState) => {
    setCredits(state.credits);
    setPlayedGames(
      state.playedGames
        .map((code) => GAME_ID_BY_CODE[code])
        .filter((id): id is GameId => Boolean(id))
    );
    setDailyClaimAvailable(state.dailyClaimAvailable);
    setNextClaimAt(state.nextClaimAt);
  };

  // The single source of truth for credits/playedGames is always this
  // fetch — never a local decrement. That's what makes a page refresh
  // (or opening the hub in a second tab) safe: it re-reads the real
  // server state instead of re-seeding a default.
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

  const playGame = async (gameId: GameId): Promise<GameResult> => {
    setError(null);
    const code = GAME_CODE_BY_ID[gameId];
    try {
      const res = await playGameApi(code, touristId);
      return {
        gameId,
        won: res.won,
        prize: res.won && res.prize ? res.prize : null,
      };
    } catch (e: any) {
      setError(e.message || "Failed to play game");
      throw e;
    } finally {
      // Re-sync from the server either way — a failed play might mean our
      // local view was stale (e.g. already played in another tab), and a
      // successful one definitely changed credits/playedGames.
      refresh();
    }
  };

  const value = useMemo(
    () => ({
      credits,
      playedGames,
      dailyClaimAvailable,
      nextClaimAt,
      loading,
      error,
      canPlay: credits > 0,
      refresh,
      claimDailyCredit,
      playGame,
    }),
    [credits, playedGames, dailyClaimAvailable, nextClaimAt, loading, error, refresh]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}