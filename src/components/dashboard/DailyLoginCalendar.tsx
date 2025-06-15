import React from 'react';
import { Gift, Info } from 'lucide-react';
import { DailyLoginStatus } from '../../types/user';

interface DailyLoginCalendarProps {
  loginStatus: DailyLoginStatus;
  isLoading: boolean;
  onClaimReward: () => Promise<void>;
}

const DailyLoginCalendar: React.FC<DailyLoginCalendarProps> = ({
  loginStatus,
  isLoading,
  onClaimReward
}) => {
  const { currentStreak, claimedToday } = loginStatus;
  
  const handleClaimClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (claimedToday || isLoading) return;
    await onClaimReward();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4 mt-4">
        <h2 className="text-lg font-bold text-indigo-800">Daily Login</h2>
        <div className="group relative">
          <button className="p-1 hover:bg-indigo-100 rounded-full transition-colors">
            <Info className="h-4 w-4 text-indigo-500" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <p className="text-sm text-indigo-600">Earn daily rewards: 100 points every day and a Prestige Ticket on Day 7.</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white transform rotate-45"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div 
            key={day} 
            className={`h-10 rounded-lg flex items-center justify-center relative transition-all duration-200 ${
              day <= currentStreak 
                ? 'bg-gradient-to-br from-green-100 to-green-200 border border-green-300 text-green-700' 
                : day === currentStreak + 1 && !claimedToday
                  ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-300 text-indigo-700 animate-pulse'
                  : 'bg-gray-100 border border-gray-200 text-gray-400'
            }`}
          >
            {day}
            {day <= currentStreak && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-indigo-600" />
          <p className="text-sm text-indigo-700 font-medium">Day 7 Reward:</p>
        </div>
        <p className="text-sm text-indigo-900 mt-1 pl-7">500 points + 1 Prestige Ticket</p>
      </div>
      
      <button 
        className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
          claimedToday 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : isLoading
              ? 'bg-indigo-400 text-white cursor-wait'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400'
        }`}
        onClick={handleClaimClick}
        disabled={claimedToday || isLoading}
      >
        <Gift className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
        <span>
          {claimedToday 
            ? 'Already Claimed Today' 
            : isLoading 
              ? 'Claiming...' 
              : 'Claim Daily Reward'}
        </span>
      </button>
    </div>
  );
};

export default DailyLoginCalendar;