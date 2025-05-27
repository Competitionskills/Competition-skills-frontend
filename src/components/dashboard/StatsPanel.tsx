import React from 'react';
import { Calendar, Gift, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { StatItem } from './StatItem';

interface StatsPanelProps {
  userPoints: number;
  userPrestigeTickets: number;
  isMobileView: boolean;
  toggleMobileView: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  userPoints,
  userPrestigeTickets,
  isMobileView,
  toggleMobileView
}) => {
  const baseClasses = "bg-white/80 backdrop-blur-md border-r border-indigo-100/50 relative z-10 overflow-auto";
  
  // Mobile classes when the panel is opened
  const mobileClasses = isMobileView 
    ? "fixed inset-0 z-30 pt-16 pb-16" 
    : "hidden";
  
  // Desktop classes
  const desktopClasses = "hidden md:block md:w-96";
  
  return (
    <div className={`${baseClasses} ${mobileClasses} ${desktopClasses}`}>
      {/* Mobile toggle button */}
      {isMobileView && (
        <button 
          onClick={toggleMobileView}
          className="absolute top-4 right-4 p-2 rounded-full bg-indigo-100 text-indigo-600"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-800 mb-11 mt-2">Overview</h2>
        
        <div className="space-y-4">
          <StatItem title="Total Points" value={userPoints.toLocaleString()} change="+16%" positive={true} />
          <StatItem title="Prestige Tickets" value={userPrestigeTickets.toString()} change="+12%" positive={true} />
          <StatItem title="Referrals" value="8" change="+21%" positive={true} />
          <StatItem title="Codes Submitted" value="127" change="+8%" positive={true} />
        </div>
        
        <div className="flex items-center space-x-2 mt-8 mb-4">
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
              className={`h-10 rounded-lg flex items-center justify-center ${
                day <= 5 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 border border-green-300 text-green-700' 
                  : 'bg-gray-100 border border-gray-200 text-gray-400'
              }`}
            >
              {day}
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
        
        <button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 flex items-center justify-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Claim Daily Reward</span>
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;