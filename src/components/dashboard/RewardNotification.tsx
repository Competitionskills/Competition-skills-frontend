import React, { useEffect } from 'react';
import { Gift, X, Star, Crown } from 'lucide-react';

interface RewardNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  rewardPoints: number;
  prestigeTickets: number;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({
  isVisible,
  onClose,
  rewardPoints,
  prestigeTickets
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-6 max-w-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Daily Reward Claimed!</h3>
              <p className="text-sm text-gray-600">Great job logging in today!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-green-900">Points</span>
            </div>
            <span className="font-bold text-green-600">+{rewardPoints}</span>
          </div>

          {prestigeTickets > 0 && (
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-purple-900">Prestige Tickets</span>
              </div>
              <span className="font-bold text-purple-600">+{prestigeTickets}</span>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Keep your streak going! Come back tomorrow for more rewards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardNotification;