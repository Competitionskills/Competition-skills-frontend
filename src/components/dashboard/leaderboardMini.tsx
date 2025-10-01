// src/components/dashboard/leaderboardMini.tsx
import React from "react";
import { Trophy, Medal, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "../../context/userContext";

/* ===== Types ===== */
type LbRow = {
  userId: string;
  name: string;
  points: number;
  competitions: number;
  prestigeTickets?: number; // kept for compatibility
  rank?: number;
};
type LbResponse = { items?: LbRow[]; top?: LbRow[]; count?: number };

const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

type Metric = "points" | "competitions";

/* ===== Utils ===== */
function initials(n?: string) {
  if (!n) return "??";
  const parts = n.trim().split(/\s+/).filter(Boolean);
  const two = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return (two || parts[0]?.slice(0, 2) || "??").toUpperCase();
}

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" aria-hidden />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" aria-hidden />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-700" aria-hidden />;
  return (
    <div className="h-6 w-6 grid place-items-center rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
      {rank}
    </div>
  );
};

/* Fetch once (no timeframe) with graceful fallback */
async function loadLeaderboardBatch(limit = 100): Promise<LbRow[]> {
  const parse = async (res: Response) => {
    const json = (await res.json()) as LbResponse | LbRow[];
    const list = Array.isArray(json) ? json : (json.items ?? json.top ?? []);
    return (list as LbRow[]).map((r, i) => ({ ...r, rank: r.rank ?? i + 1 }));
  };

  // primary: /api/leaderboard?limit=..
  try {
    const r = await fetch(`${API_BASE}/api/leaderboard?limit=${limit}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (r.ok) return parse(r);
  } catch {}

  // fallback: /api/leaderboard/overall?limit=..
  try {
    const r2 = await fetch(`${API_BASE}/api/leaderboard/overall?limit=${limit}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (r2.ok) return parse(r2);
  } catch {}

  // final fallback: empty
  return [];
}

/* ===== Component ===== */
export const LeaderboardMini: React.FC<{
  title?: string;
  perView?: number;
  viewAllHref?: string;
  defaultMetric?: Metric; // "points" | "competitions"
}> = ({
  title = "Leaderboard",
  perView = 5,
  viewAllHref = "/leaderboard",
  defaultMetric = "points",
}) => {
  const { user } = useUser();
  const myId = String(
    (user as any)?._id ??
      (user as any)?.id ??
      (user as any)?.userId ??
      localStorage.getItem("userId") ??
      ""
  );

  const [metric, setMetric] = React.useState<Metric>(defaultMetric);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<LbRow[]>([]);
  const [page, setPage] = React.useState(0);

  // fetch once
  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await loadLeaderboardBatch(100);
        setRows(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // sort by metric (desc)
  const sorted = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const av = metric === "points" ? (a.points ?? 0) : (a.competitions ?? 0);
      const bv = metric === "points" ? (b.points ?? 0) : (b.competitions ?? 0);
      return bv - av;
    });
    return arr.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rows, metric]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / perView));
  const start = page * perView;
  const visible = sorted.slice(start, start + perView);

  React.useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [page, pageCount]);

  const valueOf = (r: LbRow) => (metric === "points" ? r.points ?? 0 : r.competitions ?? 0);
  const suffix = metric === "points" ? "pts" : "comps";

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" /> {title}
        </h3>

        {/* Metric pills + arrows */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex rounded-full border border-indigo-200 p-0.5">
            {(["points", "competitions"] as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  metric === m ? "bg-indigo-600 text-white" : "text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                {m === "points" ? "Points" : "Competitions"}
              </button>
            ))}
          </div>

          {sorted.length > perView && (
            <div className="inline-flex rounded-lg border border-indigo-200 overflow-hidden shrink-0">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-2 py-1.5 disabled:opacity-40"
                title="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
                className="px-2 py-1.5 disabled:opacity-40"
                title="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading && (
          <div className="rounded-xl border p-4 text-sm text-slate-600">
            Loading leaderboard…
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="rounded-xl border p-4 text-sm text-slate-600">
            No entries yet. Be the first to earn points!
          </div>
        )}

        {!loading &&
          visible.map((r, i) => {
            const rank = r.rank ?? start + i + 1;
            const isMe = String(r.userId) === myId;
            const value = valueOf(r);
            return (
              <div
                key={`${r.userId}-${rank}`}
                className={`flex items-center justify-between rounded-xl border p-3 ${
                  isMe ? "bg-indigo-50/60 border-indigo-200" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RankBadge rank={rank} />
                  <div className="h-8 w-8 grid place-items-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {initials(r.name)}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate max-w-[160px]">
                    {r.name || "Player"}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">
                    {value.toLocaleString()}
                  </span>{" "}
                  {suffix}
                </div>
              </div>
            );
          })}
      </div>

      {/* View all */}
      <div className="mt-4 flex justify-center">
        <a
          href={viewAllHref}
          className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          View full leaderboard
        </a>
      </div>
    </div>
  );
};
