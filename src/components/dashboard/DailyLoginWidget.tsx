import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Gift, Star, Crown, Check, Clock, Info } from "lucide-react";
import { useUser } from "../../context/userContext";
import { claimDailyReward, DailyLoginResponse } from "../../api/dailyLoginApi";

interface DailyLoginWidgetProps {
  userPoints: number;
  userPrestigeTickets: number;
  onRewardClaimed?: (points: number, prestigeTickets: number) => void;
}

/** CRA env first, fallback to prod base */
const API_BASE =
  process.env.REACT_APP_API_URL ?? "https://api.scoreperks.co.uk/api";

const REWARDS = [0, 10, 20, 30, 40, 50, 60, 100];

type FetchState = "loading" | "ready" | "error";
type BannerKind = "success" | "info" | "error";

/** UTC day diff helper (ignores time-of-day) */
const dayDiffUTC = (a: Date, b: Date) => {
  const au = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const bu = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.round((au - bu) / 86400000);
};

const DailyLoginWidget: React.FC<DailyLoginWidgetProps> = ({ onRewardClaimed }) => {
  const { user, isUserLoading, refreshUser } = useUser();

  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [status, setStatus] = useState<FetchState>("loading");

  // Inline banner (always visible; not absolute)
  const [banner, setBanner] = useState<{ show: boolean; text: string; kind: BannerKind }>({
    show: false,
    text: "",
    kind: "success",
  });

  const showBanner = (text: string, kind: BannerKind = "success") => {
    setBanner({ show: true, text, kind });
    setTimeout(() => setBanner((b) => ({ ...b, show: false })), 2500);
  };

  /** Fetch status and normalize streak if it broke */
  const fetchDailyStatus = useCallback(
    async (signal?: AbortSignal) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        setStatus("loading");
        const res = await fetch(`${API_BASE}/rewards/daily-login/status`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const rawStreak = Number(data?.currentStreak ?? 0);
        const claimedToday = Boolean(data?.claimedToday);
        const lastClaimDateStr: string | undefined = data?.lastClaimDate || data?.LastClaimDate;

        let displayStreak = Number.isFinite(rawStreak) ? rawStreak : 0;

        // 👇 If streak was broken (missed one or more whole days), show 0 so the next claim becomes 1.
        if (!claimedToday && lastClaimDateStr) {
          const last = new Date(lastClaimDateStr);
          const today = new Date();
          const diff = dayDiffUTC(today, last); // e.g. 0=today, 1=yesterday, 2+=missed a day
          if (diff >= 2) displayStreak = 0;
        }

        setCurrentStreak(displayStreak);
        setCanClaim(!claimedToday);
        setStatus("ready");
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setStatus("error");
      }
    },
    []
  );

  useEffect(() => {
    const ctrl = new AbortController();
    fetchDailyStatus(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchDailyStatus]);

  const getNextReward = () => {
    const nextDay = Math.min(currentStreak + 1, 7);
    return REWARDS[nextDay];
  };

  /** Claim reward (optimistic + re-sync) */
  const handleClaimReward = async () => {
    if (!canClaim || busy || !user) return;

    setBusy(true);
    setCanClaim(false); // optimistic

    try {
      const resp: DailyLoginResponse = await claimDailyReward();

      setCurrentStreak(resp?.streak ?? currentStreak + 1);
      onRewardClaimed?.(resp?.reward?.points ?? 0, resp?.reward?.prestigeTickets ?? 0);

      await refreshUser();
      await fetchDailyStatus();

      const msg =
        resp?.message ||
        `+${resp?.reward?.points ?? 0} points${
          resp?.reward?.prestigeTickets ? ` • +${resp.reward.prestigeTickets} ticket` : ""
        }`;
      showBanner(msg, "success");
    } catch (err: any) {
      const raw =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error claiming reward";

      const already = /already\s*claimed/i.test(raw);
      showBanner(already ? "Already claimed today" : raw, already ? "info" : "error");

      if (!already) setCanClaim(true);
      await fetchDailyStatus();
    } finally {
      setBusy(false);
    }
  };

  /* ============ RENDER ============ */

  if (isUserLoading || status === "loading") {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-white/70 p-5 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
    );
  }

  if (!user || status === "error") {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-white/70 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Info className="h-4 w-4" />
          <span>Daily login status unavailable right now.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-white" />
          <h3 className="text-lg font-bold text-white">Daily Login</h3>
        </div>
        <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
          <Star className="h-4 w-4 text-yellow-300" />
          <span className="text-white font-medium">Day {currentStreak}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Visible banner inside the card (not clipped) */}
        {banner.show && (
          <div
            className={`mb-4 p-3 rounded-lg border text-sm font-medium
              ${
                banner.kind === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : banner.kind === "info"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
          >
            {banner.text}
          </div>
        )}

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const claimed = day <= currentStreak;
            const nextUp = day === currentStreak + 1 && canClaim;
            return (
              <div
                key={day}
                className={`relative h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all
                ${
                  claimed
                    ? "bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 text-green-700"
                    : nextUp
                    ? "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 text-blue-700 animate-pulse"
                    : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                }`}
              >
                <span className="font-bold">{day}</span>
                {claimed && (
                  <Check className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full p-0.5" />
                )}
                {day === 7 && (
                  <Crown className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 text-yellow-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Next reward */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-700">
              {canClaim ? "Today's Reward:" : "Next Reward:"}
            </span>
            <div className="flex items-center space-x-1">
              <Gift className="h-4 w-4 text-indigo-600" />
              <span className="font-bold text-indigo-900">{getNextReward()} points</span>
            </div>
          </div>
          {(canClaim ? currentStreak + 1 : currentStreak + 2) === 7 && (
            <div className="flex items-center space-x-2 text-sm text-purple-700">
              <Crown className="h-4 w-4" />
              <span>+ 1 Prestige Ticket</span>
            </div>
          )}
        </div>

        {/* Claim button */}
        <button
          onClick={handleClaimReward}
          disabled={!canClaim || busy}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2
          ${
            !canClaim || busy
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 shadow-lg"
          }`}
        >
          {busy ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Claiming...</span>
            </>
          ) : canClaim ? (
            <>
              <Gift className="h-5 w-5" />
              <span>Claim Daily Reward</span>
            </>
          ) : (
            <>
              <Clock className="h-5 w-5" />
              <span>Already claimed</span>
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Current streak:{" "}
            <span className="font-semibold text-indigo-600">
              {currentStreak} day{currentStreak !== 1 ? "s" : ""}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rewards reset daily at 12:00 AM. Login daily to maintain your streak!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyLoginWidget;
