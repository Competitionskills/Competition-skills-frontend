import React, { useState } from 'react';
import { Copy, Share2, CheckCircle, Link, QrCode, Facebook, Twitter } from 'lucide-react';

const ReferralCard: React.FC = () => {
  // In a real app, this would come from your API/backend
  const [referralCode] = useState('REF123ABC');
  const [referralLink] = useState(`https://yourgame.com/signup?ref=${referralCode}`);
  const [copyStatus, setCopyStatus] = useState<{code: boolean, link: boolean}>({
    code: false,
    link: false
  });
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      
      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToSocial = (platform: string) => {
    let shareUrl = '';
    const message = encodeURIComponent(`Join me on this awesome platform and get bonus points! Use my referral code: ${referralCode}`);
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${message}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(referralLink)}`;
        break;
      default:
        shareUrl = '';
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const rewards = [
    { level: 1, count: '5 friends', reward: '500 points' },
    { level: 2, count: '10 friends', reward: '1,200 points' },
    { level: 3, count: '25 friends', reward: '3,500 points + 1 Prestige Ticket' },
    { level: 4, count: '50 friends', reward: '8,000 points + 3 Prestige Tickets' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold text-indigo-800 mb-4">Your Referral Link</h3>
        
        {/* Referral Code Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-indigo-600 mb-1">
            Your Referral Code
          </label>
          <div className="flex items-center">
            <div className="flex-1 bg-indigo-50 text-indigo-800 font-mono rounded-l-lg p-3 border border-indigo-200">
              {referralCode}
            </div>
            <button 
              onClick={() => handleCopy(referralCode, 'code')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-r-lg transition-colors duration-200 flex items-center gap-2"
            >
              {copyStatus.code ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">{copyStatus.code ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
        
        {/* Referral Link Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-indigo-600 mb-1">
            Share this Link
          </label>
          <div className="flex items-center">
            <div className="flex-1 bg-indigo-50 text-indigo-700 rounded-l-lg p-3 border border-indigo-200 truncate text-sm">
              {referralLink}
            </div>
            <button 
              onClick={() => handleCopy(referralLink, 'link')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 transition-colors duration-200 flex items-center gap-2"
            >
              {copyStatus.link ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={toggleShareOptions}
              className="bg-indigo-700 hover:bg-indigo-600 text-white p-3 rounded-r-lg transition-colors duration-200"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Share Options */}
          {showShareOptions && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-indigo-200 shadow-md">
              <p className="text-sm text-indigo-700 mb-2">Share your link:</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => shareToSocial('facebook')}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => shareToSocial('twitter')}
                  className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                  <Link className="h-4 w-4" />
                  <span className="text-sm">Copy Link</span>
                </button>
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <QrCode className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="mb-6 flex items-center justify-center">
          <div className="w-32 h-32 bg-white p-2 border border-indigo-200 rounded-lg flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-medium">
              QR Code
            </div>
          </div>
        </div>
        
        {/* Reward Levels */}
        <div className="mt-4">
          <h4 className="text-sm font-bold text-indigo-800 mb-2">Referral Rewards</h4>
          <div className="space-y-2">
            {rewards.map((reward, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gradient-to-r from-indigo-50 to-white rounded-lg p-2 border border-indigo-100"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold mr-2">
                  {reward.level}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-indigo-800">{reward.count}</p>
                  <p className="text-xs text-indigo-600">{reward.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;