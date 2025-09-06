import React, { useState, useEffect, useCallback } from "react";
import { Search, Bell } from "lucide-react";
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
import ParticipationModal from "../participationModal"; // adjust if your path differs

// ===== API + types =====
const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

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
  // 👇 make optional to avoid TS mismatch with modal
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

// local images pool
const CASH_IMAGES = [comp1, comp2, comp3, comp4, comp5, comp6];
function imageFor(c: Competition) {
  if (c.bannerUrl) return c.bannerUrl;
  const i = Math.floor(Math.random() * CASH_IMAGES.length);
  return CASH_IMAGES[i];
}

interface MainContentProps {
  userName: string | null;
  activeTab: string;
  userPoints: number;
  userPrestigeTickets: number;
  loginStatus: DailyLoginStatus;
  updatePoints: (points: number) => void;
  updatePrestigeTickets: (tickets: number) => void;
  updateLoginStatus: (status: DailyLoginStatus) => void;
}

type Filter = "all" | "open" | "closed";

const MainContent: React.FC<MainContentProps> = ({
  userName,
  activeTab,
  userPoints,
  userPrestigeTickets,
  loginStatus,
  updatePoints,
  updatePrestigeTickets,
  updateLoginStatus,
}) => {
  const { user, refreshUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [nextReward, setNextReward] = useState({ points: 100, prestigeTickets: 0 });

  // competitions + ui state
  const [comps, setComps] = useState<Competition[]>([]);
  const [loadingComps, setLoadingComps] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // my competitions table
  const [myCompItems, setMyCompItems] = useState<MyCompetitionItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  // ✅ NEW: big participation modal state (INSIDE the component)
  const [participate, setParticipate] = useState<{ open: boolean; comp: Competition | null }>({
    open: false,
    comp: null,
  });
  const [submitting, setSubmitting] = useState(false);

  // next daily reward
  useEffect(() => {
    if (loginStatus) {
      const nextDay = (loginStatus.currentStreak || 0) + 1;
      const isDay7 = nextDay % 7 === 0;
      setNextReward({ points: isDay7 ? 500 : 100, prestigeTickets: isDay7 ? 1 : 0 });
    }
  }, [loginStatus]);

  // central fetch
  const fetchAll = useCallback(async () => {
    try {
      setLoadingComps(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/competitions`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const list: Competition[] = await res.json();
      setComps(list);
    } catch (e) {
      console.error("Failed to load competitions:", e);
      setComps([]);
    } finally {
      setLoadingComps(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // build "My Competitions" from comps + current user
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

  // filtered list by phase
  const filteredComps = comps.filter((c) => {
    if (filter === "all") return true;
    const { phase } = getCompetitionPhase({
      _id: c._id,
      title: c.title,
      startsAt: c.startsAt,
      endsAt: c.endsAt,
    });
    return filter === "open" ? phase === "open" : phase === "ended";
  });

  // open modal
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

  // confirm from modal
  // (Use a wide param type to avoid type mismatch with the modal)
  const onConfirmParticipate = async (c: { _id: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");

      setSubmitting(true);
      setJoiningId(c._id);

      const res = await fetch(`${API_BASE}/api/competitions/${c._id}/participate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ticketCount: 1 }),
      });

      const data: ParticipateResponse = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Failed to participate");

      setParticipate({ open: false, comp: null });

      // Soft, authoritative refresh
      await Promise.all([refreshUser(), fetchAll()]);

      alert("Entered successfully!");
    } catch (e: any) {
      alert(e?.message || "Could not participate");
    } finally {
      setSubmitting(false);
      setJoiningId(null);
    }
  };

  // daily reward
  const handleClaimReward = async () => {
    if (loginStatus.claimedToday || isLoading) return;
    setIsLoading(true);
    try {
      const newStatus: DailyLoginStatus = {
        ...loginStatus,
        currentStreak: loginStatus.currentStreak + 1,
        claimedToday: true,
      };
      updateLoginStatus(newStatus);
      updatePoints(userPoints + nextReward.points);
      if (nextReward.prestigeTickets > 0) {
        updatePrestigeTickets(userPrestigeTickets + nextReward.prestigeTickets);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10 hidden md:block">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 placeholder-gray-400 w-64"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full bg-white hover:bg-indigo-100 transition-colors">
              <Bell className="h-5 w-5 text-indigo-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold ring-2 ring-indigo-300">
              {userName ? userName.substring(0, 2).toUpperCase() : "??"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 md:px-6 pb-20 md:pb-6">
        <div className="grid grid-cols-1 gap-6">
          {activeTab !== "referrals" && (
            <>
              {/* Competitions */}
              <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-indigo-800">Competitions</h3>
                  <div className="flex gap-2">
                    {(["all", "open", "closed"] as Filter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-3 py-1 text-sm font-medium border ${
                          filter === f
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                        }`}
                      >
                        {f[0].toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {loadingComps && (
                    <div className="col-span-full rounded-xl border p-6 text-sm text-gray-600">
                      Loading competitions…
                    </div>
                  )}

                  {!loadingComps && filteredComps.length === 0 && (
                    <div className="col-span-full rounded-xl border p-6 text-sm text-gray-600">
                      No competitions found.
                    </div>
                  )}

                  {filteredComps.map((c) => {
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
                          >
                            {joiningId === c._id ? "Joining…" : isOpen ? "Participate Now" : "Closed"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* My Competitions */}
              <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-indigo-800">My Competitions</h3>
                </div>
                <MyCompetitions items={myCompItems} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Participation modal */}
      <ParticipationModal
        open={participate.open}
        competition={participate.comp}
        onClose={() => setParticipate({ open: false, comp: null })}
        onConfirm={(c) => onConfirmParticipate(c)} // c only needs _id
        isSubmitting={submitting}
      />
    </div>
  );
};

export default MainContent;
