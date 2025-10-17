import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion } from "framer-motion";
import { Trophy, Gamepad, Gift, Medal } from "lucide-react";
import api from "../helpers/axios";
import { useLocation } from "react-router-dom";

/** Normalize and validate UK postcode */
function normalizeUKPostcode(input: string) {
  // remove non-alphanumerics, uppercase
  const raw = (input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  // incode = last 3 chars, outcode = the rest
  if (raw.length < 5) return null;
  const incode = raw.slice(-3);
  const outcode = raw.slice(0, raw.length - 3);
  return `${outcode} ${incode}`.trim();
}

function isValidUKPostcode(input: string) {
  const normalized = normalizeUKPostcode(input);
  if (!normalized) return false;
  // Royal Mail–style regex (handles GIR 0AA and standard formats)
  const re =
    /^((GIR 0AA)|((([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}))$/i;
  return re.test(normalized);
}

const Signup = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    postCode: "",
    phoneNumber: "",
    referralCode: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const validateForm = () => {
    const { fullName, username, email, password, postCode, phoneNumber } = formData;

    if (!fullName || !username || !email || !password || !postCode || !phoneNumber) {
      setError("Please fill in all required fields.");
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
    // ✅ UK postcode validation
    if (!isValidUKPostcode(postCode)) {
      setError("Please enter a valid UK postcode (e.g. SW1A 1AA).");
      return false;
    }
    // Ensure phone is E.164-ish
    const phoneWithPlus = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
    const cleanedPhone = phoneWithPlus.replace(/\s+/g, "");
    if (!/^\+[1-9]\d{1,14}$/.test(cleanedPhone)) {
      setError("Phone must be valid and in international format, e.g. +447911123456");
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

    // normalize phone & postcode just before sending
    const cleanedPhone = formData.phoneNumber.replace(/\s+/g, "");
    const finalPhone = cleanedPhone.startsWith("+") ? cleanedPhone : `+${cleanedPhone}`;
    const finalPostcode = normalizeUKPostcode(formData.postCode) || formData.postCode.trim().toUpperCase();

    try {
      const response = await api.post("/users/register", {
        ...formData,
        phoneNumber: finalPhone,
        postCode: finalPostcode,
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

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <PhoneInput
                country="gb"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "0.5rem",
                  backgroundColor: "rgb(249 250 251)",
                  borderColor: "rgb(229 231 235)",
                }}
                buttonStyle={{
                  backgroundColor: "transparent",
                  borderColor: "rgb(229 231 235)",
                  borderRight: "none",
                }}
                dropdownStyle={{ width: "300px" }}
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <input
              type="text"
              name="postCode"
              placeholder="Post Code (e.g. SW1A 1AA)"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.postCode}
              onChange={handleChange}
              // optional HTML validation hint (accepts space optional)
              pattern="^((GIR 0AA)|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-HJ-Y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-HJ-Y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$"
              title="Enter a valid UK postcode, e.g. SW1A 1AA"
              required
            />

            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (Optional)"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.referralCode}
              onChange={handleChange}
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
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
