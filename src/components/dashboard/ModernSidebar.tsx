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
  Crown,
  X
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
      w-full md:w-72 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 text-white relative border-r border-indigo-700/30
    `}>
      {/* Close button for mobile */}
      {isMobile && (
        <button 
          onClick={closeMobileMenu}
          className="absolute top-4 right-4 p-2 rounded-full bg-indigo-800 text-white z-10"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      
      {/* Header */}
      <div className="p-6 border-b border-indigo-700/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-2xl font-bold text-white">ScorePerks</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-6 py-8">
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
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white border border-cyan-500/50 shadow-lg' 
                    : 'text-indigo-300 hover:bg-indigo-700/30 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : ''}`} />
                <span className="font-medium text-sm">{item.label}</span>
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
      <div className="p-6 border-t border-indigo-700/50">
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-xl border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                👤
              </span>
            </div>
            <span className="font-medium text-sm text-white">Referral</span>
          </div>
          <p className="text-purple-300 text-xs mb-3">2 of 5</p>
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Copy referral link
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-indigo-300 hover:text-white transition-colors w-full py-3 px-4 rounded-xl hover:bg-indigo-700/30"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ModernSidebar;