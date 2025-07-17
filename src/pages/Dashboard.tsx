import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../helpers/axios';
import { 
  Trophy, 
  Award, 
  Ticket,
  Calendar, 
  Code, 
  Settings, 
  LogOut, 
  Home, 
  BarChart3, 
  Activity, 
  Bell,
  Search,
  ChevronRight,
  Gift,
  Zap,
  Star,
  Crown,
  Target,
  Users,
  Info,
  Menu,
  X
} from 'lucide-react';

import SubmitCode from '../components/submitCode';
import BuyTickets from '../components/BuyTickets';
import ReferralProgram from '../components/ReferralProgram';
import Sidebar from '../components/dashboard/Sidebar';
import StatsPanel from '../components/dashboard/StatsPanel';
import MainContent from '../components/dashboard/MainContent';
import MobileHeader from '../components/dashboard/MobileHeader';
import MobileNavbar from '../components/dashboard/MobileNavbar';
import { fetchUserProfile } from '../api/userApi';

// Import background and logo images
import centerLogo from "../images/dashboard1-logo.jpg";
import BackgroundImage from "../images/background-img.jpg";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showSubmitCode, setShowSubmitCode] = useState<boolean>(false);
  const [showBuyTickets, setShowBuyTickets] = useState<boolean>(false);
  const [showReferrals, setShowReferrals] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileStatsOpen, setMobileStatsOpen] = useState<boolean>(false);

  const [userPoints, setUserPoints] = useState<number>(0);  
  const [userTickets, setUserTickets] = useState<number>(0);
  const [userPrestigeTickets, setUserPrestigeTickets] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      navigate('/login');
    }
  
    const getUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUserName(data.username);
        setUserPoints(data.points);
        setUserTickets(data.tickets);  
        setUserPrestigeTickets(data.prestigeTickets);  
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate('/login');
      }
    };
  
    getUser();
  }, [navigate]);

  const handleTicketPurchase = (pointsSpent: number, ticketsQuantity: number) => {
    setUserPoints(prevPoints => prevPoints - pointsSpent);
    setUserPrestigeTickets(prev => prev + ticketsQuantity);
  };

  // Handler for updating points when a code is redeemed
  const handlePointsUpdate = useCallback((points: number) => {
    setUserPoints(prevPoints => prevPoints + points);
  }, []);

  // Handler for daily login rewards
  const handleDailyRewardClaimed = useCallback((points: number, prestigeTickets: number) => {
    setUserPoints(prevPoints => prevPoints + points);
    setUserPrestigeTickets(prevTickets => prevTickets + prestigeTickets);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };
  
  const handleNavigation = (tab: string) => {
    if (tab === 'leaderboard') {
      navigate('/leaderboard');
    } else if (tab === 'buy-tickets') {
      setShowBuyTickets(true);
    } else if (tab === 'submit-code') {
      setShowSubmitCode(true);
    } else if (tab === 'referrals') {
      setShowReferrals(true);
    } else {
      setActiveTab(tab);
    }
    
    // Close mobile menu when a navigation option is selected
    setMobileMenuOpen(false);
  };

  const toggleMobileStats = () => {
    setMobileStatsOpen(!mobileStatsOpen);
  };

  return (
    <div 
      className="flex flex-col md:flex-row min-h-screen text-gray-800 relative"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm"></div>
      
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader 
        userName={userName}
        userPoints={userPoints}
        toggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
        logo={centerLogo}
      />
      
      {/* Left Sidebar - hidden on mobile unless menu is open */}
      <Sidebar 
        userName={userName}
        userPoints={userPoints}
        userPrestigeTickets={userPrestigeTickets}
        activeTab={activeTab}
        centerLogo={centerLogo}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
        isMobile={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Middle Stats Section - hidden on mobile or shown conditionally */}
      <StatsPanel 
        userPoints={userPoints}
        userPrestigeTickets={userPrestigeTickets}
        isMobileView={mobileStatsOpen}
        toggleMobileView={toggleMobileStats}
        onRewardClaimed={handleDailyRewardClaimed}
      />

      {/* Main Content */}
      <MainContent 
        userName={userName}
        activeTab={activeTab}
      />

      {/* Mobile Bottom Navigation - only visible on mobile */}
      <MobileNavbar 
        activeTab={activeTab}
        handleNavigation={handleNavigation}
        toggleStats={toggleMobileStats}
      />

      {/* Submit Code Modal */}
      <SubmitCode 
        isOpen={showSubmitCode} 
        onClose={() => setShowSubmitCode(false)}
        onPointsUpdated={handlePointsUpdate}
      />

      {/* Buy Tickets Modal */}
      <BuyTickets 
        isOpen={showBuyTickets} 
        onClose={() => setShowBuyTickets(false)} 
        userPoints={userPoints}
        onPurchase={handleTicketPurchase}
      />

      {/* Referral Program Modal */}
      <ReferralProgram 
        isOpen={showReferrals} 
        onClose={() => setShowReferrals(false)} 
      />
    </div>
  );
};

export default Dashboard;