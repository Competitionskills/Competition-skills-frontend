import React from "react";

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
    image: "/images/comp1.jpg",
    link: "#",
  },
  {
    id: 2,
    title: "Weekly Credits Raffle",
    description:
      "Use your credits to participate in this weekly raffle. Don’t miss your chance to grab amazing rewards every week.",
    image: "/images/comp2.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Special Event Giveaway",
    description:
      "Celebrate with us! Join our special event competition for exclusive prizes. Limited time only!",
    image: "/images/comp3.jpg",
    link: "#",
  },
];

const Competitions: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f4f8fc] text-gray-900">
      {/* Header */}
      <header className="bg-blue-800 text-white py-6 text-center shadow-md">
        <h1 className="text-3xl font-bold">🎉 Competitions</h1>
        <p className="mt-2 text-sm opacity-90">
          Join and win exciting rewards!
        </p>
      </header>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-3">
            Ongoing & Upcoming Contests
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Welcome to our competitions hub! Buy tickets, participate, and stand
            a chance to win amazing prizes. Stay tuned for updates on our latest
            draws and special giveaways.
          </p>
        </div>

        {/* Competitions Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={comp.image}
                alt={comp.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {comp.title}
                </h3>
                <p className="text-sm text-gray-700">{comp.description}</p>
                <a
                  href={comp.link}
                  className="inline-block mt-4 bg-blue-800 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-900"
                >
                  Join Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-4 text-center text-sm mt-10">
        &copy; {new Date().getFullYear()} YourSiteName. All rights reserved.
      </footer>
    </div>
  );
};

export default Competitions;
