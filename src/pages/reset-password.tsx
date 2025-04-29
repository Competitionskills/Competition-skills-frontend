import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Check, AlertCircle } from "lucide-react";
import "../styles/animations.css";
import { api } from "../helpers/axios";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Missing reset token! Please use the link from your email.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      const formElement = document.getElementById("resetForm");
      if (formElement) {
        formElement.classList.add("animate-shake");
        setTimeout(() => formElement.classList.remove("animate-shake"), 500);
      }
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      await api.post("/users/reset-password", { token, newPassword });
      setStatus("success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Reset password error", err);
      
      const formElement = document.getElementById("resetForm");
      if (formElement) {
        formElement.classList.add("animate-shake");
        setTimeout(() => formElement.classList.remove("animate-shake"), 500);
      }
      
      if (err.response?.status === 400) {
        setError("Invalid or expired token. Please request a new password reset link.");
      } else if (err.response?.status === 404) {
        setError("User not found. Please check your email and try again.");
      } else {
        setError("Failed to reset password. Please try again later.");
      }
      
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 via-indigo-500 to-blue-700 py-6 px-4 sm:py-12">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        
        {/* Reset Password Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Reset Password</h2>
          
          {status === "success" ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 animate-fadeIn">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-green-700">Password reset successfully!</p>
              </div>
              <p className="text-sm text-green-600 mt-2">Redirecting to login page...</p>
            </div>
          ) : (
            <form id="resetForm" onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 animate-fadeIn">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Resetting..." : "Reset Password"}
              </button>
              
              <p className="text-sm text-center mt-4">
                <Link 
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Back to Sign In
                </Link>
              </p>
            </form>
          )}
        </div>

        {/* Information Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-700/90 to-indigo-900/90 text-white p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Create a Strong Password</h2>
          <p className="mt-4 text-md font-medium">
            A strong password helps keep your account secure.
          </p>
          <ul className="mt-6 space-y-2">
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
              <span>Use at least 8 characters</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
              <span>Include uppercase and lowercase letters</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
              <span>Include at least one number</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
              <span>Include at least one special character</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;