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
    <div className="md:hidden sticky top-0 bg-indigo-700 text-white z-20 shadow-md">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center">
          <img 
            src={logo} 
            alt="ScorePerk" 
            className="h-8 w-auto rounded-md"
          />
        </div>

        {/* <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1 bg-indigo-600 rounded-full px-3 py-1">
            <Star className="h-3 w-3 text-yellow-300" />
            <span className="text-xs font-medium">{userPoints}</span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/50">
            {userName ? userName.substring(0, 2).toUpperCase() : "??"}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MobileHeader;
