export type GameId = "tobi-keeper" | "shqiperia-wheel" | "culture-quiz";

// The frontend's GameId values don't match the backend's `games.code`
// column (checked directly in Supabase: beat_tobi / shqiperia_wheel /
// albanian_quiz) — these maps translate between them so nothing else in
// the app has to know about the backend's naming.
export const GAME_CODE_BY_ID: Record<GameId, string> = {
  "tobi-keeper": "beat_tobi",
  "shqiperia-wheel": "shqiperia_wheel",
  "culture-quiz": "albanian_quiz",
};

export const GAME_ID_BY_CODE: Record<string, GameId> = {
  beat_tobi: "tobi-keeper",
  shqiperia_wheel: "shqiperia-wheel",
  albanian_quiz: "culture-quiz",
};

// Matches the backend's PlayGameResponse.PrizeDetails exactly — no `id`
// field, the backend doesn't send one.
export interface Prize {
  label: string; // e.g. "15% OFF Green Taxi"
  sponsor: string; // e.g. "Green Taxi"
  code: string; // barcode payload, e.g. "VF-REWARD-8842"
}

export interface GameResult {
  gameId: GameId;
  won: boolean;
  prize: Prize | null;
}

export interface GameDefinition {
  id: GameId;
  title: string;
  tagline: string;
  playLabel: string;
}