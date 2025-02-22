import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-red-700 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-red-800 shadow-lg">
        <div className="text-2xl font-bold">
          <span className="text-white">🏆 Champion's</span>
        </div>
        <ul className="flex space-x-6">
          <li><Link to="/competitions" className="hover:text-gray-300">Competitions</Link></li>
          <li><Link to="/dream-maker" className="hover:text-gray-300">The Dream Maker</Link></li>
          <li><Link to="/more" className="hover:text-gray-300">More</Link></li>
        </ul>
        <div className="space-x-4">
          <Link to="/login" className="border px-4 py-2 rounded hover:bg-white hover:text-red-700">Login</Link>
          <Link to="/signup" className="bg-white text-red-700 px-4 py-2 rounded hover:bg-gray-100">Create Account</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative text-center py-20 bg-black">
        <img 
          src="https://source.unsplash.com/featured/?bmw,car" 
          alt="BMW Competition" 
          className="w-full h-[500px] object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-6xl font-extrabold uppercase">Win This BMW</h1>
          <p className="text-xl mt-4">or Cash Prize</p>
          <p className="bg-red-600 px-6 py-2 mt-6 rounded-lg text-xl">Ends Tomorrow</p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="flex items-center justify-center py-20 bg-white text-black">
        <div className="w-1/3 bg-red-600 h-64 mx-4"></div>
        <div className="w-1/2">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-lg">
            Enter the competition by purchasing tickets, answer the question correctly, 
            and stand a chance to win amazing prizes!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
