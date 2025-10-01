import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { DailyLoginStatus } from "../../types/user";
import MyCompetitions from "./MycompetitionItems";
import type { MyCompetitionItem } from "./MycompetitionItems";
import { getCompetitionPhase } from "../../utils/competition";
import { useUser } from "../../context/userContext";
import comp1 from "../../images/competition1.jpg";
import comp2 from "../../images/competition2.jpg";
import comp3 from "../../images/competition3.jpg";
import comp4 from "../../images/competition4.jpg";
import comp5 from "../../images/competition5.jpg";
import comp6 from "../../images/competition6.jpg";
import ParticipationModal from "../participationModal";
import DailyLoginWidget from "./DailyLoginWidget";
import { LeaderboardMini } from "./leaderboardMini";
import { Star, Ticket as TicketIcon, Users, KeyRound, ChevronLeft, ChevronRight } from "lucide-react";

/* ============================ API base ============================ */
export const API_BASE =
  process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk/api";

/* ============================== Types ============================= */
type CompetitionStatus = "open" | "closed";
type Participant = { ticketId: string; userId: string };
type Competition = {
  _id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  startsAt?: string;
  endsAt: string;
  entryCost: number;
  status?: CompetitionStatus;
  participants?: Participant[];
};

type ParticipateResponse = {
  message?: string;
  error?: string;
  remainingTickets?: number;
  tickets?: { ticketId: string; userId: string }[];
  cost?: number;
};

const normalizeId = (v: any) =>
  String(v?._id ?? v?.id ?? (typeof v === "object" ? v?.toString?.() : v) ?? "");

/* ============================ Images ============================== */
const CASH_IMAGES = [comp1, comp2, comp3, comp4, comp5, comp6];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
function imageFor(c: Competition) {
  if (c.bannerUrl) return c.bannerUrl;
  const idx = Math.abs(hashStr(c._id || c.title || "")) % CASH_IMAGES.length;
  return CASH_IMAGES[idx];
}

/* ============================ Props =============================== */
interface MainContentProps {
  userName: string | null;
  activeTab: string;
  userPoints: number;
  userPrestigeTickets: number;
  loginStatus: DailyLoginStatus;
  updatePoints: (points: number) => void;
  updatePrestigeTickets: (tickets: number) => void;
  updateLoginStatus: (status: DailyLoginStatus) => void;
  onOpenSubmitCode: () => void;
}

type Filter = "all" | "open" | "closed";

/* ============================== Helpers =========================== */
const displayNameFromUser = (u: any, fallback?: string | null) => {
  if (fallback) return fallback;
  return (
    u?.name ??
    u?.fullName ??
    u?.username ??
    (typeof u?.email === "string" ? u.email.split("@")[0] : undefined) ??
    localStorage.getItem("displayName") ??
    null
  );
};

/* ====================== Overview (compact card) =================== */
const OverviewCompactCard: React.FC<{
  totalPoints: number;
  prestigeTickets: number;
  referrals: number;
  codesSubmitted: number;
  pointsPerTicket?: number;
  onOpenSubmitCode?: () => void;
}> = ({
  totalPoints,
  prestigeTickets,
  referrals,
  codesSubmitted,
  pointsPerTicket = 10,
  onOpenSubmitCode,
}) => {
  const progress = Math.max(0, Math.min(1, (totalPoints % pointsPerTicket) / pointsPerTicket));
  const remainder = totalPoints % pointsPerTicket;
  const ptsToNext = remainder === 0 ? pointsPerTicket : pointsPerTicket - remainder;

  const Tile = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
  }) => (
    <div className="flex items-center gap-3 rounded-xl border border-indigo-50 bg-white/80 px-4 py-3">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-extrabold leading-tight text-slate-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/70 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-indigo-900">Overview</h3>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Tile icon={<Star className="h-5 w-5 text-indigo-600" />} label="Points" value={totalPoints} />
        <Tile icon={<TicketIcon className="h-5 w-5 text-indigo-600" />} label="Tickets" value={prestigeTickets} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Tile icon={<Users className="h-5 w-5 text-indigo-600" />} label="Referrals" value={referrals} />
        <Tile icon={<KeyRound className="h-5 w-5 text-indigo-600" />} label="Codes" value={codesSubmitted} />
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">Next prestige ticket</div>
          <div className="text-xs text-slate-500">{Math.floor(progress * 100)}%</div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-600">
          {progress === 0
            ? `Earn ${pointsPerTicket} pts to get a ticket`
            : `${ptsToNext} pts to your next ticket`}
        </div>

        <div className="mt-3 text-sm">
          <button
            type="button"
            onClick={onOpenSubmitCode}
            className="font-medium text-indigo-700 hover:text-indigo-800 hover:underline"
          >
            Submit code
          </button>{" "}
          to earn points.
        </div>
      </div>
    </div>
  );
};

/* =============================== Main =============================== */
const MainContent: React.FC<MainContentProps> = ({
  userName,
  activeTab,
  userPoints,
  userPrestigeTickets,
  loginStatus,
  updatePoints,
  updatePrestigeTickets,
  updateLoginStatus,
  onOpenSubmitCode,
}) => {
  const { user } = useUser();
  const displayName = useMemo(() => displayNameFromUser(user, userName), [user, userName]);

  const [comps, setComps] = useState<Competition[]>([]);
  const [loadingComps, setLoadingComps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("open");

  const [page, setPage] = useState(0);
  const perPage = 3;

  const [myCompItems, setMyCompItems] = useState<MyCompetitionItem[]>([]);

  const [participate, setParticipate] = useState<{ open: boolean; comp: Competition | null }>({
    open: false,
    comp: null,
  });
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------- Fetch competitions ---------------------- */
// Make fetchAll NOT create/return a controller; just accept a signal.
const fetchAll = useCallback(async (signal?: AbortSignal) => {
  try {
    setLoadingComps(true);
    setError(null);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/competitions`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list: Competition[] = await res.json();
    setComps(list);
  } catch (e: any) {
    if (e.name !== "AbortError") {
      console.error("Failed to load competitions:", e);
      setComps([]);
      setError("Could not load competitions. Please try again.");
    }
  } finally {
    setLoadingComps(false);
  }
}, []);


  useEffect(() => {
  const ctrl = new AbortController();
  fetchAll(ctrl.signal);
  return () => ctrl.abort();
}, [fetchAll]);

  // If default 'open' shows nothing, fall back to 'all'
  useEffect(() => {
    if (filter !== "open" || comps.length === 0) return;
    const anyOpen = comps.some((c) => {
      const { phase } = getCompetitionPhase({
        _id: c._id,
        title: c.title,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
      });
      return phase === "open";
    });
    if (!anyOpen) setFilter("all");
  }, [comps, filter]);

  /* -------------------- Build "My Competitions" ------------------- */
  useEffect(() => {
    type AnyUser = { _id?: any; id?: any; userId?: any } | null | undefined;
    const currentUserId = normalizeId(
      (user as AnyUser)?._id ??
        (user as AnyUser)?.id ??
        (user as AnyUser)?.userId ??
        localStorage.getItem("userId") ??
        ""
    );

    const items: MyCompetitionItem[] = comps
      .map((c) => {
        const ticketsUsed = (c.participants || []).filter((p: any) => {
          const pid = normalizeId(p.userId ?? p.user ?? p.uid);
          return pid && pid === currentUserId;
        }).length;

        return {
          competitionId: c._id,
          competitionName: c.title,
          ticketsUsed,
          startsAt: c.startsAt,
          endsAt: c.endsAt,
        };
      })
      .filter((it) => it.ticketsUsed > 0);

    setMyCompItems(items);
  }, [comps, user]);

  /* ------------------- Filter + Pagination memo ------------------- */
  const filteredComps = useMemo(() => {
    return comps.filter((c) => {
      if (filter === "all") return true;
      const { phase } = getCompetitionPhase({
        _id: c._id,
        title: c.title,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
      });
      return filter === "open" ? phase === "open" : phase === "ended";
    });
  }, [comps, filter]);

  useEffect(() => {
    setPage(0);
  }, [filter, filteredComps.length]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(filteredComps.length / perPage)),
    [filteredComps.length]
  );
  const start = page * perPage;
  const visibleComps = filteredComps.slice(start, start + perPage);

  /* ----------------------- Participation flow --------------------- */
  const askParticipate = (c: Competition) => {
    const { isOpen } = getCompetitionPhase({
      _id: c._id,
      title: c.title,
      startsAt: c.startsAt,
      endsAt: c.endsAt,
    });
    if (!isOpen) return;
    setParticipate({ open: true, comp: c });
  };

const onConfirmParticipate = async (c: { _id: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      // keep using alert for auth issues if you want
      alert("Please log in first.");
      return;
    }

    setSubmitting(true);
    setJoiningId(c._id);

    const res = await fetch(`${API_BASE}/competitions/${c._id}/participate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ticketCount: 1 }),
    });

    const data: ParticipateResponse = await res.json();
    if (!res.ok) throw new Error(data?.message || data?.error || "Failed to participate");

    // ✅ Do NOT close the modal and do NOT alert here.
    // ParticipationModal will flip to its success screen when onConfirm resolves.
    await fetchAll(); // refresh the list while the success screen shows
  } catch (e: any) {
    // You can still surface errors
    alert(e?.message || "Could not participate");
    throw e; // let the modal keep the form phase
  } finally {
    setSubmitting(false);
    setJoiningId(null);
  }
};



  /* ------------------ Daily login: optimistic UI ------------------ */
  const handleClaimDaily = async (pointsAwarded: number, ticketsAwarded: number) => {
    // optimistic UI
    updatePoints(userPoints + pointsAwarded);
    if (ticketsAwarded) updatePrestigeTickets(userPrestigeTickets + ticketsAwarded);
    updateLoginStatus({
      ...loginStatus,
      currentStreak: (loginStatus?.currentStreak ?? 0) + 1,
      claimedToday: true,
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/rewards/daily-login/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) console.warn("Daily claim API returned non-OK; kept optimistic UI.");
      await fetchAll();
    } catch (e) {
      console.warn("Daily claim API failed; kept optimistic UI.", e);
    }
  };

  /* ============================== Render ============================== */
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="w-full py-6 px-4 md:px-6 pb-20 md:pb-10">
        {/* Welcome banner */}
        <section className="mb-6">
          <div className="rounded-2xl border border-indigo-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Welcome back{displayName ? `, ${displayName}` : ""} <span aria-hidden>👋</span>
            </h1>
            <p className="text-sm md:text-base text-slate-600 mt-1">
              {typeof loginStatus?.currentStreak === "number" && loginStatus.currentStreak > 0
                ? `You’ve logged in ${loginStatus.currentStreak} day${loginStatus.currentStreak === 1 ? "" : "s"} in a row!`
                : "Great to see you again."}
            </p>
          </div>
        </section>

        {/* Row: Overview • Daily Login • Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <OverviewCompactCard
            totalPoints={(user as any)?.points ?? userPoints}
            prestigeTickets={(user as any)?.prestigeTickets ?? userPrestigeTickets}
            referrals={
              Array.isArray((user as any)?.referrals)
                ? (user as any).referrals.length
                : (user as any)?.referrals ?? 0
            }
            codesSubmitted={(user as any)?.codesSubmitted ?? 0}
            pointsPerTicket={10}
            onOpenSubmitCode={onOpenSubmitCode}
          />

          <DailyLoginWidget
            userPoints={(user as any)?.points ?? userPoints}
            userPrestigeTickets={(user as any)?.prestigeTickets ?? userPrestigeTickets}
            onRewardClaimed={handleClaimDaily}
          />

          <LeaderboardMini perView={5} viewAllHref="/leaderboard" />
        </div>

        {/* Competitions */}
        <div className="grid grid-cols-1 gap-6">
          {activeTab !== "referrals" && (
            <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-indigo-800">Competitions</h3>

                <div className="flex items-center gap-2">
                  {(["all", "open", "closed"] as Filter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`rounded-full px-3 py-1 text-sm font-medium border ${
                        filter === f
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                      }`}
                      aria-pressed={filter === f}
                      aria-label={`Show ${f} competitions`}
                    >
                      {f[0].toUpperCase() + f.slice(1)}
                    </button>
                  ))}

                  {/* Pagination arrows */}
                  {filteredComps.length > perPage && (
                    <div className="ml-2 inline-flex rounded-lg border border-indigo-200 overflow-hidden">
                      <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-2 py-1.5 disabled:opacity-40"
                        title="Previous"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                        disabled={page >= pageCount - 1}
                        className="px-2 py-1.5 disabled:opacity-40"
                        title="Next"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Loading / Error / Empty */}
              {loadingComps && (
                <div className="rounded-xl border p-6 text-sm text-gray-600">Loading competitions…</div>
              )}
              {!loadingComps && error && (
                <div className="rounded-xl border p-6 text-sm text-rose-700 bg-rose-50 flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    onClick={() => fetchAll()}
                    className="ml-3 px-3 py-1 rounded bg-rose-600 text-white text-xs"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loadingComps && !error && filteredComps.length === 0 && (
                <div className="rounded-xl border p-6 text-sm text-gray-600">No competitions found.</div>
              )}

              {/* Cards */}
              {!loadingComps && !error && filteredComps.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {visibleComps.map((c) => {
                      const { phase, isOpen, timeLabel } = getCompetitionPhase({
                        _id: c._id,
                        title: c.title,
                        startsAt: c.startsAt,
                        endsAt: c.endsAt,
                      });

                      const badgeClass =
                        phase === "open"
                          ? "bg-green-100 text-green-800"
                          : phase === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-800";

                      return (
                        <div
                          key={c._id}
                          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img src={imageFor(c)} alt={c.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            <div className="absolute bottom-3 left-3 text-white">
                              <h4 className="font-bold text-lg mb-1">{c.title}</h4>
                              <p className="text-sm opacity-90">{timeLabel}</p>
                            </div>

                            <div className="absolute top-3 right-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                                {phase}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Entry Cost</p>
                                <p className="text-lg font-bold text-green-600">
                                  {c.entryCost} prestige ticket{c.entryCost > 1 ? "s" : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Participants</p>
                                <p className="font-bold text-indigo-600">
                                  {(c.participants?.length ?? 0).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <button
                              disabled={!isOpen || joiningId === c._id}
                              onClick={() => askParticipate(c)}
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                              aria-label={isOpen ? `Participate in ${c.title}` : `${c.title} is closed`}
                            >
                              {joiningId === c._id ? "Joining…" : isOpen ? "Participate Now" : "Closed"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* View all */}
                  <div className="flex justify-center">
                    <Link
                      to="/competitions"
                      className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                      View all
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* My Competitions */}
          <div id="my-competitions" className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-800">My Competitions</h3>
            </div>
            <MyCompetitions items={myCompItems} />
          </div>
        </div>
      </main>

      {/* Participation modal */}
     <ParticipationModal
  open={participate.open}
  competition={participate.comp}
  onClose={() => setParticipate({ open: false, comp: null })}
  onConfirm={(c) => onConfirmParticipate(c)}   // should resolve or throw
  isSubmitting={submitting}
/>


    </div>
  );
};

export default MainContent;
