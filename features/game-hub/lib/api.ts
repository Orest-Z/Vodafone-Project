const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export interface GameHubState {
  touristFirstName: string;
  credits: number;
  hasPlayedToday: boolean;
  dailyClaimAvailable: boolean;
  nextClaimAt: string | null;
}

export interface PlayGameApiResult {
  won: boolean;
  prize: { label: string; sponsor: string; code: string } | null;
}

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

export async function playDropApi(touristId: string): Promise<PlayGameApiResult> {
  const res = await fetch(`${API_BASE}/drop/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ touristId }),
  });
  return parseOrThrow<PlayGameApiResult>(res, "Failed to play drop");
}
export interface PrizeCatalogEntry {
  label: string;
  sponsor: string | null;
  discountPercent: number | null;
  chancePercent: number;
}

export async function fetchPrizeCatalog(): Promise<PrizeCatalogEntry[]> {
  const res = await fetch(`${API_BASE}/game-hub/prizes`);
  return parseOrThrow<PrizeCatalogEntry[]>(res, "Failed to fetch prize catalog");
}

export interface SponsorOffer {
  name: string;
  discountLabel: string;
  logoUrl: string | null;
}

export async function fetchSponsorOffers(): Promise<SponsorOffer[]> {
  const res = await fetch(`${API_BASE}/packs/sponsors`);
  return parseOrThrow<SponsorOffer[]>(res, "Failed to fetch sponsor offers");
}