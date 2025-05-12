import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronRight, Info, Gift } from 'lucide-react';
import { ActivityRow } from './ActivityRow';
import { BarChart } from './BarChart';
import { getDailyLoginStatus, claimDailyReward } from '../../api/userApi';

interface MainContentProps {
  userName: string | null;
  activeTab: string;
  userPoints?: number;
  userPrestigeTickets?: number;
  userReferrals?: number;
  userCodesSubmitted?: number;
  isMobileView?: boolean;
  toggleMobileView?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  userName, 
  activeTab,
  userPoints = 0,
  userPrestigeTickets = 0,
  userReferrals = 8,
  userCodesSubmitted = 127,
  isMobileView = false,
  toggleMobileView = () => {}
}) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextReward, setNextReward] = useState({ points: 100, prestigeTickets: 0 });

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const status = await getDailyLoginStatus();
        setCurrentStreak(status.currentStreak);
        setCanClaim(status.canClaim);
        
        // Calculate next reward
        const nextDay = status.currentStreak + 1;
        const isDay7 = nextDay % 7 === 0;
        setNextReward({
          points: 100,
          prestigeTickets: isDay7 ? 1 : 0
        });
      } catch (error) {
        console.error('Failed to fetch login status:', error);
      }
    };

    fetchLoginStatus();
  }, []);

  const handleClaimReward = async () => {
    if (!canClaim || isLoading) return;

    setIsLoading(true);
    try {
      const result = await claimDailyReward();
      if (result.success) {
        setCanClaim(false);
        setCurrentStreak(result.newStreak);
        
        // Update next reward after claiming
        const nextDay = result.newStreak + 1;
        const isDay7 = nextDay % 7 === 0;
        setNextReward({
          points: 100,
          prestigeTickets: isDay7 ? 1 : 0
        });
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const todayInCycle = (currentStreak % 7 === 0 && currentStreak !== 0) ? 7 : currentStreak % 7;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Desktop Header - Hidden on mobile */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10 hidden md:block">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-800">Player Dashboard</h2>
          <p className="text-indigo-600">Track your gaming progress</p>
        </div>

        {/* Mobile Stats Section */}
        <div className="md:hidden mb-6">
          {(activeTab === 'overview' || isMobileView) && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-bold text-indigo-800 mb-4">Overview</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                    <div>
                      <p className="text-sm text-indigo-500">Total Points</p>
                      <p className="text-xl font-bold text-indigo-900">{userPoints.toLocaleString()}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-green-100 text-green-600">+16%</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                    <div>
                      <p className="text-sm text-indigo-500">Prestige Tickets</p>
                      <p className="text-xl font-bold text-indigo-900">{userPrestigeTickets}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-green-100 text-green-600">+12%</div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                    <div>
                      <p className="text-sm text-indigo-500">Referrals</p>
                      <p className="text-xl font-bold text-indigo-900">{userReferrals}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-green-100 text-green-600">+21%</div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                    <div>
                      <p className="text-sm text-indigo-500">Codes Submitted</p>
                      <p className="text-xl font-bold text-indigo-900">{userCodesSubmitted}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-green-100 text-green-600">+8%</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold text-indigo-700">Daily Login</h4>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-indigo-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-white rounded-lg shadow-lg border border-indigo-100 text-xs text-gray-600">
                        Earn Daily Rewards: 100 points every day, plus a Prestige ticket on Day 7!
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div 
                        key={day} 
                        className={`h-8 rounded-md flex items-center justify-center ${
                          day <= todayInCycle
                            ? 'bg-gradient-to-br from-green-100 to-green-200 border border-green-300 text-green-700' 
                            : 'bg-gray-100 border border-gray-200 text-gray-400'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <div className="p-1 bg-indigo-100 rounded">
                      <Gift className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Next Reward:</span>
                  </div>
                  <p className="mt-1 text-sm text-indigo-700 font-semibold">
                    {nextReward.points} points
                    {nextReward.prestigeTickets > 0 && ` + ${nextReward.prestigeTickets} Prestige ticket`}
                  </p>
                </div>
                
                <button 
                  onClick={handleClaimReward}
                  disabled={!canClaim || isLoading}
                  className={`w-full mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2 px-4 rounded-lg font-medium text-sm
                    ${(!canClaim || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-500 hover:to-indigo-400'}`}
                >
                  {isLoading ? 'Claiming...' : canClaim ? 'Claim Daily Reward' : 'Already Claimed'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-800">Monthly Performance</h3>
              <div className="flex items-center space-x-2 bg-indigo-50 rounded-md px-3 py-1">
                <span className="text-sm text-indigo-600">Jan 08 - Aug 08</span>
                <ChevronRight className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
            <div className="h-64">
              <BarChart />
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-800">Recent Activity</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-indigo-100">
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Player</th>
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Activity</th>
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Details</th>
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <ActivityRow 
                    name="Jenny Wilson"
                    activity="Bought Tickets"
                    details="5 Prestige Tickets"
                    time="2m ago"
                    type="purchase"
                  />
                  <ActivityRow 
                    name="Michael Scott"
                    activity="Competition"
                    details="Ranked #1 in Weekly Challenge"
                    time="5m ago"
                    type="competition"
                  />
                  <ActivityRow 
                    name="Jim Halpert"
                    activity="Achievement"
                    details="Perfect Score Streak"
                    time="12m ago"
                    type="achievement"
                  />
                  <ActivityRow 
                    name="Pam Beesly"
                    activity="Bought Tickets"
                    details="3 Golden Tickets"
                    time="15m ago"
                    type="purchase"
                  />
                  <ActivityRow 
                    name="Dwight Schrute"
                    activity="Competition"
                    details="Joined Tournament Alpha"
                    time="20m ago"
                    type="competition"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainContent;