import React from 'react';
import { Home, Trophy, Ticket, Code, Users } from 'lucide-react';

interface MobileNavbarProps {
  activeTab: string;
  handleNavigation: (tab: string) => void;
  toggleStats: () => void; // kept for future use if you add a "More" sheet
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  activeTab,
  handleNavigation,
}) => {
  const itemCls = (key: string) =>
    `flex flex-col items-center justify-center ${
      activeTab === key ? 'text-indigo-600' : 'text-indigo-400'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-indigo-100 z-30">
      <div className="grid grid-cols-5 py-2">
        <button onClick={() => handleNavigation('overview')} className={itemCls('overview')}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button onClick={() => handleNavigation('buy-tickets')} className={itemCls('buy-tickets')}>
          <Ticket className="h-5 w-5" />
          <span className="text-xs mt-1">Tickets</span>
        </button>

        <button onClick={() => handleNavigation('submit-code')} className={itemCls('submit-code')}>
          <Code className="h-5 w-5" />
          <span className="text-xs mt-1">Code</span>
        </button>

        <button onClick={() => handleNavigation('leaderboard')} className={itemCls('leaderboard')}>
          <Trophy className="h-5 w-5" />
          <span className="text-xs mt-1">Leaderboard</span>
        </button>

        <button onClick={() => handleNavigation('referrals')} className={itemCls('referrals')}>
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Referrals</span>
        </button>
      </div>
    </div>
  );
};
