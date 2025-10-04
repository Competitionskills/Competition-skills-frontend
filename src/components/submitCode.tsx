import React, { useEffect, useState, useRef } from "react";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import api from "../helpers/axios";

interface SubmitCodeProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdated?: (points: number) => void;
}

interface RedeemCodeResponse {
  success: boolean;
  message: string;
  points?: number;
}

const SubmitCode: React.FC<SubmitCodeProps> = ({ isOpen, onClose, onPointsUpdated }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // success = show green; error = show red; none = hide
  const [status, setStatus] = useState<"success" | "error" | "none">("none");
  const [fadeIn, setFadeIn] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setFadeIn(!!message);
  }, [message]);

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      setMessage("Please enter a valid code.");
      setStatus("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setStatus("none");

    try {
      const res = await api.post<RedeemCodeResponse>("/points/redeem-code", {
        code: code.trim(),
      });

      const pts = Number(res.data.points || 0);

      // Green only when we actually awarded points
      if (pts > 0) {
        setMessage(`${res.data.message} (+${pts} points)`);
        setStatus("success");
        onPointsUpdated?.(pts);
        setCode(""); // clear the field on success
      } else {
        // success response but 0 points -> treat as info/error visually (red)
        setMessage(res.data.message || "No points awarded.");
        setStatus("error");
      }
    } catch (err) {
      setMessage("Failed to redeem code. Please try again.");
      setStatus("error");
      console.error("Error redeeming code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setMessage("");
    setStatus("none");
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-indigo-900">Submit Code</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your code
            </label>
            <input
              ref={inputRef}
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmitCode()}
              placeholder="Type your code here"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmitCode}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Code"
            )}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-1 p-3 rounded-lg flex items-start gap-2 border transition-opacity duration-300 ${
                fadeIn ? "opacity-100" : "opacity-0"
              } ${
                status === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {status === "success" ? (
                <CheckCircle className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5" />
              )}
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitCode;
