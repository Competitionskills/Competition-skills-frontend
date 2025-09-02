import React, { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
// import { BarChart } from "./BarChart"; // <- not used, remove to avoid lint error
import { DailyLoginStatus } from "../../types/user";
import MyCompetitions from "./MycompetitionItems";
import type { MyCompetitionItem } from "./MycompetitionItems";
import { getCompetitionPhase } from "../../utils/competition";
import { useUser } from "../../context/userContext";

// ===== API + types =====
const API_BASE =
  process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

type CompetitionStatus = "open" | "closed";
type Participant = { ticketId: string; userId: string };
type Competition = {
  _id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  startsAt?: string; // optional (for future/upcoming)
  endsAt: string; // required
  entryCost: number;
  status: CompetitionStatus; // not trusted for UI; we derive from dates
  participants?: Participant[];
};

const normalizeId = (v: any) =>
  String(v?._id ?? v?.id ?? (typeof v === "object" ? v?.toString?.() : v) ?? "");

// ===== cashy images =====
const CASH_IMAGES = [
  "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607013406962-5f8f3f7f8d53?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop",
];
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
  // ✅ hooks belong inside the component
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [nextReward, setNextReward] = useState({
    points: 100,
    prestigeTickets: 0,
  });

  // competitions state
  const [comps, setComps] = useState<Competition[]>([]);
  const [loadingComps, setLoadingComps] = useState(false);

  // my competitions table items (only those the user entered)
  const [myCompItems, setMyCompItems] = useState<MyCompetitionItem[]>([]);

  // filter & confirmation
  const [filter, setFilter] = useState<Filter>("all");
  const [confirm, setConfirm] = useState<{ open: boolean; comp?: Competition }>(
    { open: false }
  );

  useEffect(() => {
    if (loginStatus) {
      const nextDay = (loginStatus.currentStreak || 0) + 1;
      const isDay7 = nextDay % 7 === 0;
      setNextReward({
        points: isDay7 ? 500 : 100,
        prestigeTickets: isDay7 ? 1 : 0,
      });
    }
  }, [loginStatus]);

  // fetch competitions
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  // build "My Competitions" rows whenever comps or user changes
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

  // derive filter by phase (closed === ended)
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

  // confirm flow
  const askParticipate = (c: Competition) => {
    const { isOpen } = getCompetitionPhase({
      _id: c._id,
      title: c.title,
      startsAt: c.startsAt,
      endsAt: c.endsAt,
    });
    if (!isOpen) return;
    setConfirm({ open: true, comp: c });
  };

  const doParticipate = async () => {
    if (!confirm.comp) return;
    const c = confirm.comp;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");
      const res = await fetch(
        `${API_BASE}/api/competitions/${c._id}/participate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ticketCount: 1 }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || data?.error || "Failed to participate");
      alert("Entered successfully!");
      setConfirm({ open: false });
    } catch (e: any) {
      alert(e.message || "Could not participate");
      setConfirm({ open: false });
    }
  };

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
        updatePrestigeTickets(
          userPrestigeTickets + nextReward.prestigeTickets
        );
      }
    } catch (error) {
      console.error("Failed to claim reward:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Desktop Header */}
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
              {/* Competitions Section */}
              <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-indigo-800">
                    Competitions
                  </h3>

                  {/* Filter tabs */}
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

                {/* Cards Grid */}
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
                          <img
                            src={imageFor(c)}
                            alt={c.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                          <div className="absolute bottom-3 left-3 text-white">
                            <h4 className="font-bold text-lg mb-1">{c.title}</h4>
                            <p className="text-sm opacity-90">{timeLabel}</p>
                          </div>

                          <div className="absolute top-3 right-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                            >
                              {phase}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Entry Cost</p>
                              <p className="text-lg font-bold text-green-600">
                                {c.entryCost} prestige ticket
                                {c.entryCost > 1 ? "s" : ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Participants
                              </p>
                              <p className="font-bold text-indigo-600">
                                {(c.participants?.length ?? 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <button
                            disabled={!isOpen}
                            onClick={() => askParticipate(c)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                          >
                            {isOpen ? "Participate Now" : "Closed"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* My Competitions Table */}
              <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-indigo-800">
                    My Competitions
                  </h3>
                </div>
                <MyCompetitions items={myCompItems} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Confirm modal */}
      {confirm.open && confirm.comp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h4 className="mb-2 text-lg font-semibold text-indigo-900">
              Confirm participation
            </h4>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to enter{" "}
              <span className="font-semibold text-indigo-900">
                {confirm.comp.title}
              </span>{" "}
              with
              <span className="font-semibold"> 1 prestige ticket</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirm({ open: false })}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={doParticipate}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Yes, participate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
