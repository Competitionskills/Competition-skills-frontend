import React, { useState, useEffect } from 'react';
import { X, Copy, Users, Gift, Share2, CheckCircle } from 'lucide-react';

interface ReferralsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  totalPointsEarned: number;
  recentReferrals: Array<{
    username: string;
    pointsEarned: number;
    date: string;
  }>;
}

const Referrals: React.FC<ReferralsProps> = ({ isOpen, onClose }) => {
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    referralLink: '',
    totalReferrals: 0,
    totalPointsEarned: 0,
    recentReferrals: []
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Fetch referral data when modal opens
      fetchReferralData();
    }
  }, [isOpen]);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API response
      const userData = {
        referralCode: 'REF' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        referralLink: `https://yourdomain.com/register?ref=REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        totalReferrals: 12,
        totalPointsEarned: 2400,
        recentReferrals: [
          { username: 'john_doe', pointsEarned: 200, date: '2024-01-15' },
          { username: 'jane_smith', pointsEarned: 200, date: '2024-01-14' },
          { username: 'mike_wilson', pointsEarned: 200, date: '2024-01-13' },
        ]
      };
      
      setReferralData(userData);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on this amazing platform!',
          text: 'Use my referral link to get started with bonus points!',
          url: referralData.referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(referralData.referralLink, 'link');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
              <p className="text-gray-600">Invite friends and earn rewards together!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your referral data...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Referrals</p>
                    <p className="text-2xl font-bold text-blue-900">{referralData.totalReferrals}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Points Earned</p>
                    <p className="text-2xl font-bold text-green-900">{referralData.totalPointsEarned.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3">
                  <code className="text-lg font-mono font-bold text-purple-600">
                    {referralData.referralCode}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(referralData.referralCode, 'code')}
                  className="flex items-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                >
                  {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Share this code with friends during registration to earn 200 points for each successful referral!
              </p>
            </div>

            {/* Referral Link Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3">
                  <p className="text-sm text-indigo-600 font-medium truncate">
                    {referralData.referralLink}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(referralData.referralLink, 'link')}
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Send this link to friends - they'll automatically get your referral code applied!
              </p>
            </div>



            {/* How it Works */}
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How Referrals Work</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-600">1.</span>
                  <span>Share your referral code or link with friends</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-600">2.</span>
                  <span>They sign up using your code/link</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-600">3.</span>
                  <span>You both earn 200 bonus points!</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-amber-600">4.</span>
                  <span>Keep referring to earn unlimited rewards</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;