import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Star, Trophy, Crown } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <nav className="w-full max-w-full bg-white shadow-sm sticky top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto px-4 max-w-[100vw]">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Gamepad2 className="w-8 h-8 text-blue-600" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                </motion.div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ScorePerk
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                <Trophy className="w-5 h-5 mr-2" />
                Competitions
              </Link>
              <Link to="/leaderboard" className="flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                <Crown className="w-5 h-5 mr-2" />
                Leaderboard
              </Link>
            </div>
          </div>
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
