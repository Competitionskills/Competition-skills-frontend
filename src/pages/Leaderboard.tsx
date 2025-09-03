// src/pages/Leaderboard.tsx
import React from "react";
import { Trophy, Medal, Award, Crown, Star, Flame } from "lucide-react";
import Header from "../components/Header";
import { Footer } from "../components/footer";
import BackgroundImage from "../images/background-img.jpg";
import { useUser } from "../context/userContext";

type Row = {
  userId: string;
  name: string;
  points: number;
  prestigeTickets: number;
  competitions: number;
  ticketsUsed?: number;
  rank?: number;
};

type ApiItems = { items?: Row[]; top?: Row[]; count?: number };

const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";
const PER_PAGE = 20;

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative animate-pulse">
        <Crown className="w-7 h-7 text-yellow-400" />
        <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" />
      </div>
    );
  }
  if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
  if (rank === 3) return <Award className="w-6 h-6 text-amber-700" />;
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-sm">{rank}</span>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useUser();

  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // sorting state
  const [sortBy, setSortBy] = React.useState<"points" | "competitions" | "tickets">("points");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  // pagination state
  const [page, setPage] = React.useState(1);

  // normalize either {items:[...]} (new) or {top:[...]} (fallback)
  const normalize = (payload: ApiItems): Row[] => {
    const list = (payload.items ?? payload.top ?? []) as Row[];
    return list.map((r, i) => ({ ...r, rank: r.rank ?? i + 1 }));
  };

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE}/api/leaderboard?limit=200`, {
          headers: { "Content-Type": "application/json" }, // public route; no auth needed
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiItems;
        setRows(normalize(json));
      } catch (e: any) {
        setErr(e.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const myId = String(
    (user as any)?._id ??
      (user as any)?.id ??
      localStorage.getItem("userId") ??
      ""
  );

  // derived sorted rows (and recompute rank after sorting)
  const sortedRows = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === "points") {
        valA = a.points; valB = b.points;
      } else if (sortBy === "competitions") {
        valA = a.competitions; valB = b.competitions;
      } else {
        valA = a.prestigeTickets; valB = b.prestigeTickets; // "tickets" == prestigeTickets
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });
    // rank is global (not per page)
    return arr.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rows, sortBy, sortDir]);

  // reset to first page whenever sorting changes
  React.useEffect(() => {
    setPage(1);
  }, [sortBy, sortDir]);

  // pagination slices
  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const startIdx = (page - 1) * PER_PAGE;
  const endIdx = Math.min(startIdx + PER_PAGE, total);
  const pageRows = sortedRows.slice(startIdx, endIdx);

  function toggleSort(col: "points" | "competitions" | "tickets") {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  const SortHeader: React.FC<{ label: string; col: "points" | "competitions" | "tickets" }> = ({ label, col }) => (
    <button
      onClick={() => toggleSort(col)}
      className="text-lg font-bold text-indigo-200 uppercase tracking-wider text-center cursor-pointer select-none"
      title={`Sort by ${label}`}
    >
      {label} {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </button>
  );

  // page number buttons (compact window)
  const pageWindow = React.useMemo(() => {
    const windowSize = 7;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div
        className="relative flex-grow bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm" />

        <div className="relative py-6 px-6 sm:px-8 lg:px-10 w-full max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-6 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Trophy className="w-12 h-10 text-yellow-600" />
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-400">
                LEADERBOARD
              </h1>
              <Trophy className="w-12 h-10 text-yellow-600" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <p className="text-indigo-600 font-semibold text-xl tracking-wide">
                Global Rankings
              </p>
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>

          {/* Errors / Loading */}
          {err && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {err}
            </div>
          )}
          {loading && (
            <div className="mb-4 rounded-xl border border-indigo-200 bg-white/60 p-4 animate-pulse text-indigo-700">
              Loading leaderboard…
            </div>
          )}

          {/* Table */}
          {!loading && sortedRows.length > 0 && (
            <>
              <div className="bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 rounded-3xl border border-indigo-400/30 overflow-hidden backdrop-blur-xl w-full">
                <div className="grid grid-cols-5 px-6 py-3 bg-gradient-to-r from-indigo-950/50 to-indigo-900/50 border-b border-indigo-400/30">
                  <div className="text-lg font-bold text-indigo-200 uppercase tracking-wider text-center">Rank</div>
                  <div className="text-lg font-bold text-indigo-200 uppercase tracking-wider text-center">Player Name</div>
                  <SortHeader label="Competitions" col="competitions" />
                  <SortHeader label="Prestige Tickets" col="tickets" />
                  <SortHeader label="Points" col="points" />
                </div>

                {pageRows.map((r, idx) => {
                  const isMe = String(r.userId) === myId;
                  const rank = r.rank ?? (startIdx + idx + 1);

                  const rowBg =
                    rank === 1
                      ? "bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-indigo-600/30"
                      : isMe
                      ? "bg-indigo-500/20"
                      : "hover:bg-indigo-500/10";
                  const divider = startIdx + idx !== endIdx - 1 ? "border-b border-indigo-400/30" : "";

                  return (
                    <div
                      key={`${r.userId}-${startIdx + idx}`}
                      className={`grid grid-cols-5 px-6 py-3 items-center text-center ${rowBg} ${divider} transition-all duration-300 ease-in-out relative group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="flex justify-center relative">
                        <RankIcon rank={rank} />
                      </div>

                      <div className="text-white font-semibold text-lg flex items-center justify-center gap-2 relative">
                        {r.name}
                        {rank === 1 && <Crown className="w-5 h-5 text-yellow-400" />}
                        {isMe && (
                          <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-indigo-200 text-indigo-900">
                            You
                          </span>
                        )}
                      </div>

                      <div className="text-indigo-200 text-lg">{r.competitions}</div>

                      <div className="text-indigo-200 text-lg">
                        {r.prestigeTickets.toLocaleString()}
                      </div>

                      <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-xl">
                        {r.points.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-indigo-900">
                  Showing <span className="font-semibold">{startIdx + 1}</span>–
                  <span className="font-semibold">{endIdx}</span> of{" "}
                  <span className="font-semibold">{total}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>

                  {pageWindow[0] > 1 && (
                    <>
                      <button
                        className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50"
                        onClick={() => setPage(1)}
                      >
                        1
                      </button>
                      {pageWindow[0] > 2 && <span className="px-2 text-indigo-700">…</span>}
                    </>
                  )}

                  {pageWindow.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        p === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {pageWindow[pageWindow.length - 1] < totalPages && (
                    <>
                      {pageWindow[pageWindow.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-indigo-700">…</span>
                      )}
                      <button
                        className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50"
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 disabled:opacity-50"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-indigo-600 text-lg font-medium flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Click headers to sort ascending/descending — 20 per page
                  <Star className="w-5 h-5 text-yellow-400" />
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
