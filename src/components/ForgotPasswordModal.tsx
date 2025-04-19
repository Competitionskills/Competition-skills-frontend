import React, { useState } from "react";
import { api } from "../helpers/axios";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    try {
      const response = await api.post("/users/forgot-password", { email });
      setStatus("success");
      setMessage(
        response.data?.message || 
        "Password reset instructions have been sent to your email."
      );
      setTimeout(() => {
        onClose();
        setEmail("");
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || 
        "Unable to process your request. Please try again later."
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 transition-opacity animate-fadeIn">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {status === "success" ? (
          <div className="text-center p-4 sm:p-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              ✓
            </div>
            <p className="text-green-600">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <p className="text-gray-600 mb-4">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <div className="mb-4">
              <input
                type="email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {message && (
              <p className={`text-sm mb-4 ${status === "error" ? "text-red-500" : "text-gray-600"}`}>
                {message}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-lg hover:from-indigo-800 hover:to-indigo-950 transition-colors w-full sm:w-auto"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;