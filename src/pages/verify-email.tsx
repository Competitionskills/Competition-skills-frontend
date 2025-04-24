import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../helpers/axios";

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.post("/users/verify-email", { token }); // ⬅️ POST with token in body
        setStatus("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("❌ Email verification failed:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      {status === "loading" && <p>🔄 Verifying your email...</p>}
      {status === "success" && <p>✅ Email verified! Redirecting to dashboard...</p>}
      {status === "error" && (
        <p>❌ Email verification failed. The link may be invalid or expired.</p>
      )}
    </div>
  );
};

export default VerifyEmail;
