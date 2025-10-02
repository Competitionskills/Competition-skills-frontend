// src/components/dashboard/leaderboardMini.tsx
import React from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { useUser } from "../../context/userContext";

/* ===== Types ===== */
type LbRow = {
  userId: string;
  name: string;
  points: number;
  competitions: number;
  prestigeTickets?: number;
  rank?: number;
};
type LbResponse = { items?: LbRow[]; top?: LbRow[]; count?: number };

const API_BASE =
  process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";
type Metric = "points" | "competitions";

/* ===== Utils ===== */
function initials(n?: string) {
  if (!n) return "??";
  const parts = n.trim().split(/\s+/).filter(Boolean);
  const two = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return (two || parts[0]?.slice(0, 2) || "??").toUpperCase();
}

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1)
    return <Trophy className="h-5 w-5 text-amber-500" aria-hidden />;
  if (rank === 2)
    return <Medal className="h-5 w-5 text-slate-400" aria-hidden />;
  if (rank === 3)
    return <Award className="h-5 w-5 text-amber-700" aria-hidden />;
  return (
    <div className="h-6 w-6 grid place-items-center rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
      {rank}
    </div>
  );
};

/* Fetch leaderboard */
async function loadLeaderboardBatch(limit = 100): Promise<LbRow[]> {
  const parse = async (res: Response) => {
    const json = (await res.json()) as LbResponse | LbRow[];
    const list = Array.isArray(json) ? json : (json.items ?? json.top ?? []);
    return (list as LbRow[]).map((r, i) => ({ ...r, rank: r.rank ?? i + 1 }));
  };

  try {
    const r = await fetch(`${API_BASE}/api/leaderboard?limit=${limit}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (r.ok) return parse(r);
  } catch {}

  try {
    const r2 = await fetch(
      `${API_BASE}/api/leaderboard/overall?limit=${limit}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (r2.ok) return parse(r2);
  } catch {}

  return [];
}

/* ===== Component ===== */
export const LeaderboardMini: React.FC<{
  title?: string;
  perView?: 3 | 4;
  viewAllHref?: string;
  defaultMetric?: Metric;
}> = ({
  title = "Leaderboard",
  perView = 4,
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

  // top N winners only
  const winners = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const av = metric === "points" ? (a.points ?? 0) : (a.competitions ?? 0);
      const bv = metric === "points" ? (b.points ?? 0) : (b.competitions ?? 0);
      return bv - av;
    });
    return arr.slice(0, perView).map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rows, metric, perView]);

  const valueOf = (r: LbRow) =>
    metric === "points" ? (r.points ?? 0) : (r.competitions ?? 0);
  const suffix = metric === "points" ? "pts" : "comps";

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-300" />
          {title}
        </h3>

        {/* Toggle buttons */}
        <div className="inline-flex rounded-full bg-white/15 p-0.5">
          {(["points", "competitions"] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                metric === m
                  ? "bg-white text-indigo-700"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {m === "points" ? "Points" : "Competitions"}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="space-y-2">
          {loading && (
            <div className="rounded-xl border p-4 text-sm text-slate-600">
              Loading leaderboard…
            </div>
          )}

          {!loading && winners.length === 0 && (
            <div className="rounded-xl border p-4 text-sm text-slate-600">
              No entries yet. Be the first to earn points!
            </div>
          )}

          {!loading &&
            winners.map((r) => {
              const isMe = String(r.userId) === myId;
              const value = valueOf(r);
              return (
                <div
                  key={`${r.userId}-${r.rank}`}
                  className={`flex items-center justify-between rounded-xl border p-3 ${
                    isMe
                      ? "bg-indigo-50/60 border-indigo-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RankBadge rank={r.rank!} />
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
    </div>
  );
};
