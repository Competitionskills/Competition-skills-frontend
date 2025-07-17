import React from 'react';
import { 
  Trophy, 
  Award, 
  Ticket,
  Calendar, 
  Code, 
  Settings, 
  LogOut, 
  Home, 
  Users,
  X,
  BadgeCheck, // for Achievements icon
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
  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'achievements', icon: BadgeCheck, label: 'Achievements', comingSoon: true },
    { id: 'referrals', icon: Users, label: 'Referrals' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'submit-code', icon: Code, label: 'Submit Code' },
    { id: 'buy-tickets', icon: Ticket, label: 'Buy Tickets' },
  ];

  return (
    <aside className={`
      w-80 bg-gradient-to-b from-indigo-700 to-indigo-600 text-white h-screen
      flex flex-col z-20 transition-all duration-300 ease-in-out
      ${isMobile ? 'fixed inset-y-0 left-0' : 'hidden md:flex'}
    `}>
      {isMobile && (
        <button 
          onClick={closeMobileMenu}
          className="absolute top-4 right-4 p-1 text-white hover:text-indigo-200 md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Logo */}
      <div className="p-4 border-b border-indigo-500 flex items-center justify-center">
        <img src={centerLogo} alt="Logo" className="h-10" />
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b border-indigo-500">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold">
            {userName ? userName.substring(0, 2).toUpperCase() : "??"}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">{userName || "Guest"}</h3>
            <p className="text-xs text-indigo-200">Player</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-indigo-500/30 rounded-lg p-2">
            <p className="text-xs text-indigo-200">Points</p>
            <p className="font-bold text-white">{userPoints.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-500/30 rounded-lg p-2">
            <p className="text-xs text-indigo-200">Tickets</p>
            <p className="font-bold text-white">{userPrestigeTickets}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-indigo-200'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.comingSoon && (
                    <span className="text-xs bg-yellow-400 text-black font-semibold px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="p-2 border-t border-indigo-500">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => handleNavigation('settings')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 text-indigo-200 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600/20 text-red-200 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
