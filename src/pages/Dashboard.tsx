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
import { fetchUserProfile } from '../api/userApi';

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
  const [userReferrals, setUserReferrals] = useState<number>(8);
  const [userCodesSubmitted, setUserCodesSubmitted] = useState<number>(127);

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
        // If API provides these values, uncomment the lines below
        // setUserReferrals(data.referrals || 8);
        // setUserCodesSubmitted(data.codesSubmitted || 127);
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
    setUserCodesSubmitted(prev => prev + 1);
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

      {/* Middle Stats Section - hidden on mobile, shown on desktop */}
      <div className="hidden md:block">
        <StatsPanel 
          userPoints={userPoints}
          userPrestigeTickets={userPrestigeTickets}
          isMobileView={false}
          toggleMobileView={() => {}}
        />
      </div>

      {/* Main Content */}
      <MainContent 
        userName={userName}
        activeTab={activeTab}
        userPoints={userPoints}
        userPrestigeTickets={userPrestigeTickets}
        userReferrals={userReferrals}
        userCodesSubmitted={userCodesSubmitted}
        isMobileView={mobileStatsOpen}
        toggleMobileView={toggleMobileStats}
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
    </div>
  );
};

export default Dashboard;