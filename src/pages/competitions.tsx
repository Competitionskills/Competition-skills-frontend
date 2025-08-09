import React from "react";
import Header from "../components/Header";
import { Footer } from "../components/footer";
import BackgroundImage from "../images/background-img.jpg";

interface Competition {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const competitions: Competition[] = [
  {
    id: 1,
    title: "Monthly Prestige Draw",
    description:
      "Enter with your prestige ticket for a chance to win big! A random participant will be chosen as our monthly winner.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=500",
    link: "#",
  },
  {
    id: 2,
    title: "Weekly Credits Raffle",
    description:
      "Use your credits to participate in this weekly raffle. Don't miss your chance to grab amazing rewards every week.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=500",
    link: "#",
  },
  {
    id: 3,
    title: "Special Event Giveaway",
    description:
      "Celebrate with us! Join our special event competition for exclusive prizes. Limited time only!",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=500",
    link: "#",
  },
];

const Competitions: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div
        className="relative flex-grow bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm"></div>
        
        <div className="relative py-6 px-6 sm:px-8 lg:px-10 w-full max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-400">
              🎉 Competitions
            </h1>
            <p className="text-indigo-600 font-semibold text-xl tracking-wide">
              Join and win exciting rewards!
            </p>
          </div>

          {/* Intro */}
          <div className="text-center mb-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-8">
              <h2 className="text-2xl font-semibold text-indigo-800 mb-3">
                Ongoing & Upcoming Contests
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Welcome to our competitions hub! Buy tickets, participate, and stand
                a chance to win amazing prizes. Stay tuned for updates on our latest
                draws and special giveaways.
              </p>
            </div>
          </div>

          {/* Competitions Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-indigo-100"
              >
                <img
                  src={comp.image}
                  alt={comp.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                    {comp.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">{comp.description}</p>
                  <a
                    href={comp.link}
                    className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-105"
                  >
                    Join Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Competitions;