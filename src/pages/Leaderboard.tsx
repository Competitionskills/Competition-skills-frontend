import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award, Crown, Star, Flame } from "lucide-react";
import Header from "../components/Header"; // Import Header Component
import BackgroundImage from "../images/background-img.jpg"; // Ensure this path is correct

interface LeaderboardPlayer {
  rank: number;
  name: string;
  competitions: number;
  points: number;
}

const leaderboardData: LeaderboardPlayer[] = [
  { rank: 1, name: "Alex Thompson", competitions: 15, points: 38000 },
  { rank: 2, name: "Sarah Chen", competitions: 12, points: 24500 },
  { rank: 3, name: "Michael Rodriguez", competitions: 14, points: 23000 },
  { rank: 4, name: "Emma Wilson", competitions: 10, points: 19500 },
  { rank: 5, name: "James Kumar", competitions: 8, points: 18000 },
  { rank: 6, name: "Sarah Rodriguez", competitions: 7, points: 12000 },
  { rank: 7, name: "Neil Watson", competitions: 5, points: 10000 },
  { rank: 8, name: "Michael Rodriguez", competitions: 3, points: 9000 },
];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return (
        <div className="relative animate-pulse">
          <Crown className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
          <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" />
        </div>
      );
    case 2:
      return <Medal className="w-6 h-6 text-slate-300" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-700" />;
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">{rank}</span>
        </div>
      );
  }
}

function Leaderboard() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <Header /> {/* Header component added */}

      <div className="relative py-6 px-6 sm:px-8 lg:px-10 w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Trophy className="w-12 h-10 text-yellow-600 animate-pulse" />
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-400 animate-gradient">
              LEADERBOARD
            </h1>
            <Trophy className="w-12 h-10 text-yellow-600 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <p className="text-indigo-600 font-semibold text-xl tracking-wide">
              Global Rankings
            </p>
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        {/* Leaderboard Container */}
        <div className="bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.25)] border border-indigo-400/30 overflow-hidden backdrop-blur-xl w-full">
          {/* Table Headers */}
          <div className="grid grid-cols-4 px-6 py-3 bg-gradient-to-r from-indigo-950/50 to-indigo-900/50 border-b border-indigo-400/30">
            {["Rank", "Player Name", "Competitions", "Points"].map((header) => (
              <div
                key={header}
                className="text-lg font-bold text-indigo-200 uppercase tracking-wider text-center"
              >
                {header}
              </div>
            ))}
          </div>

          {/* Leaderboard Rows (with reduced spacing) */}
          {leaderboardData.map((player, index) => (
            <div
              key={player.rank}
              className={`grid grid-cols-4 px-6 py-3 items-center text-center
                  ${player.rank === 1 
                    ? "bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-indigo-600/30" 
                    : "hover:bg-indigo-500/10"}
                  ${index !== leaderboardData.length - 1 ? "border-b border-indigo-400/30" : ""} 
                  transition-all duration-300 ease-in-out relative group`}
            >
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex justify-center relative">{getRankIcon(player.rank)}</div>
              <div className="text-white font-semibold text-lg flex items-center justify-center gap-2 relative">
                {player.name}
                {player.rank === 1 && (
                  <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />
                )}
              </div>
              <div className="text-indigo-200 text-lg relative">{player.competitions}</div>
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-xl relative">
                {player.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Ranking Update Info */}
        <div className="mt-4 text-center">
          <p className="text-indigo-600 text-lg font-medium flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Rankings update in real-time based on global performance
            <Star className="w-5 h-5 text-yellow-400" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
