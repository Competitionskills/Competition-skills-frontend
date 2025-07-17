import React, { useState, useEffect } from 'react';
import { X, Users, Gift, Copy, Share, Check, ExternalLink } from 'lucide-react';
import { useUser } from '../context/userContext';

interface ReferralProgramProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReferralStats {
  totalReferrals: number;
  pointsEarned: number;
  referralCode: string;
  referralLink: string;
}

const ReferralProgram: React.FC<ReferralProgramProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 12,
    pointsEarned: 2400,
    referralCode: 'REF6HDFJT7J',
    referralLink: 'https://scoreperks.co.uk/signup?ref=REF6HDFJT7J'
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralLink);
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
          url: referralStats.referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying link
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-indigo-900">Referral Program</h2>
              <p className="text-sm text-gray-600">Invite friends and earn rewards together!</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-600">Total Referrals</span>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {referralStats.totalReferrals}
              </div>
              <p className="text-sm text-blue-700">Friends joined</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">Points Earned</span>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {referralStats.pointsEarned.toLocaleString()}
              </div>
              <p className="text-sm text-green-700">From referrals</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">How it Works</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Share your referral code or link with friends</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">They sign up using your referral code</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">You both earn <span className="font-semibold text-indigo-600">200 points</span> when they complete registration</p>
              </div>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xl font-bold text-indigo-600 tracking-wider">
                  {referralStats.referralCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    copiedCode 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this code with friends during registration to earn 200 points for each successful referral
            </p>
          </div>

          {/* Referral Link Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
              <div className="text-sm text-indigo-600 break-all font-mono">
                {referralStats.referralLink}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyLink}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  copiedLink 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Link Copied!</span>
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
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mt-3">
              Send this link to friends - they'll automatically get your referral code applied!
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Both you and your friend earn 200 points upon successful registration</li>
              <li>• Referral rewards are credited within 24 hours of friend's registration</li>
              <li>• Self-referrals and fake accounts are not allowed</li>
              <li>• ScorePerk reserves the right to modify referral rewards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;