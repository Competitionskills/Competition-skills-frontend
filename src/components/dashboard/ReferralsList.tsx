import React from 'react';
import { Users, Star, Calendar } from 'lucide-react';

interface ReferralsListProps {
  userPoints: number;
  userPrestigeTickets: number;
}

const ReferralsList: React.FC<ReferralsListProps> = ({ userPoints, userPrestigeTickets }) => {
  const referrals = [
    { name: 'Alex Thompson', joinDate: '2024-01-15', points: 200, status: 'active' },
    { name: 'Sarah Chen', joinDate: '2024-01-12', points: 200, status: 'active' },
    { name: 'Michael Rodriguez', joinDate: '2024-01-10', points: 200, status: 'active' },
    { name: 'Emma Wilson', joinDate: '2024-01-08', points: 200, status: 'active' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">Your Referrals</h3>
            <p className="text-sm text-gray-600">{referrals.length} friends joined</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {referrals.length * 200}
          </div>
          <div className="text-sm text-gray-500">Total Points</div>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {referrals.map((referral, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs">
                {referral.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-900">{referral.name}</div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(referral.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <Star className="h-4 w-4" />
                <span className="font-semibold">+{referral.points}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                referral.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {referral.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {referrals.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No referrals yet</p>
          <p className="text-sm text-gray-400">Share your code to start earning!</p>
        </div>
      )}
    </div>
  );
};

export default ReferralsList;