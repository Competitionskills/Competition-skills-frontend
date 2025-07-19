import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronRight, Info, Gift } from 'lucide-react';
import { ActivityRow } from './ActivityRow';
import { BarChart } from './BarChart';
import { DailyLoginStatus } from '../../types/user';

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
const MainContent: React.FC<MainContentProps> = ({
  userName,
  activeTab,
  userPoints,
  userPrestigeTickets,
  loginStatus,
  updatePoints,
  updatePrestigeTickets,
  updateLoginStatus
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextReward, setNextReward] = useState({ points: 100, prestigeTickets: 0 });

  useEffect(() => {
    if (loginStatus) {
      const nextDay = (loginStatus.currentStreak || 0) + 1;
      const isDay7 = nextDay % 7 === 0;
      setNextReward({
        points: isDay7 ? 500 : 100,
        prestigeTickets: isDay7 ? 1 : 0
      });
    }
  }, [loginStatus]);

 const handleClaimReward = async () => {
  if (loginStatus.claimedToday || isLoading) return;
  setIsLoading(true);
  try {
    const newStatus: DailyLoginStatus = {
      ...loginStatus, // include lastClaimDate and daysUntilPrestigeTicket
      currentStreak: loginStatus.currentStreak + 1,
      claimedToday: true
    };
    updateLoginStatus(newStatus);
    updatePoints(userPoints + nextReward.points);
    if (nextReward.prestigeTickets > 0) {
      updatePrestigeTickets(userPrestigeTickets + nextReward.prestigeTickets);
    }
  } catch (error) {
    console.error('Failed to claim reward:', error);
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
              {userName ? userName.substring(0, 2).toUpperCase() : '??'}
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
          {activeTab === 'overview' && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-indigo-800 mb-4">Overview</h3>
                {/* Stats */}
                <div className="space-y-4">
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
                </div>

                {/* Daily Login */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold text-indigo-700">Daily Login</h4>
                    <Info className="h-4 w-4 text-indigo-400 cursor-help" />
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className={`h-10 rounded-lg flex items-center justify-center relative ${
                          day <= loginStatus.currentStreak
                            ? 'bg-gradient-to-br from-green-100 to-green-200 border border-green-300 text-green-700'
                            : day === loginStatus.currentStreak + 1 && !loginStatus.claimedToday
                            ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-300 text-indigo-700 animate-pulse'
                            : 'bg-gray-100 border border-gray-200 text-gray-400'
                        }`}
                      >
                        {day}
                        {day <= loginStatus.currentStreak && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-indigo-600" />
                    <p className="text-sm text-indigo-700 font-medium">Day 7 Reward:</p>
                  </div>
                  <p className="text-sm text-indigo-900 mt-1 pl-7">500 points + 1 Prestige Ticket</p>
                </div>

                <button
                  onClick={handleClaimReward}
                  disabled={loginStatus.claimedToday || isLoading}
                  className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
                    loginStatus.claimedToday
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isLoading
                      ? 'bg-indigo-400 text-white cursor-wait'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400'
                  }`}
                >
                  <Gift className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                  <span>
                    {loginStatus.claimedToday
                      ? 'Already Claimed Today'
                      : isLoading
                      ? 'Claiming...'
                      : 'Claim Daily Reward'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        

        {/* Graph and Activity */}
        <div className="grid grid-cols-1 gap-6">
          {activeTab !== 'referrals' && (
            <>
              <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-indigo-800">Competitions Participated</h3>
                  <div className="flex items-center space-x-2 bg-indigo-50 rounded-md px-3 py-1">
                    <span className="text-sm text-indigo-600">Recent Activity</span>
                    <ChevronRight className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "March Challenge",
                      status: "Completed",
                      prize: "$5,000",
                      rank: "3rd Place",
                      participants: "2.8k",
                      date: "Mar 15, 2024",
                      statusColor: "green"
                    },
                    {
                      title: "Weekly Quiz Battle",
                      status: "In Progress",
                      prize: "$1,200",
                      rank: "Currently 5th",
                      participants: "1.2k",
                      date: "Ongoing",
                      statusColor: "blue"
                    },
                    {
                      title: "Speed Challenge",
                      status: "Completed",
                      prize: "$800",
                      rank: "1st Place",
                      participants: "856",
                      date: "Feb 28, 2024",
                      statusColor: "green"
                    },
                    {
                      title: "Strategy Masters",
                      status: "Completed",
                      prize: "$2,500",
                      rank: "7th Place",
                      participants: "3.1k",
                      date: "Feb 10, 2024",
                      statusColor: "green"
                    }
                  ].map((competition, index) => (
                    <div key={index} className="bg-gradient-to-r from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-indigo-900">{competition.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          competition.statusColor === 'green' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {competition.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Prize Pool</span>
                          <p className="font-semibold text-green-600">{competition.prize}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Your Rank</span>
                          <p className="font-semibold text-indigo-600">{competition.rank}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Participants</span>
                          <p className="font-semibold text-gray-700">{competition.participants}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Date</span>
                          <p className="font-semibold text-gray-700">{competition.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    View All Competitions →
                  </button>
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
                        <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                          Player
                        </th>
                        <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <ActivityRow name="Jenny Wilson" activity="Bought Tickets" details="5 Prestige Tickets" time="2m ago" type="purchase" />
                      <ActivityRow name="Michael Scott" activity="Competition" details="Ranked #1 in Weekly Challenge" time="5m ago" type="competition" />
                      <ActivityRow name="Jim Halpert" activity="Achievement" details="Perfect Score Streak" time="12m ago" type="achievement" />
                      <ActivityRow name="Pam Beesly" activity="Bought Tickets" details="3 Golden Tickets" time="15m ago" type="purchase" />
                      <ActivityRow name="Dwight Schrute" activity="Competition" details="Joined Tournament Alpha" time="20m ago" type="competition" />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainContent;
