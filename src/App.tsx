import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ComingSoon from "./pages/Comingsoon";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ComingSoon />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
