import React, { useState, useEffect, useCallback } from "react";
import { Search, Bell, Filter, ChevronDown, Clock, Users, Trophy, Star, Crown } from "lucide-react";
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
  status: CompetitionStatus;
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

interface ModernMainContentProps {
  userName: string | null;
  activeTab: string;
  userPoints: number;
  userPrestigeTickets: number;
  loginStatus: DailyLoginStatus;
  updatePoints: (points: number) => void;
  updatePrestigeTickets: (tickets: number) => void;
  updateLoginStatus: (status: DailyLoginStatus) => void;
}

type Filter = "open" | "ending-soon" | "winners";

const ModernMainContent: React.FC<ModernMainContentProps> = ({
  userName,
  activeTab,
  userPoints,
  userPrestigeTickets,
  loginStatus,
  updatePoints,
  updatePrestigeTickets,
  updateLoginStatus,
}) => {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [nextReward, setNextReward] = useState({ points: 100, prestigeTickets: 0 });

  // competitions + ui state
  const [comps, setComps] = useState<Competition[]>([]);
  const [loadingComps, setLoadingComps] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // my competitions table
  const [myCompItems, setMyCompItems] = useState<MyCompetitionItem[]>([]);
  const [filter, setFilter] = useState<Filter>("open");
  const [confirm, setConfirm] = useState<{ open: boolean; comp?: Competition }>({ open: false });

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
    if (filter === "open") {
      const { phase } = getCompetitionPhase({
        _id: c._id,
        title: c.title,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
      });
      return phase === "open";
    }
    if (filter === "ending-soon") {
      const { phase } = getCompetitionPhase({
        _id: c._id,
        title: c.title,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
      });
      return phase === "open"; // Could add time-based logic here
    }
    return phase === "ended";
  });

  // ask/confirm
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

  // participate flow
  const doParticipate = async () => {
    if (!confirm.comp) return;
    const c = confirm.comp;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first.");

      setJoiningId(c._id);

      const res = await fetch(`${API_BASE}/api/competitions/${c._id}/participate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ticketCount: 1 }),
      });

      const data: ParticipateResponse = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Failed to participate");

      // optimistic: append my ticket to this comp
      const me = (user as any)?._id ?? (user as any)?.id ?? localStorage.getItem("userId");
      setComps((prev) =>
        prev.map((k) =>
          k._id === c._id
            ? {
                ...k,
                participants: [
                  ...(k.participants ?? []),
                  ...(data.tickets ?? [{ ticketId: "local", userId: String(me) }]),
                ],
              }
            : k
        )
      );

      // update prestige tickets immediately if server returned value
      if (typeof data.remainingTickets === "number") {
        updatePrestigeTickets(data.remainingTickets);
      }

      setConfirm({ open: false });

      // authoritative refresh
      await fetchAll();

      alert("Entered successfully!");
    } catch (e: any) {
      alert(e.message || "Could not participate");
      setConfirm({ open: false });
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 min-h-screen">
      {/* Header */}
      <header className="bg-indigo-800/50 backdrop-blur-sm border-b border-indigo-700/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {userName}!</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-cyan-500/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-cyan-300 text-sm font-medium">Open</span>
            </div>
            <span className="text-indigo-300 text-sm">Recommended</span>
            <div className="flex items-center space-x-2 text-indigo-300">
              <span className="text-sm">Sort Filter</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-6">
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-indigo-800/30 rounded-xl p-1">
          {[
            { key: "open", label: "Open" },
            { key: "ending-soon", label: "Ending Soon" },
            { key: "winners", label: "Winners" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as Filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === tab.key
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-indigo-300 hover:text-white hover:bg-indigo-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Wallet</h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-lg font-bold">{userPrestigeTickets}</span>
            </div>
            <p className="text-blue-200 text-sm mb-4">Prestige Tickets</p>
            <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Buy 💎
            </button>
          </div>

          {/* iPhone 15 Pro Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 text-gray-400 font-bold">#15</div>
            <div className="mb-4">
              <img 
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop&crop=center" 
                alt="iPhone 15 Pro" 
                className="w-20 h-20 object-cover rounded-xl"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">iPhone 15 Pro</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">2 day</span>
            </div>
            <p className="text-2xl font-bold text-green-400">$5,000</p>
          </div>

          {/* Gaming Setup Contest Card */}
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="mb-4">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center" 
                alt="Gaming Setup" 
                className="w-20 h-20 object-cover rounded-xl"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Gaming Setup Contest</h3>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm">2 daysleir</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-lg font-bold">555</span>
            </div>
          </div>
        </div>

        {/* Daily Login Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-indigo-800/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700/30">
            <h3 className="text-xl font-bold text-white mb-6">Daily Login</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <div>
                <p className="text-white font-medium">Ecowmes</p>
                <div className="w-32 h-2 bg-indigo-700 rounded-full mt-1">
                  <div className="w-16 h-2 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-indigo-300 text-sm">Raz 1 awarded</p>
            <p className="text-indigo-400 text-xs">100 premium</p>
          </div>

          <div className="bg-indigo-800/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700/30">
            <h3 className="text-xl font-bold text-white mb-6">Referral</h3>
            <p className="text-indigo-300 text-sm mb-4">2 of 5</p>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🔗</span>
              </div>
              <span className="text-white text-sm">Copy referral link</span>
            </div>
          </div>
        </div>

        {/* My Competitions Table */}
        <div className="bg-indigo-800/40 backdrop-blur-sm rounded-2xl border border-indigo-700/30 overflow-hidden">
          <div className="p-6 border-b border-indigo-700/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">My Competitions</h3>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-300 text-sm">Joined</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-indigo-600 rounded"></div>
                  <div className="w-1 h-4 bg-indigo-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-900/50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-indigo-300 font-medium text-sm">JOINED</th>
                  <th className="px-6 py-4 text-indigo-300 font-medium text-sm">PROGRESS</th>
                  <th className="px-6 py-4 text-indigo-300 font-medium text-sm">STATUS</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-indigo-700/30 hover:bg-indigo-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📱</span>
                      </div>
                      <span className="text-white font-medium">iPhone 15 Pro</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      Joined
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-400 text-sm">Pending draw</span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronDown className="w-4 h-4 text-indigo-400" />
                  </td>
                </tr>

                <tr className="border-b border-indigo-700/30 hover:bg-indigo-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">💰</span>
                      </div>
                      <span className="text-white font-medium">Cash Prize challenge</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                      Painting dico
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-400 text-sm">Pending draw</span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronDown className="w-4 h-4 text-indigo-400" />
                  </td>
                </tr>

                <tr className="hover:bg-indigo-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🎮</span>
                      </div>
                      <span className="text-white font-medium">Gaming Setup</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      Edibo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">Ended</span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronDown className="w-4 h-4 text-indigo-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Winners Section */}
        <div className="mt-12">
          <div className="bg-indigo-800/40 backdrop-blur-sm rounded-2xl border border-indigo-700/30 overflow-hidden">
            <div className="p-6 border-b border-indigo-700/30">
              <h3 className="text-xl font-bold text-white">Winners</h3>
              <div className="w-16 h-1 bg-purple-500 rounded-full mt-2"></div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Est. Elrty Carter</p>
                    <div className="w-24 h-1 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">Michael Scott</p>
                  <p className="text-indigo-300 text-sm">350 pu</p>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold">+85 pre</span>
                  <div className="flex space-x-1 mt-1">
                    <div className="w-1 h-4 bg-indigo-600 rounded"></div>
                    <div className="w-1 h-4 bg-indigo-600 rounded"></div>
                    <div className="w-1 h-4 bg-indigo-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirm modal */}
      {confirm.open && confirm.comp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-indigo-900 border border-indigo-700 p-6 shadow-xl">
            <h4 className="mb-2 text-lg font-semibold text-white">Confirm participation</h4>
            <p className="mb-6 text-sm text-indigo-300">
              Are you sure you want to enter <span className="font-semibold text-white">{confirm.comp.title}</span>{" "}
              with <span className="font-semibold">1 prestige ticket</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setConfirm({ open: false })} 
                className="rounded-lg border border-indigo-600 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-800"
              >
                Cancel
              </button>
              <button
                onClick={doParticipate}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
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

export default ModernMainContent;