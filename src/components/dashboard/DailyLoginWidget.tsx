import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Star, Crown, Check, Clock } from 'lucide-react';
import { useUser } from '../../context/userContext';
import { claimDailyReward, DailyLoginResponse } from '../../api/dailyLoginApi';

interface DailyLoginWidgetProps {
  userPoints: number;
  userPrestigeTickets: number;
  onRewardClaimed?: (points: number, prestigeTickets: number) => void;
}

const DailyLoginWidget: React.FC<DailyLoginWidgetProps> = ({ onRewardClaimed }) => {
  const { user, isUserLoading, refreshUser } = useUser();

  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [rewardMessage, setRewardMessage] = useState<string>('');

  const rewards = [0, 10, 20, 30, 40, 50, 60, 100];

  // ✅ Fetch daily status
 const fetchDailyStatus = async () => {
  console.log('[🔄 fetchDailyStatus] Fetching daily login status...');
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('[⚠️ fetchDailyStatus] No token found in localStorage');
      return;
    }

    console.log('[📦 fetchDailyStatus] Using token:', token);

    const url = `https://api.scoreperks.co.uk/api/rewards/daily-login/status`;
    console.log('[🌐 fetchDailyStatus] Requesting URL:', url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('[📡 fetchDailyStatus] HTTP Status:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.warn('[⚠️ fetchDailyStatus] Request failed', {
        status: res.status,
        responseText: text,
      });
      return;
    }

    const data = await res.json();
    console.log('[✅ fetchDailyStatus] Raw response data:', data);

    // Debugging values
    console.log('[🔍 fetchDailyStatus] claimedToday from backend:', data.claimedToday);
    console.log('[🔍 fetchDailyStatus] currentStreak from backend:', data.currentStreak);

    // Set streak
    if (typeof data.currentStreak === 'number') {
      console.log('[✅ fetchDailyStatus] Setting currentStreak to:', data.currentStreak);
      setCurrentStreak(data.currentStreak);
    } else {
      console.warn('[⚠️ fetchDailyStatus] currentStreak is not a number:', data.currentStreak);
    }

    // Set claim availability
    const newCanClaim = !data.claimedToday;
    console.log('[✅ fetchDailyStatus] Setting canClaim to:', newCanClaim);
    setCanClaim(newCanClaim);

  } catch (err) {
    console.error('[❌ fetchDailyStatus] Error fetching daily status:', err);
  }
};


  // ✅ Handle claim
  const handleClaimReward = async () => {
    console.log('[🖱 Button clicked] Trying to claim reward...');
    if (!user) {
      console.warn('[⚠️ No user available]');
      return;
    }

    setIsLoading(true);
    try {
      const response: DailyLoginResponse = await claimDailyReward();
      console.log('[✅ Claimed Response]', response);

      // Update state immediately from response
      setCurrentStreak(response.streak);
      setRewardMessage(response.message);
      setShowSuccess(true);

      // Mark as claimed
      setCanClaim(false);

      // Notify parent if needed
      if (onRewardClaimed) {
        onRewardClaimed(response.reward.points, response.reward.prestigeTickets || 0);
      }

      // Refresh user points
      await refreshUser();

      // Optional: Re-fetch daily status to sync with backend
      await fetchDailyStatus();

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error('[❌ Claim failed]', err);
      setRewardMessage(err?.response?.data?.error || 'Error claiming reward');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  console.log('[✅ useEffect] user:', user, 'isUserLoading:', isUserLoading);
  fetchDailyStatus(); // force-run to debug
}, []);

  const getNextReward = () => {
    const nextDay = Math.min(currentStreak + 1, 7);
    return rewards[nextDay];
  };

  if (isUserLoading) {
    return <div className="p-4">Loading daily login...</div>;
  }

  if (!user) {
    return <div className="p-4 text-red-500">User not found</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
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
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">{rewardMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`relative h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                day <= currentStreak
                  ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 text-green-700'
                  : day === currentStreak + 1 && canClaim
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 text-blue-700 animate-pulse'
                  : 'bg-gray-100 border-2 border-gray-200 text-gray-400'
              }`}
            >
              <span className="font-bold">{day}</span>
              {day <= currentStreak && (
                <Check className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full p-0.5" />
              )}
              {day === 7 && (
                <Crown className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-4 w-4 text-yellow-500" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-700">
              {canClaim ? "Today's Reward:" : 'Next Reward:'}
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

<button
  onClick={handleClaimReward}
  disabled={false} // 👈 Force enabled for debugging
  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 shadow-lg`}
>
  {isLoading ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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



        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Current streak:{' '}
            <span className="font-semibold text-indigo-600">
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
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
