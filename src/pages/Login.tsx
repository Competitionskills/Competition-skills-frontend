import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", form);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setError(""); // Clear errors
        navigate("/dashboard"); // Redirect to Dashboard
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || "Invalid login credentials.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-gradient-to-r from-blue-700 to-blue-500 py-12">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        
        {/* Left Side - Sign In Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Sign in</h2>
          <form onSubmit={handleSubmit}>
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
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold text-lg"
            >
              Sign in
            </button>
            <p className="text-sm text-right mt-2">
              <a href="#" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </p>
          </form>
        </div>

        {/* Right Side - Welcome Message */}
        <div className="w-1/2 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold">Welcome back to ScorePerk!</h2>
          <p className="mt-4 text-md font-medium">
            Glad to see you again! Dive back into exciting challenges, earn rewards, and climb the leaderboard.
          </p>
          <p className="mt-6 text-md font-medium">
            No account yet?{" "}
            <a href="#" className="underline font-semibold">
              Signup.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
