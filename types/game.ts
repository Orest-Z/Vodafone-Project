export type GameId = "tobi-keeper" | "shqiperia-wheel" | "culture-quiz";

export interface Prize {
  id: string;
  label: string; // e.g. "15% OFF Green Taxi"
  sponsor: string; // e.g. "Green Taxi"
  code: string; // barcode payload, e.g. "VF-TOBI-8842"
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
