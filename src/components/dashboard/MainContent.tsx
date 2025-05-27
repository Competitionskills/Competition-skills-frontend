import React from 'react';
import { Search, Bell } from 'lucide-react';
import { ActivityRow } from './ActivityRow';
import { BarChart } from './BarChart';

interface MainContentProps {
  userName: string | null;
  activeTab: string;
}

const MainContent: React.FC<MainContentProps> = ({ userName, activeTab }) => {
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

const ChevronRight = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default MainContent;