import type { PackDetails } from "@/features/activation/types/tourist";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function fetchPacks(): Promise<PackDetails[]> {
  const res = await fetch(`${API_BASE}/packs`);
  if (!res.ok) throw new Error("Failed to fetch packs");
  return res.json();
}

export async function fetchPackById(packId: string): Promise<PackDetails> {
  const res = await fetch(`${API_BASE}/packs/${packId}`);
  if (!res.ok) throw new Error("Failed to fetch pack details");
  return res.json();
}

export async function submitActivation(payload: any) {
  const res = await fetch(`${API_BASE}/activations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Activation failed");
  return res.json(); // returns { subscriptionId, touristId, orderRef, status }
}

// Matches al.vodafone.vodafone_project_backend.dto.GameHubStateResponse
export interface GameHubState {
  credits: number;
  playedGames: string[]; // backend game codes, e.g. "beat_tobi"
  dailyClaimAvailable: boolean;
  nextClaimAt: string | null; // ISO instant, null when claimable now
}

// Matches al.vodafone.vodafone_project_backend.dto.PlayGameResponse
export interface PlayGameApiResult {
  won: boolean;
  prize: { label: string; sponsor: string; code: string } | null;
}

// Small helper: every backend error comes back as { error: "..." } via
// GlobalExceptionHandler — surface that message instead of a generic one
// so e.g. "Daily game credit already claimed for today." reaches the UI.
async function parseOrThrow<T>(res: Response, fallbackMessage: string): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && data.error) || fallbackMessage);
  }
  return data as T;
}

export async function fetchGameState(touristId: string): Promise<GameHubState> {
  const res = await fetch(`${API_BASE}/game-hub/state?touristId=${touristId}`);
  return parseOrThrow<GameHubState>(res, "Failed to fetch game state");
}

export async function claimDailyCreditApi(touristId: string): Promise<GameHubState> {
  const res = await fetch(`${API_BASE}/game-hub/claim-daily-credit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ touristId }),
  });
  return parseOrThrow<GameHubState>(res, "Failed to claim daily credit");
}

export async function playGameApi(gameCode: string, touristId: string): Promise<PlayGameApiResult> {
  const res = await fetch(`${API_BASE}/games/${gameCode}/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ touristId }),
  });
  return parseOrThrow<PlayGameApiResult>(res, "Failed to play game");
}