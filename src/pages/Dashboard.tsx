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
import Sidebar from '../components/dashboard/Sidebar';
import StatsPanel from '../components/dashboard/StatsPanel';
import MainContent from '../components/dashboard/MainContent';
import MobileHeader from '../components/dashboard/MobileHeader';
import MobileNavbar from '../components/dashboard/MobileNavbar';
import RewardNotification from '../components/dashboard/RewardNotification';
import { fetchUserProfile, getDailyLoginStatus } from '../api/userApi';
import { DailyLoginStatus } from '../types/user';

// Import background and logo images
import centerLogo from "../images/dashboard1-logo.jpg";
import BackgroundImage from "../images/background-img.jpg";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showSubmitCode, setShowSubmitCode] = useState<boolean>(false);
  const [showBuyTickets, setShowBuyTickets] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileStatsOpen, setMobileStatsOpen] = useState<boolean>(false);

  const [userPoints, setUserPoints] = useState<number>(0);  
  const [userTickets, setUserTickets] = useState<number>(0);
  const [userPrestigeTickets, setUserPrestigeTickets] = useState<number>(0);
  
  // Daily login state
  const [loginStatus, setLoginStatus] = useState<DailyLoginStatus>({
    currentStreak: 0,
    lastClaimDate: '',
    claimedToday: false,
    daysUntilPrestigeTicket: 7
  });
  
  // Reward notification state
  const [rewardNotification, setRewardNotification] = useState({
    visible: false,
    points: 0,
    prestigeTickets: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    setAuthToken(token);
  
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const userData = await fetchUserProfile();
        setUserName(userData.username);
        setUserPoints(userData.points);
        setUserTickets(userData.tickets);  
        setUserPrestigeTickets(userData.prestigeTickets);
        
        // Fetch daily login status
        const loginData = await getDailyLoginStatus();
        setLoginStatus(loginData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        if (error instanceof Error && error.message === "Unauthorized") {
          navigate('/login');
        }
      }
    };
  
    fetchData();
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
  
  const handleLoginStatusUpdate = useCallback((newStatus: DailyLoginStatus) => {
    setLoginStatus(newStatus);
  }, []);
  
  const updatePrestigeTickets = useCallback((tickets: number) => {
    setUserPrestigeTickets(prev => prev + tickets);
    
    // Show reward notification
    setRewardNotification({
      visible: true,
      points: tickets === 0 ? 100 : 500, // Regular day or day 7
      prestigeTickets: tickets
    });
  }, []);
  
  const closeRewardNotification = () => {
    setRewardNotification(prev => ({ ...prev, visible: false }));
  };
  
  const handleLogout = () => {
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
        loginStatus={loginStatus}
        updatePoints={handlePointsUpdate}
        updatePrestigeTickets={updatePrestigeTickets}
        updateLoginStatus={handleLoginStatusUpdate}

      />

      {/* Main Content */}
      <MainContent 
        userName={userName}
        activeTab={activeTab}
        userPoints={userPoints}
        userPrestigeTickets={userPrestigeTickets}
        loginStatus={loginStatus}
        updatePoints={handlePointsUpdate}
        updatePrestigeTickets={updatePrestigeTickets}
        updateLoginStatus={handleLoginStatusUpdate}
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
      
      {/* Reward Notification */}
      <RewardNotification
        isVisible={rewardNotification.visible}
        onClose={closeRewardNotification}
        rewardPoints={rewardNotification.points}
        prestigeTickets={rewardNotification.prestigeTickets}
      />
    </div>
  );
};

export default Dashboard;