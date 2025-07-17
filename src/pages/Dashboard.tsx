import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../helpers/axios';
import {
  Trophy, Award, Ticket, Calendar, Code, Settings, LogOut, Home,
  BarChart3, Activity, Bell, Search, ChevronRight, Gift, Zap, Star,
  Crown, Target, Users, Info, Menu, X
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

import centerLogo from '../images/dashboard1-logo.jpg';
import BackgroundImage from '../images/background-img.jpg';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [showSubmitCode, setShowSubmitCode] = useState(false);
  const [showBuyTickets, setShowBuyTickets] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileStatsOpen, setMobileStatsOpen] = useState(false);

  const [userName, setUserName] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userTickets, setUserTickets] = useState(0);
  const [userPrestigeTickets, setUserPrestigeTickets] = useState(0);

  const [loginStatus, setLoginStatus] = useState<DailyLoginStatus>({
    currentStreak: 0,
    lastClaimDate: '',
    claimedToday: false,
    daysUntilPrestigeTicket: 7
  });

  const [rewardNotification, setRewardNotification] = useState({
    visible: false,
    points: 0,
    prestigeTickets: 0
  });

  // Load profile and daily login info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setAuthToken(token);

    const fetchData = async () => {
      try {
        const userData = await fetchUserProfile();
        setUserName(userData.username);
        setUserPoints(userData.points);
        setUserTickets(userData.tickets);
        setUserPrestigeTickets(userData.prestigeTickets);

        const loginData = await getDailyLoginStatus();
        setLoginStatus(loginData);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        // Redirect only if backend really says unauthorized
        if (error?.response?.status === 401 || error?.message === 'Unauthorized') {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Ticket purchase handler
  const handleTicketPurchase = (pointsSpent: number, ticketsQuantity: number) => {
    setUserPoints(prev => prev - pointsSpent);
    setUserPrestigeTickets(prev => prev + ticketsQuantity);
  };

  // Code redeem handler
  const handlePointsUpdate = useCallback((points: number) => {
    setUserPoints(prev => prev + points);
  }, []);

  // Daily reward claim handler
  const handleDailyRewardClaimed = useCallback((points: number, prestigeTickets: number) => {
    setUserPoints(prev => prev + points);
    setUserPrestigeTickets(prev => prev + prestigeTickets);

    setRewardNotification({
      visible: true,
      points,
      prestigeTickets
    });
  }, []);

  const handleLoginStatusUpdate = useCallback((newStatus: DailyLoginStatus) => {
    setLoginStatus(newStatus);
  }, []);

  const updatePrestigeTickets = useCallback((tickets: number) => {
    setUserPrestigeTickets(prev => prev + tickets);
  }, []);

  const closeRewardNotification = () => {
    setRewardNotification(prev => ({ ...prev, visible: false }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
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

      <MobileHeader
        userName={userName}
        userPoints={userPoints}
        toggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
        logo={centerLogo}
      />

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

      <MobileNavbar
        activeTab={activeTab}
        handleNavigation={handleNavigation}
        toggleStats={toggleMobileStats}
      />

      <SubmitCode
        isOpen={showSubmitCode}
        onClose={() => setShowSubmitCode(false)}
        onPointsUpdated={handlePointsUpdate}
      />

      <BuyTickets
        isOpen={showBuyTickets}
        onClose={() => setShowBuyTickets(false)}
        userPoints={userPoints}
        onPurchase={handleTicketPurchase}
      />

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
