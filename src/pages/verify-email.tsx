import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// ✅ Inline styles for spinner and layout
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
  },
  spinner: {
    border: "6px solid #eee",
    borderTop: "6px solid #5f38ff",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  keyframes: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
};

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/verify-failed");
      return;
    }

    fetch(`https://api.scoreperks.co.uk/api/users/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          navigate("/verify-failed");
        }
      })
      .catch(() => navigate("/error"));
  }, [navigate, params]);

  return (
    <div style={styles.wrapper}>
      <style>{styles.keyframes}</style>
      <div style={styles.spinner}></div>
      <p>Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;
