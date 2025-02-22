 // eslint-disable-next-line
 import React, { useState, useEffect } from 'react';
import { Ticket, Gift, LogOut, Coins, User as UserIcon, CheckCircle, Info, Timer, Trophy, Star, Users, ChevronRight, Clock } from 'lucide-react';
import competitionImage from "../images/competition.jpg";
import newHeroImage from "../images/new-hero-image.jpg";
import cashPrizeImage from "../images/cash-prizes.jpg";
import { User } from '../type';
import { Competition } from '../type';

const mockUser: User = {
  email: "ZK Gelani",
  tickets: 0,
  prestige: 0,
  diamonds: 5,
  points: 100
};

const mockCompetitions: Competition[] = [
  {
    id: "1",
    title: "£10,000 Mega Draw",
    description: "Exclusive Prestige-only monthly draw! Don't miss out on our biggest prize pool yet.",
    prize: 10000,
    ticketsSold: 150,
    totalTickets: 500,
    ticketPrice: 0,
    prestigeOnly: true,
    imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070",
    endsAt: "2024-04-01T00:00:00.000Z"
  },
  {
    id: "2",
    title: "Weekly Cash Drop",
    description: "Win instant cash prizes every week!",
    prize: 1000,
    ticketsSold: 75,
    totalTickets: 200,
    ticketPrice: 5,
    prestigeOnly: false,
    imageUrl: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&q=80&w=2073",
    endsAt: "2024-03-25T00:00:00.000Z"
  },
  {
    id: "3",
    title: "Daily Bonus Draw",
    description: "Daily chances to win bonus credits!",
    prize: 250,
    ticketsSold: 45,
    totalTickets: 100,
    ticketPrice: 2,
    prestigeOnly: false,
    imageUrl: "https://images.unsplash.com/photo-1541580621-5d71ac1a639d?auto=format&fit=crop&q=80&w=2075",
    endsAt: "2024-03-20T00:00:00.000Z"
  }
];

const mockTopParticipants = [
  { id: 1, name: "John D.", tickets: 45, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" },
  { id: 2, name: "Sarah M.", tickets: 38, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 3, name: "Alex K.", tickets: 32, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100" }
];

const CompetitionTimer: React.FC<{ endDate: string; small?: boolean }> = ({ endDate, small }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (small) {
    return (
      <div className="flex items-center gap-1 text-sm bg-blue-600/80 rounded-full px-3 py-1">
        <Clock className="h-4 w-4" />
        <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 bg-blue-600 rounded-lg p-4 text-white text-center">
      <div>
        <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-xs">Days</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-xs">Hrs</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-xs">Mins</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-xs">Secs</div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ current: number; max: number; bonus: string }> = ({ current, max, bonus }) => {
  const percentage = (current / max) * 100;
  
  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{current}/{max}</span>
        <span>{bonus}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [dailyLoginStreak, setDailyLoginStreak] = useState(0);
  const [submittedCodes, setSubmittedCodes] = useState(0);
  const [competitionsEntered, setCompetitionsEntered] = useState(0);
  
  const handleLogin = () => {
    if (dailyLoginStreak < 7) {
      setDailyLoginStreak(dailyLoginStreak + 1);
    }
  };

  const handleSubmitCode = () => {
    if (submittedCodes < 10) {
      setSubmittedCodes(submittedCodes + 1);
    }
  };

  const handleEnterCompetition = () => {
    if (competitionsEntered < 10) {
      setCompetitionsEntered(competitionsEntered + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 bg-gray-800 rounded-lg text-white text-lg">
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col items-center">
                <img
                  src="https://via.placeholder.com/200"
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full mb-2 border-2 border-gray-700"
                />
                <p className="mb-2 text-4xl font-bold">{mockUser.email}</p>
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  <p><strong>Tickets:</strong> {mockUser.tickets}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <p><strong>Prestige:</strong> {mockUser.prestige}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  <p><strong>Points:</strong> {mockUser.points}</p>
                </div>
              </div>
            </div>
            
            {/* Daily Tasks Section */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-white font-bold mb-4">Daily Tasks</h3>
              <div className="grid grid-cols-6 gap-5 mb-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${index < dailyLoginStreak ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {index + 1}
                  </div>
                ))}
              </div>
              <button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                Claim Today's Reward
              </button>
              <div className="text-gray-400 mt-2 text-center">
                Today's Reward: {dailyLoginStreak * 10} Points
              </div>
            </div>
            
            {/* Submit Code Section */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between text-gray-400">
                <span>Submit Code</span>
                {submittedCodes >= 5 ? <CheckCircle className="h-4 w-4 text-green-500" /> : null}
              </div>
              <input 
                type="text" 
                placeholder="Enter code" 
                className="w-full bg-gray-700 text-white p-2 rounded mt-2"
              />
              <button 
                onClick={handleSubmitCode} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-2"
              >
                Submit
              </button>
              <ProgressBar 
                current={submittedCodes} 
                max={5} 
                bonus="Double Points at 5 codes!"
              />
              <div className="text-gray-400 mt-1">
                <Info className="h-4 w-4 inline mr-1" /> Enter 5 codes to earn double points
              </div>
            </div>

            {/* Competition Entry Section */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-white font-bold mb-4">Competition Progress</h3>
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img 
                  src={competitionImage} 
                  alt="Competition"
                  className="w-full h-auto rounded-lg mb-4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <p className="text-white text-lg font-semibold">Win Extra Rewards!</p>
                </div>
              </div>
              <button 
                onClick={handleEnterCompetition}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded text-xl mb-2"
              >
                Participate Now
              </button>
              <ProgressBar 
                current={competitionsEntered} 
                max={10} 
                bonus="5 Extra Tickets at 10 entries!"
              />
            </div>

            {/* Buy Ticket Section */}
            <div className="p-6">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-xl">
                Purchase Tickets
              </button>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="col-span-2 space-y-6">
            {/* Featured Mega Draw */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={newHeroImage} 
                  alt="Mega Draw"
                  className="w-full h-68 object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-1 rounded-lg font-bold">
                  Prestige Only
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">£10,000 Mega Draw</h2>
                    <p className="text-gray-400 text-lg">Don't miss out on our biggest prize pool yet!</p>
                  </div>
                  <CompetitionTimer endDate={mockCompetitions[0].endsAt ??""} />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400">Prize Pool</p>
                    <p className="text-2xl font-bold text-green-400">£10,000</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400">Tickets Sold</p>
                    <p className="text-2xl font-bold text-blue-400">150/500</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400">Entry Price</p>
                    <p className="text-2xl font-bold text-yellow-400">Prestige Ticket</p>
                  </div>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg text-xl font-bold transition-colors">
                  Participate Now
                </button>
              </div>
            </div>

            {/* All Competitions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">All Competitions</h2>
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  View All <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {mockCompetitions.slice(1).map(competition => (
                  <div key={competition.id} className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="relative">
                      <img 
                        src={cashPrizeImage} 
                        alt="Cash Prize"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full">
                          £{competition.ticketPrice}
                        </div>
                        <CompetitionTimer endDate={competition.endsAt ??""} small />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white mb-2">{competition.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{competition.description}</p>
                      <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                          Purchase (£{competition.ticketPrice})
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                          Use Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Participants Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Top Participants</h3>
              <div className="grid grid-cols-3 gap-4">
                {mockTopParticipants.map((participant, index) => (
                  <div key={participant.id} className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <img 
                      src={participant.avatar} 
                      alt={participant.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-white font-semibold">{participant.name}</p>
                      <p className="text-sm text-gray-400">{participant.tickets} tickets</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;