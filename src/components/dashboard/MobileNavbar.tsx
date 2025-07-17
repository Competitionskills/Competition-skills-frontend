import React from 'react';
import { Home, Trophy, Calendar, Users, Menu } from 'lucide-react';

interface MobileNavbarProps {
  activeTab: string;
  handleNavigation: (tab: string) => void;
  toggleStats: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ 
  activeTab, 
  handleNavigation,
  toggleStats
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-indigo-100 z-30">
      <div className="grid grid-cols-5 py-2">
        <button
          onClick={() => handleNavigation('overview')}
          className="flex flex-col items-center justify-center"
        >
          <Home className={`h-5 w-5 ${activeTab === 'overview' ? 'text-indigo-600' : 'text-indigo-400'}`} />
          <span className={`text-xs mt-1 ${activeTab === 'overview' ? 'text-indigo-600' : 'text-indigo-400'}`}>Home</span>
        </button>
        
        <button
          onClick={() => handleNavigation('competitions')}
          className="flex flex-col items-center justify-center"
        >
          <Trophy className={`h-5 w-5 ${activeTab === 'competitions' ? 'text-indigo-600' : 'text-indigo-400'}`} />
          <span className={`text-xs mt-1 ${activeTab === 'competitions' ? 'text-indigo-600' : 'text-indigo-400'}`}>Compete</span>
        </button>
        
        <button
          onClick={() => handleNavigation('events')}
          className="flex flex-col items-center justify-center"
        >
          <Calendar className={`h-5 w-5 ${activeTab === 'events' ? 'text-indigo-600' : 'text-indigo-400'}`} />
          <span className={`text-xs mt-1 ${activeTab === 'events' ? 'text-indigo-600' : 'text-indigo-400'}`}>Events</span>
        </button>
        
        <button
          onClick={() => handleNavigation('referrals')}
          className="flex flex-col items-center justify-center relative"
        >
          <Users className={`h-5 w-5 ${activeTab === 'referrals' ? 'text-indigo-600' : 'text-indigo-400'}`} />
          <span className={`text-xs mt-1 ${activeTab === 'referrals' ? 'text-indigo-600' : 'text-indigo-400'}`}>Referrals</span>
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] px-1 rounded-full">New</span>
        </button>
        
        <button
          onClick={toggleStats}
          className="flex flex-col items-center justify-center"
        >
          <Menu className="h-5 w-5 text-indigo-400" />
          <span className="text-xs mt-1 text-indigo-400">More</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavbar;