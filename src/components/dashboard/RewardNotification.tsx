import React, { useEffect } from 'react';
import { Gift, X } from 'lucide-react';

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
    <div className="fixed top-20 right-4 w-72 bg-white rounded-lg shadow-lg border border-indigo-200 p-4 z-50 animate-slide-in-right">
      <div className="absolute top-3 right-3">
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
          <Gift className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-indigo-800">Daily Reward Claimed!</h3>
          <p className="text-xs text-indigo-600">Keep your streak going!</p>
        </div>
      </div>
      
      <div className="p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-700 font-medium">You received:</p>
        <div className="flex items-center mt-2">
          <div className="flex-1 flex items-center">
            <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
              <span className="text-yellow-700 text-xs">P</span>
            </div>
            <span className="text-sm font-bold text-indigo-800">{rewardPoints} Points</span>
          </div>
          
          {prestigeTickets > 0 && (
            <div className="flex-1 flex items-center">
              <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <span className="text-purple-700 text-xs">T</span>
              </div>
              <span className="text-sm font-bold text-indigo-800">{prestigeTickets} Ticket</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardNotification;