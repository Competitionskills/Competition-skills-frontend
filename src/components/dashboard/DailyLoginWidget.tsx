import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Star, Crown, Check, Clock } from 'lucide-react';
import { claimDailyReward, DailyLoginResponse } from '../../api/dailyLoginApi';
import { useUser } from '../../context/userContext';

interface DailyLoginWidgetProps {
  userPoints: number;
  userPrestigeTickets: number;
  onRewardClaimed?: (points: number, prestigeTickets: number) => void;
}

const DailyLoginWidget: React.FC<DailyLoginWidgetProps> = ({ 
  userPoints, 
  userPrestigeTickets, 
  onRewardClaimed 
}) => {
  const { refreshUser } = useUser();
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const [canClaim, setCanClaim] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [rewardMessage, setRewardMessage] = useState<string>("");

  const rewards = [0, 10, 20, 30, 40, 50, 60, 100];
  const prestigeDay = 7;

  useEffect(() => {
    // Check if user has already claimed today
    const lastClaim = localStorage.getItem('lastDailyLogin');
    const streak = localStorage.getItem('dailyLoginStreak');
    
    if (lastClaim) {
      const lastClaimDate = new Date(parseInt(lastClaim));
      const today = new Date();
      const diffTime = today.getTime() - lastClaimDate.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      setLastClaimTime(parseInt(lastClaim));
      setCanClaim(diffMinutes >= 1440); // 24 hours = 1440 minutes
    }
    
    if (streak) {
      setCurrentStreak(parseInt(streak));
    }
  }, []);

  const handleClaimReward = async () => {
    if (!canClaim || isLoading) return;

    setIsLoading(true);
    try {
      const response: DailyLoginResponse = await claimDailyReward();
      
      // Update local state
      setCurrentStreak(response.streak);
      setLastClaimTime(Date.now());
      setCanClaim(false);
      setRewardMessage(response.message);
      setShowSuccess(true);

      // Store in localStorage
      localStorage.setItem('lastDailyLogin', Date.now().toString());
      localStorage.setItem('dailyLoginStreak', response.streak.toString());

      // Refresh user data
      await refreshUser();

      // Notify parent component
      if (onRewardClaimed) {
        const pointsEarned = rewards[Math.min(response.streak, 7)];
        const prestigeEarned = response.streak === prestigeDay ? 1 : 0;
        onRewardClaimed(pointsEarned, prestigeEarned);
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error claiming daily reward:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextReward = () => {
    const nextDay = Math.min(currentStreak + 1, 7);
    return rewards[nextDay];
  };

  const getTimeUntilNextClaim = () => {
    if (!lastClaimTime) return null;
    
    const nextClaimTime = lastClaimTime + (24 * 60 * 60 * 1000); // 24 hours
    const now = Date.now();
    const diff = nextClaimTime - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-white" />
            <h3 className="text-lg font-bold text-white">Daily Login</h3>
          </div>
          <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
            <Star className="h-4 w-4 text-yellow-300" />
            <span className="text-white font-medium">Day {currentStreak}</span>
          </div>
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

        {/* Progress Grid */}
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

        {/* Reward Info */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-700">
              {canClaim ? 'Today\'s Reward:' : 'Next Reward:'}
            </span>
            <div className="flex items-center space-x-1">
              <Gift className="h-4 w-4 text-indigo-600" />
              <span className="font-bold text-indigo-900">
                {canClaim ? rewards[Math.min(currentStreak + 1, 7)] : getNextReward()} points
              </span>
            </div>
          </div>
          
          {(canClaim ? currentStreak + 1 : currentStreak + 2) === 7 && (
            <div className="flex items-center space-x-2 text-sm text-purple-700">
              <Crown className="h-4 w-4" />
              <span>+ 1 Prestige Ticket</span>
            </div>
          )}
        </div>

        {/* Day 7 Special Reward */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-1">
            <Crown className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Day 7 Bonus:</span>
          </div>
          <p className="text-sm text-purple-900 font-medium">100 points + 1 Prestige Ticket</p>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaimReward}
          disabled={!canClaim || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
            canClaim && !isLoading
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
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
              <span>
                {getTimeUntilNextClaim() ? `Next claim in ${getTimeUntilNextClaim()}` : 'Claimed Today'}
              </span>
            </>
          )}
        </button>

        {/* Streak Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Current streak: <span className="font-semibold text-indigo-600">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Login daily to maintain your streak and earn bigger rewards!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyLoginWidget;