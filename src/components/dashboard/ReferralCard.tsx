import React, { useState } from 'react';
import { Users, Gift, Copy, Share, Check } from 'lucide-react';

const ReferralCard: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = 'REF6HDFJT7J';
  const referralLink = 'https://scoreperks.co.uk/signup?ref=REF6HDFJT7J';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ScorePerk with my referral link!',
          text: 'Sign up for ScorePerk and earn rewards together!',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-900">Invite Friends</h3>
          <p className="text-sm text-gray-600">Earn rewards together!</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Your Code</span>
            <button
              onClick={handleCopyCode}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                copiedCode 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-500'
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-lg font-bold text-indigo-600">
            {referralCode}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleCopyLink}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              copiedLink 
                ? 'bg-green-100 text-green-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Gift className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Reward</span>
          </div>
          <p className="text-sm text-indigo-900">200 points for each successful referral</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;