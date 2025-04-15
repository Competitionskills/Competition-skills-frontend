import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Crown } from "lucide-react";

import centerLogo from "../images/center-logo.jpg";


const Header = () => {
  return (
    <nav className="w-full max-w-full bg-white shadow-sm sticky top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto px-4 max-w-[100vw]">
        <div className="flex justify-around items-center h-16">
          {/* Left Section with New Logo */}
          <div className="flex items-center space-x-8">
            
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors ">
                <Trophy className="w-5 h-5 ml-2 mr-1" />
                Dashboard
              </Link>
              <Link to="/leaderboard" className="flex items-center text-gray-600 hover:text-blue-600 font-bold transition-colors">
                <Crown className="w-5 h-5 mr-1" />
                Leaderboard
              </Link>
            </div>
          </div>

 {/* Center Logo as External Home Link */}
<div className="flex-grow flex justify-center">
  <a 
    href="https://www.scoreperks.co.uk/home" 
    target="_self" 
    rel="noopener noreferrer"
  >
    <img 
      src={centerLogo} 
      alt="ScorePerk Center Logo" 
      className="h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200" 
    />
  </a>
</div>


          {/* Right Section */}
          <div className="flex space-x-4">
            <Link 
              to="/signup" 
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-gray-200"
            >
              Join ScorePerk
            </Link>
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
            >
              Login ScorePerk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
