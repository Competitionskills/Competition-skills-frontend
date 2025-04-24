import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion } from "framer-motion";
import { Trophy, Gamepad, Gift, Medal } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    postCode: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const validateForm = () => {
    const { fullName, username, email, password, postCode, phoneNumber } = formData;

    if (!fullName || !username || !email || !password || !postCode || !phoneNumber) {
      setError("All fields are required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (!/^\d+$/.test(postCode)) {
      setError("Post code must be a number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://api.scoreperks.co.uk/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      setMessage("Registration successful! Please check your email to verify your account.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Join ScorePerk</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="relative">
              <PhoneInput
                country="gb"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                inputStyle={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgb(249 250 251)',
                  borderColor: 'rgb(229 231 235)',
                }}
                buttonStyle={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgb(229 231 235)',
                  borderRight: 'none',
                }}
                dropdownStyle={{
                  width: '300px',
                }}
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="text"
              name="postCode"
              placeholder="Post Code"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.postCode}
              onChange={handleChange}
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Start Your Journey"}
            </motion.button>

            {message && <p className="text-green-500 text-center mt-4">{message}</p>}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </form>
        </div>

        {/* Right Side - Features */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white text-center mb-6">Welcome to ScorePerk!</h2>
          <p className="text-xl text-white text-center mb-12">
            Compete in thrilling challenges, earn rewards, and climb the leaderboards!
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <p className="text-xl text-white">Win Cash Prizes</p>
            </div>
            <div className="flex items-center gap-4">
              <Gamepad className="w-8 h-8 text-green-300" />
              <p className="text-xl text-white">Join Exciting Challenges</p>
            </div>
            <div className="flex items-center gap-4">
              <Gift className="w-8 h-8 text-red-300" />
              <p className="text-xl text-white">Unlock Perks & Rewards</p>
            </div>
            <div className="flex items-center gap-4">
              <Medal className="w-8 h-8 text-blue-300" />
              <p className="text-xl text-white">Climb the Leaderboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;