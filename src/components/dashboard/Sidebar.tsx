import React from 'react';
import { 
  Trophy, 
  Award, 
  Ticket,
  Code, 
  Settings, 
  LogOut, 
  Home, 
  Activity,
  X,
  Star,
  Crown,
  Users
} from 'lucide-react';

interface SidebarProps {
  userName: string | null;
  userPoints: number;
  userPrestigeTickets: number;
  activeTab: string;
  centerLogo: string;
  handleNavigation: (tab: string) => void;
  handleLogout: () => void;
  isMobile: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userName,
  userPoints,
  userPrestigeTickets,
  activeTab,
  centerLogo,
  handleNavigation,
  handleLogout,
  isMobile,
  closeMobileMenu
}) => {
  return (
    <div className={`
      ${isMobile ? 'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out' : 'hidden md:block'}
      w-full md:w-80 bg-gradient-to-b from-indigo-700 to-indigo-600 text-white relative z-10
    `}>
      {/* Close button for mobile only */}
      {isMobile && (
        <button 
          onClick={closeMobileMenu}
          className="absolute top-4 right-4 p-2 rounded-full bg-indigo-800 text-white"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      
      {/* Logo Section */}
      <div className="p-5">
        <a
          href="https://www.scoreperks.co.uk/home"
          target="_self"
          rel="noopener noreferrer"
        >
          <img 
            src={centerLogo} 
            alt="ScorePerk Logo" 
            className="h-12 w-auto mx-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity duration-200" 
          />
        </a>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-4">
        <div className="flex flex-col p-4 bg-indigo-500/30 rounded-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Crown className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold ring-2 ring-white/50">
              {userName ? userName.substring(0, 2).toUpperCase() : "??"}
            </div>
            <div>
              <p className="font-medium text-base">{userName || "Loading..."}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-300" />
                <p className="text-sm text-indigo-300">Points: {userPoints}</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600/50 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <div>
                <p className="text-indigo-200">Points</p>
                <p className="font-semibold">{userPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-indigo-200">Tickets</p>
                <p className="font-semibold">{userPrestigeTickets}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 px-4 overflow-y-auto">
        <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        <nav className="space-y-1">
          <NavItem 
            icon={<Home />} 
            text="Overview" 
            id="overview" 
            active={activeTab === 'overview'} 
            onClick={() => handleNavigation('overview')} 
          />
          <div className="relative">
            <NavItem 
              icon={<Award />} 
              text="Achievements" 
              id="achievements" 
              active={activeTab === 'achievements'} 
              onClick={() => handleNavigation('achievements')} 
            />
            <span className="absolute right-2 top-2.5 text-xs bg-indigo-300 text-indigo-800 px-1.5 py-0.5 rounded-full font-medium">
              Coming soon
            </span>
          </div>
          <NavItem 
            icon={<Ticket />} 
            text="Buy Tickets" 
            id="buy-tickets" 
            active={activeTab === 'buy-tickets'} 
            onClick={() => handleNavigation('buy-tickets')} 
          />
          <NavItem 
            icon={<Code />} 
            text="Submit Code" 
            id="submit-code" 
            active={activeTab === 'submit-code'} 
            onClick={() => handleNavigation('submit-code')} 
          />
          <NavItem 
            icon={<Users />} 
            text="Referrals" 
            id="referrals" 
            active={activeTab === 'referrals'} 
            onClick={() => handleNavigation('referrals')} 
          />
          <NavItem 
            icon={<Trophy />} 
            text="Leaderboard" 
            id="leaderboard" 
            active={activeTab === 'leaderboard'} 
            onClick={() => handleNavigation('leaderboard')} 
          />
          <NavItem 
            icon={<Activity />} 
            text="Activity" 
            id="activity" 
            active={activeTab === 'activity'} 
            onClick={() => handleNavigation('activity')} 
          />
          <NavItem 
            icon={<Settings />} 
            text="Settings" 
            id="settings" 
            active={activeTab === 'settings'} 
            onClick={() => handleNavigation('settings')} 
          />
        </nav>
      </div>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-indigo-600">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors w-full py-2 px-3 rounded-lg hover:bg-indigo-500/30"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  id: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, text, id, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-3 py-2.5 mb-1 rounded-lg transition-all ${
        active 
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-md' 
          : 'text-indigo-200 hover:bg-indigo-500/30 hover:text-white'
      }`}
    >
      <span className={active ? 'text-white' : 'text-indigo-300'}>{icon}</span>
      <span className="font-medium text-sm">{text}</span>
      {active && <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>}
    </button>
  );
}

export default Sidebar;