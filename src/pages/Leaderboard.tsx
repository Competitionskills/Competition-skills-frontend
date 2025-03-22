import React from "react";
import { Trophy, Medal, Award, Crown, Star, Flame } from "lucide-react";
import Header from "../components/Header";

const leaderboardData = [
  { rank: 1, name: "Alex Thompson", competitions: 15, points: 38000 },
  { rank: 2, name: "Sarah Chen", competitions: 12, points: 24500 },
  { rank: 3, name: "Michael Rodriguez", competitions: 14, points: 23000 },
  { rank: 4, name: "Emma Wilson", competitions: 10, points: 19500 },
  { rank: 5, name: "James Kumar", competitions: 8, points: 18000 },
  { rank: 6, name: "Sarah Rodriguez", competitions: 7, points: 12000 },
  { rank: 7, name: "Neil Watson", competitions: 5, points: 10000 },
  { rank: 8, name: "Michael Rodriguez", competitions: 3, points: 9000 },
];

function getRankIcon(rank) {
  switch (rank) {
    case 1:
      return (
        <div className="relative">
          <Crown className="w-6 h-6 text-yellow-400" />
          <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
        </div>
      );
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-700" />;
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">{rank}</span>
        </div>
      );
  }
}

function Leaderboard() {
  return (
    <div className="min-h-screen bg-white/80">
      {/* Add the Header */}
      <Header />

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl font-bold bg-clip-text text-indigo-800">
                LEADERBOARD
              </h1>
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-blue-600 font-bold text-sm">Top Players Ranking</p>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
          </div>

          {/* Leaderboard Container */}
          <div className="bg-indigo-600 rounded-xl shadow-lg border border-blue-700/50">
            <div className="grid grid-cols-4 px-0 py-3 bg-indigo-500/40 border-b border-white/20">
              {["Rank", "Player Name", "Competitions", "Points"].map((header) => (
                <div key={header} className="text-xs font-bold text-blue-100 uppercase tracking-wide text-center">
                  {header}
                </div>
              ))}
            </div>

            {/* Leaderboard Rows */}
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className={`grid grid-cols-4 px-0 py-3 items-center text-center
                ${player.rank === 1 ? "bg-yellow-500/10" : "hover:bg-blue-800/30"}
                border-b border-white/20 transition-all duration-300`}
              >
                <div className="flex justify-center">{getRankIcon(player.rank)}</div>
                <div className="text-white font-medium flex items-center justify-center gap-1">
                  {player.name}
                  {player.rank === 1 && <Crown className="w-3 h-3 text-yellow-400" />}
                </div>
                <div className="text-blue-200">{player.competitions}</div>
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {player.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-blue-600 text-xs font-bold flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-yellow-600" />
              Ranking is based on monthly points
              <Star className="w-3 h-3 text-yellow-600" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
