import React from "react";

const ComingSoon = () => {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "0 20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#222" }}>
        🚀 ScorePerks is Coming Soon
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", maxWidth: "600px" }}>
        We're working hard to bring you an exciting experience full of competitions, rewards, and fun! Stay tuned — launch is just around the corner.
      </p>

      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        <a
          href="mailto:hello@scoreperks.co.uk"
          style={{
            textDecoration: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📧 Contact Us
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            backgroundColor: "#E1306C",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📸 Follow on Instagram
        </a>
      </div>
    </div>
  );
};

export default ComingSoon;
