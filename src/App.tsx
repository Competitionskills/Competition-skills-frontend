import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ComingSoon from "./pages/Comingsoon";
import VerifyEmail from "./pages/verify-email";
import ResetPassword from "./pages/reset-password";
import Competitions from "./pages/competitions";
import "./index.css";
import { useEffect } from "react";
import { setAuthToken } from "./helpers/axios";
import { UserProvider } from "./context/userContext";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AdminCompetitionsPage from "./pages/admin/adminCompetitionPage";
// ✅ Replace with your own publishable key
const stripePromise = loadStripe('pk_test_51RmhOCFW9n2BdCkE7OqPEUVIRv0iMx3GOMOxoOBW1jlYoJuUD44B5hEXV3MsPJF8bTLdmBI2d1OqFMJudP87R2wj00D3IxvMDR');


function App() {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);
  return (
    <UserProvider>
            <Elements stripe={stripePromise}>

    <Router>
      <Routes>
      <Route path="/" element={<ComingSoon />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/adminCompetitionPage" element={<AdminCompetitionsPage />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </Router>
          </Elements>

    </UserProvider>
  );
}

export default App;
