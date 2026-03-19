import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import Preloader from "./components/preloader";
import { ThemeProvider } from "./components/ThemeProvider";
import HelpBot from "./components/HelpBot";

import Home from "./pages/Dashboard/Home";
import Quiz from "./pages/Dashboard/Quiz";
import Careers from "./pages/Dashboard/Careers";
import Results from "./pages/Dashboard/Results";
import Login from "./pages/Dashboard/Auth/Login";
import Signup from "./pages/Dashboard/Auth/Signup";
import SkillGap from "./pages/Dashboard/SkillGap";
import Settings from "./pages/Dashboard/Settings";
import Profile from "./pages/Dashboard/Profile";
import JobTrends from "./pages/Dashboard/JobTrends";
import Layout from "./Layout";

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 5s is too long for UX

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <ThemeProvider>
        <Preloader loading={loading} />
        <HelpBot />

        <Routes>

          {/* Routes WITH Header + Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/skillgap" element={<SkillGap />} />
            <Route path="/job-trends" element={<JobTrends />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Routes WITHOUT Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </ThemeProvider>
    </>
  );
}