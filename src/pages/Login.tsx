import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import "../styles/animations.css";
import { api, setAuthToken } from "../helpers/axios";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
  
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await api.post("/users/login", form);
  
      if (response.data.token) {
        setAuthToken(response.data.token);
        localStorage.setItem("authToken", response.data.token);
        setError("");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      const formElement = document.getElementById("loginForm");
      if (formElement) {
        formElement.classList.add("animate-shake");
        setTimeout(() => formElement.classList.remove("animate-shake"), 500);
      }
  
      if (error.response) {
        const status = error.response.status;
  
        if (status === 401) {
          setError("Incorrect email or password. Please try again.");
        } else if (status === 404) {
          setError("Account not found with this email address.");
        } else if (status === 403) {
          setError("Your account has been locked. Please contact support.");
        } else if (status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError(error.response.data?.message || "Login failed. Please check your credentials.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 via-indigo-500 to-blue-700 py-6 px-4 sm:py-12">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        
        {/* Sign In Form - Full width on mobile, half width on desktop */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Sign in</h2>
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                className="mr-2"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">
                Show Password
              </label>
            </div>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 animate-fadeIn">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-sm text-right mt-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </p>
          </form>
        </div>

        {/* Welcome Message - Full width on mobile, half width on desktop */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 text-white p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Welcome back to ScorePerk!</h2>
          <p className="mt-4 text-md font-medium">
            Glad to see you again! Dive back into exciting challenges, earn rewards, and climb the leaderboard.
          </p>
          <p className="mt-6 text-md font-medium">
            No account yet?{" "}
            <Link to="/signup" className="underline font-semibold hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SignIn;