import React from 'react';
import { Menu, Bell, Star } from 'lucide-react';

interface MobileHeaderProps {
  userName: string | null;
  userPoints: number;
  toggleMenu: () => void;
  mobileMenuOpen: boolean;
  logo: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  userName,
  userPoints,
  toggleMenu,
  mobileMenuOpen,
  logo
}) => {
  // Hide header when menu is open
  if (mobileMenuOpen) {
    return null;
  }

  return (
    <div className="md:hidden sticky top-0 bg-indigo-900/90 backdrop-blur-sm text-white z-20 shadow-lg border-b border-indigo-700/30">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-xl bg-indigo-800/50 hover:bg-indigo-700/50 transition-colors border border-indigo-600/30"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center">
          <img 
            src={logo} 
            alt="ScorePerk" 
            className="h-10 w-auto rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1 bg-cyan-500/20 rounded-full px-3 py-1 border border-cyan-500/30">
            <Star className="h-4 w-4 text-cyan-300" />
            <span className="text-sm font-medium text-cyan-300">{userPoints}</span>
          </div>
          
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {userName ? userName.substring(0, 2).toUpperCase() : "??"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;