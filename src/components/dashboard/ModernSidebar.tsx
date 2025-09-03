import React from 'react';
import { 
  Wallet, 
  Users, 
  Ticket,
  Code, 
  Settings, 
  LogOut, 
  BarChart3,
  UserCheck,
  Crown
} from 'lucide-react';

interface ModernSidebarProps {
  userName: string | null;
  userPoints: number;
  userPrestigeTickets: number;
  activeTab: string;
  handleNavigation: (tab: string) => void;
  handleLogout: () => void;
  isMobile: boolean;
  closeMobileMenu: () => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  userName,
  userPoints,
  userPrestigeTickets,
  activeTab,
  handleNavigation,
  handleLogout,
  isMobile,
  closeMobileMenu
}) => {
  const navItems = [
    { id: 'wallet', icon: Wallet, label: 'Wallet', badge: null },
    { id: 'quick-actions', icon: Users, label: 'Quick Actions', badge: null },
    { id: 'buy-tickets', icon: Ticket, label: 'Buy Tickets', badge: null },
    { id: 'submit-code', icon: Code, label: 'Submit Code', badge: null },
    { id: 'referrals', icon: UserCheck, label: 'Referrals', badge: null },
    { id: 'leaderboard', icon: BarChart3, label: 'Leaderboard', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className={`
      ${isMobile ? 'fixed inset-0 z-50' : 'hidden md:block'}
      w-full md:w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white relative
    `}>
      {/* Header */}
      <div className="p-6 border-b border-indigo-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold">ScorePerks</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item.id);
                  if (isMobile) closeMobileMenu();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-indigo-300 hover:bg-indigo-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-indigo-700/50">
        <div className="mb-4 p-4 bg-indigo-800/50 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {userName ? userName.substring(0, 1).toUpperCase() : "?"}
              </span>
            </div>
            <span className="font-medium text-sm">Referral</span>
          </div>
          <p className="text-indigo-300 text-xs mb-3">2 of 5</p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Copy referral link
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-indigo-300 hover:text-white transition-colors w-full py-2 px-3 rounded-lg hover:bg-indigo-700/50"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ModernSidebar;