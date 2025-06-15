import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';

interface ReferralNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  referredUsername: string;
  rewardPoints: number;
}

const ReferralNotification: React.FC<ReferralNotificationProps> = ({
  isVisible,
  onClose,
  referredUsername,
  rewardPoints
}) => {
  const [animationClass, setAnimationClass] = useState('translate-y-full opacity-0');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      setAnimationClass('translate-y-0 opacity-100');
      
      // Auto close after 5 seconds
      timer = setTimeout(() => {
        setAnimationClass('translate-y-full opacity-0');
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);
    } else {
      setAnimationClass('translate-y-full opacity-0');
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, onClose]);

  if (!isVisible && animationClass === 'translate-y-full opacity-0') {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 pb-6 px-4 flex justify-center items-center z-50 pointer-events-none">
      <div 
        className={`bg-white rounded-xl shadow-lg border border-indigo-200 p-4 max-w-sm w-full transition-all duration-300 transform ${animationClass} pointer-events-auto`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-indigo-900">New Referral!</h3>
              <button 
                onClick={() => {
                  setAnimationClass('translate-y-full opacity-0');
                  setTimeout(onClose, 300);
                }}
                className="bg-white rounded-md p-1 hover:bg-indigo-50"
              >
                <X className="h-4 w-4 text-indigo-500" />
              </button>
            </div>
            <p className="mt-1 text-sm text-indigo-600">
              <span className="font-medium">{referredUsername}</span> just joined using your referral link!
            </p>
            <div className="mt-2 px-2 py-1 bg-green-100 rounded text-green-700 text-xs inline-block">
              +{rewardPoints} points earned
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralNotification;