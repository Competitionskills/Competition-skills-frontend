import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
  Info
} from 'lucide-react';


import SubmitCode from '../components/submitCode';
import BuyTickets from '../components/BuyTickets';
import centerLogo from "../images/dashboard1-logo.jpg";
import BackgroundImage from "../images/background-img.jpg";
import { fetchUserProfile } from '../api/userApi';



const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showSubmitCode, setShowSubmitCode] = useState<boolean>(false);
  const [showBuyTickets, setShowBuyTickets] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);  
  const [userTickets, setUserTickets] = useState<number>(0);



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
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate('/login');  // If fetching fails (401), redirect to login
      }
    };
  
    getUser();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);   // also clear Axios default header
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
  };

  const renderMainContent = () => {
    return (
      <>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-800">Player Dashboard</h2>
          <p className="text-indigo-600">Track your gaming progress</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-800">Monthly Performance</h3>
              <div className="flex items-center space-x-2 bg-indigo-50 rounded-md px-3 py-1">
                <span className="text-sm text-indigo-600">Jan 08 - Aug 08</span>
                <ChevronRight className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
            <div className="h-64">
              <BarChart />
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-800">Recent Activity</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-indigo-100">
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Player</th>
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Activity</th>
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Details</th>
                    <th className="py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <ActivityRow 
                    name="Jenny Wilson"
                    activity="Bought Tickets"
                    details="5 Prestige Tickets"
                    time="2m ago"
                    type="purchase"
                  />
                  <ActivityRow 
                    name="Michael Scott"
                    activity="Competition"
                    details="Ranked #1 in Weekly Challenge"
                    time="5m ago"
                    type="competition"
                  />
                  <ActivityRow 
                    name="Jim Halpert"
                    activity="Achievement"
                    details="Perfect Score Streak"
                    time="12m ago"
                    type="achievement"
                  />
                  <ActivityRow 
                    name="Pam Beesly"
                    activity="Bought Tickets"
                    details="3 Golden Tickets"
                    time="15m ago"
                    type="purchase"
                  />
                  <ActivityRow 
                    name="Dwight Schrute"
                    activity="Competition"
                    details="Joined Tournament Alpha"
                    time="20m ago"
                    type="competition"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div 
      className="flex min-h-screen text-gray-800 relative"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm"></div>
      
      {/* Left Sidebar */}
      <div className="w-80 bg-gradient-to-b from-indigo-700 to-indigo-600 text-white relative z-10">
        {/* Logo Section */}
        <div className="p-5">
          <a
            href="https://www.scoreperks.co.uk/home"
            target="_self"
            rel="noopener noreferrer"
          >
            <img 
              src={centerLogo} 
              alt="ScorePerk Logo" 
              className="h-12 w-auto mx-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity duration-200" 
            />
          </a>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-4">
          <div className="flex flex-col p-4 bg-indigo-500/30 rounded-xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Crown className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
            <div className="flex items-center space-x-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold ring-2 ring-white/50">
  {userName ? userName.substring(0, 2).toUpperCase() : "??"}
</div>
<div>
  <p className="font-medium text-base">{userName || "Loading..."}</p>

                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <p className="text-sm text-indigo-300">Points: {userPoints}</p>
                  </div>
              </div>
            </div>
            <div className="bg-indigo-600/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          <nav className="space-y-1">
            <NavItem icon={<Home />} text="Overview" id="overview" active={activeTab === 'overview'} onClick={() => handleNavigation('overview')} />
            <div className="relative">
              <NavItem icon={<Award />} text="Achievements" id="achievements" active={activeTab === 'achievements'} onClick={() => handleNavigation('achievements')} />
              <span className="absolute right-2 top-2.5 text-xs bg-indigo-300 text-indigo-800 px-1.5 py-0.5 rounded-full font-medium">Coming soon</span>
            </div>
            <NavItem icon={<Ticket />} text="Buy Tickets" id="buy-tickets" active={showBuyTickets} onClick={() => handleNavigation('buy-tickets')} />
            <NavItem icon={<Code />} text="Submit Code" id="submit-code" active={showSubmitCode} onClick={() => handleNavigation('submit-code')} />
            <NavItem icon={<Trophy />} text="Leaderboard" id="leaderboard" active={activeTab === 'leaderboard'} onClick={() => handleNavigation('leaderboard')} />
            <NavItem icon={<Activity />} text="Activity" id="activity" active={activeTab === 'activity'} onClick={() => handleNavigation('activity')} />
          </nav>
          
          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider px-3 mb-2 mt-6">Settings</p>
          <nav className="space-y-1">
            <NavItem icon={<Settings />} text="Settings" id="settings" active={activeTab === 'settings'} onClick={() => handleNavigation('settings')} />
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-600">
        <button
  onClick={handleLogout}
  className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors w-full py-2 px-3 rounded-lg hover:bg-indigo-500/30"
>
  <LogOut className="h-5 w-5 flex-shrink-0" />
  <span className="text-sm">Log out</span>
</button>

        </div>
      </div>

      {/* Middle Stats Section */}
      <div className="w-96 bg-white/80 backdrop-blur-md border-r border-indigo-100/50 relative z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-800 mb-11 mt-2">Overview</h2>
          
          <div className="space-y-4">
          <StatItem title="Total Points" value={userPoints.toString()} change="+16%" positive={true} />

          <StatItem title="Tickets" value={userTickets.toString()} change="+8%" positive={true} />
          <StatItem title="Referrals" value="8" change="+21%" positive={true} />
            <StatItem title="Codes Submitted" value="127" change="+8%" positive={true} />
          </div>
          
          <div className="flex items-center space-x-2 mt-8 mb-4">
            <h2 className="text-lg font-bold text-indigo-800">Daily Login</h2>
            <div className="group relative">
              <button className="p-1 hover:bg-indigo-100 rounded-full transition-colors">
                <Info className="h-4 w-4 text-indigo-500" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="text-sm text-indigo-600">Earn daily rewards: 100 points every day and a Prestige Ticket on Day 7.</p>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white transform rotate-45"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className={`h-10 rounded-lg flex items-center justify-center ${
                  day <= 5 
                    ? 'bg-gradient-to-br from-green-100 to-green-200 border border-green-300 text-green-700' 
                    : 'bg-gray-100 border border-gray-200 text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-indigo-700 font-medium">Day 7 Reward:</p>
            </div>
            <p className="text-sm text-indigo-900 mt-1 pl-7">500 points + 1 Prestige Ticket</p>
          </div>
          <button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 flex items-center justify-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Claim Daily Reward</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 placeholder-gray-400 w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full bg-white hover:bg-indigo-100 transition-colors">
                <Bell className="h-5 w-5 text-indigo-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold ring-2 ring-indigo-300">
                EM
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Submit Code Modal */}
      <SubmitCode isOpen={showSubmitCode} onClose={() => setShowSubmitCode(false)} />

      {/* Buy Tickets Modal */}
      <BuyTickets isOpen={showBuyTickets} onClose={() => setShowBuyTickets(false)} />
    </div>
  );
}

function NavItem({ icon, text, id, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-3 py-2.5 mb-1 rounded-lg transition-all ${
        active 
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-md' 
          : 'text-indigo-200 hover:bg-indigo-500/30 hover:text-white'
      }`}
    >
      <span className={active ? 'text-white' : 'text-indigo-300'}>{icon}</span>
      <span className="font-medium text-sm">{text}</span>
      {active && <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>}
    </button>
  );
}

function StatItem({ title, value, change, positive }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-indigo-500">{title}</p>
        <p className="text-xl font-bold text-indigo-900">{value}</p>
      </div>
      <div className={`px-2 py-1 rounded ${positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {change}
      </div>
    </div>
  );
}

function ActivityRow({ name, activity, details, time, type }) {
  const getActivityStyle = (type) => {
    const styles = {
      purchase: 'bg-green-100 text-green-600',
      competition: 'bg-purple-100 text-purple-600',
      achievement: 'bg-yellow-100 text-yellow-600'
    };
    return styles[type] || 'bg-indigo-100 text-indigo-600';
  };

  return (
    <tr className="border-b border-indigo-100 hover:bg-indigo-50/50 transition-colors">
      <td className="py-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium text-sm text-indigo-900">{name}</span>
        </div>
      </td>
      <td className="py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${getActivityStyle(type)}`}>
          {activity}
        </span>
      </td>
      <td className="py-4 text-sm font-medium text-indigo-600">{details}</td>
      <td className="py-4 text-sm text-indigo-500">{time}</td>
    </tr>
  );
}

function BarChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const values = [6.5, 8.5, 4.5, 7.5, 5.5, 9.0, 8.0, 7.0];
  const maxValue = Math.max(...values);
  const achievements = {
    'Mar': { type: 'star', color: 'text-yellow-500' },
    'Jun': { type: 'crown', color: 'text-purple-500' },
    'Aug': { type: 'target', color: 'text-green-500' }
  };
  
  return (
    <div className="w-full h-full flex items-end">
      <div className="flex-1 flex items-end justify-between h-full relative">
        <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between">
          {[10, 8, 6, 4, 2, 0].map((value, i) => (
            <div key={i} className="w-full flex items-center">
              <span className="text-xs text-indigo-400 w-8">{value}</span>
              <div className="flex-1 border-b border-indigo-100 border-dashed h-0"></div>
            </div>
          ))}
        </div>
        
        {months.map((month, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center group w-20">
            <div className="relative">
              {achievements[month] && (
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${achievements[month].color}`}>
                  {achievements[month].type === 'star' && <Star className="w-5 h-5" />}
                  {achievements[month].type === 'crown' && <Crown className="w-5 h-5" />}
                  {achievements[month].type === 'target' && <Target className="w-5 h-5" />}
                </div>
              )}
              <div 
                className="w-8 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-300 relative overflow-hidden"
                style={{ height: `${(values[i] / 10) * 200}px` }}
              >
                <div className="absolute inset-0 bg-white/20 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col items-center mt-2">
              <span className="text-xs font-medium text-indigo-500">{month}</span>
              <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {values[i]}
              </span>
            </div>
            {values[i] === maxValue && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs py-1 px-2 rounded">
                Best Month!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
