import React from 'react';
import { Calendar, Gift, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { StatItem } from './StatItem';
import DailyLoginWidget from './DailyLoginWidget';
interface StatsPanelProps {
  userPoints: number;
  userPrestigeTickets: number;
  isMobileView: boolean;
  toggleMobileView: () => void;
  onRewardClaimed?: (points: number, prestigeTickets: number) => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  userPoints,
  userPrestigeTickets,
  isMobileView,
  toggleMobileView,
  onRewardClaimed
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
        <h2 className="text-2xl font-bold text-indigo-800 mb-6 mt-2">Overview</h2>
        
        <div className="space-y-4 mb-6">
          <StatItem title="Total Points" value={userPoints.toLocaleString()} change="+16%" positive={true} />
          <StatItem title="Prestige Tickets" value={userPrestigeTickets.toString()} change="+12%" positive={true} />
          <StatItem title="Referrals" value="8" change="+21%" positive={true} />
          <StatItem title="Codes Submitted" value="127" change="+8%" positive={true} />
        </div>
        
        {/* Daily Login Widget */}
        <DailyLoginWidget 
          userPoints={userPoints}
          userPrestigeTickets={userPrestigeTickets}
          onRewardClaimed={onRewardClaimed}
        />
      </div>
    </div>
  );
};

export default StatsPanel;