import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw } from 'lucide-react';
import { getReferredUsers, getReferralStats } from '../../api/referralApi';
import { ReferralUser, ReferralStats } from '../../types/user';
import ReferredUserCard from './ReferredUserCard';

interface ReferralsListProps {
  className?: string;
}

const ReferralsList: React.FC<ReferralsListProps> = ({ className = "" }) => {
  const [referredUsers, setReferredUsers] = useState<ReferralUser[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        getReferredUsers(),
        getReferralStats()
      ]);
      setReferredUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = referredUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-indigo-800">Your Referrals</h3>
          <button 
            onClick={fetchReferrals}
            className="p-2 rounded-full transition-colors bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-500">Total Referrals</p>
              <p className="text-lg font-bold text-indigo-800">{stats.totalReferrals}</p>
            </div>
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-500">Active</p>
              <p className="text-lg font-bold text-indigo-800">{stats.activeReferrals}</p>
            </div>
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-500">Pending</p>
              <p className="text-lg font-bold text-indigo-800">{stats.pendingReferrals}</p>
            </div>
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-500">Points Earned</p>
              <p className="text-lg font-bold text-indigo-800">{stats.pointsEarned}</p>
            </div>
          </div>
        )}
        
        {/* Search box */}
        <div className="relative mb-4">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Search referrals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        
        {/* Referral List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredUsers.map((user) => (
              <ReferredUserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-indigo-50/50 rounded-lg border border-indigo-100 p-4 text-center">
            <Users className="h-12 w-12 text-indigo-300 mx-auto mb-2" />
            <h4 className="text-indigo-700 font-medium">No referrals found</h4>
            <p className="text-xs text-indigo-500 mt-1">
              {searchTerm ? "No matches for your search." : "Share your referral link to start earning rewards!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralsList;