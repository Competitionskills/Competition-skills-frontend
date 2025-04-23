import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion } from "framer-motion";
import { Trophy, Gamepad, Gift, Medal } from "lucide-react";
import api from "../helpers/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    postCode: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  const validateForm = () => {
    const { fullName, username, email, password, postCode, phone } = formData;

    if (!fullName || !username || !email || !password || !postCode || !phone) {
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
     const phoneWithPlus = phone.startsWith("+") ? phone : `+${phone}`;
    const cleanedPhone = phoneWithPlus.replace(/\s+/g, "");

    if (!/^\+[1-9]\d{1,14}$/.test(cleanedPhone)) {
      setError("Phone number must be valid and in international format, e.g. +447911123456");
      return false;
    }

    setError("");
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setError("");

    // Remove spaces and make sure it starts with +
    const cleanedPhone = formData.phone.replace(/\s+/g, "");
    const finalPhone = cleanedPhone.startsWith("+") ? cleanedPhone : `+${cleanedPhone}`;

    try {
      const response = await api.post("/users/register", {
        ...formData,
        phone: finalPhone,
      });

      setMessage("Registration successful! Please check your email to verify your account.");
    } catch (error: any) {
      console.error("❌ Signup Error:", error);
      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again."
      );
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

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

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
                country={"us"}
                value={formData.phone}
                onChange={handlePhoneChange}
                containerClass="!w-full"
                inputClass="!w-full !px-4 !py-3 !rounded-lg !bg-gray-50 !border !border-gray-200 focus:!outline-none focus:!ring-2 focus:!ring-blue-500"
                dropdownClass="!absolute !bg-white !border !border-gray-200 !rounded-lg !shadow-lg !z-50 !mt-1"
                buttonClass="!border-r-0 !bg-transparent !hover:bg-gray-100"
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
