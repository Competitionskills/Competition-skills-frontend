// src/lib/leaderboard.ts
export type LbRow = {
  userId: string;
  name: string;
  points: number;
  prestigeTickets: number;
  competitions: number;
  ticketsUsed?: number;
  rank?: number;
};

export type LbResponse = { items?: LbRow[]; top?: LbRow[]; count?: number };

const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

/** Fetch a batch for dashboard (grab more than we show; we’ll page locally). */
export async function fetchLeaderboardBatch(limit = 100): Promise<LbRow[]> {
  const res = await fetch(`${API_BASE}/api/leaderboard?limit=${limit}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as LbResponse;
  const list = (json.items ?? json.top ?? []) as LbRow[];
  return list.map((r, i) => ({ ...r, rank: r.rank ?? i + 1 }));
}
