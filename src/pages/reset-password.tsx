import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../helpers/axios";
const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Missing token!");
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
    } catch (err) {
      console.error("❌ Reset password error", err);
      setError("Failed to reset password. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem", textAlign: "center" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          style={{ padding: "0.5rem 1rem", width: "100%" }}
        >
          {status === "submitting" ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {status === "success" && <p style={{ color: "green" }}>✅ Password reset successfully! Redirecting...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
};

export default ResetPassword;
