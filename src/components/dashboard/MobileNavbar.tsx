import React from 'react';
import { Home, Trophy, Ticket, Code, PieChart, Users } from 'lucide-react';

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-900/90 backdrop-blur-sm border-t border-indigo-700/30 z-20">
      <div className="flex justify-around items-center px-1 py-2">
        <NavButton 
          icon={<Home className="h-5 w-5" />} 
          label="Home"
          active={activeTab === 'overview'}
          onClick={() => handleNavigation('overview')}
        />
        <NavButton 
          icon={<Trophy className="h-5 w-5" />} 
          label="Leaderboard"
          active={activeTab === 'leaderboard'}
          onClick={() => handleNavigation('leaderboard')}
        />
        <NavButton 
          icon={<Ticket className="h-5 w-5" />} 
          label="Tickets"
          active={activeTab === 'buy-tickets'}
          onClick={() => handleNavigation('buy-tickets')}
        />
        <NavButton 
          icon={<Code className="h-5 w-5" />} 
          label="Submit"
          active={activeTab === 'submit-code'}
          onClick={() => handleNavigation('submit-code')}
        />
        <NavButton 
          icon={<Users className="h-4 w-4" />} 
          label="Referrals"
          active={activeTab === 'referrals'}
          onClick={() => handleNavigation('referrals')}
        />
        <NavButton 
          icon={<PieChart className="h-5 w-5" />} 
          label="Stats"
          active={false}
          onClick={toggleStats}
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-14 py-2 rounded-xl transition-all ${
        active ? 'text-cyan-300 bg-cyan-500/20' : 'text-indigo-400 hover:text-white'
      }`}
    >
      <div className={`${active ? 'text-cyan-300' : 'text-indigo-400'}`}>
        {icon}
      </div>
      <span className="text-xs mt-1 leading-tight">{label}</span>
      {active && (
        <div className="h-1 w-6 bg-cyan-400 rounded-full mt-1"></div>
      )}
    </button>
  );
};

export default MobileNavbar;