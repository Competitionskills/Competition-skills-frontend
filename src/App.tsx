import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ComingSoon from "./pages/Comingsoon";
import VerifyEmail from "./pages/verify-email";
import ResetPassword from "./pages/reset-password";
import "./index.css";
import { useEffect } from "react";
import { setAuthToken } from "./helpers/axios";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ComingSoon />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </Router>
  );
}

export default App;
