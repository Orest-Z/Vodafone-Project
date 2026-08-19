const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function fetchPacks() {
  const res = await fetch(`${API_BASE}/packs`);
  if (!res.ok) throw new Error("Failed to fetch packs");
  return res.json();
}

export async function fetchPackById(packId: string) {
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

export async function fetchGameState(touristId: string) {
  const res = await fetch(`${API_BASE}/game-hub/state?touristId=${touristId}`);
  if (!res.ok) throw new Error("Failed to fetch game state");
  return res.json(); // returns { credits, playedGames }
}

export async function playGameApi(gameCode: string, touristId: string) {
  const res = await fetch(`${API_BASE}/games/${gameCode}/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ touristId }),
  });
  if (!res.ok) throw new Error("Failed to play game");
  return res.json(); // returns { won, prize: { label, sponsor, code } }
}