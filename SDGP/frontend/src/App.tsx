import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import Preloader from "./components/preloader";
import Layout from "./Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import HelpBot from "./components/HelpBot";

import Home from "./pages/Dashboard/Home";
import Quiz from "./pages/Dashboard/Quiz";
import Careers from "./pages/Dashboard/Careers";
import Results from "./pages/Dashboard/Results";
import Login from "./pages/Dashboard/Auth/Login";
import Signup from "./pages/Dashboard/Auth/Signup";
import ForgotPassword from "./pages/Dashboard/Auth/ForgotPassword";
import VerifyCode from "./pages/Dashboard/Auth/VerifyCode";
import VerifySignup from "./pages/Dashboard/Auth/VerifySignup";
import ResetPassword from "./pages/Dashboard/Auth/ResetPassword";
import SkillGap from "./pages/Dashboard/SkillGap";
import Settings from "./pages/Dashboard/Settings";
import Profile from "./pages/Dashboard/Profile";
import Roadmap from "./pages/Dashboard/Roadmap";
import PageNotFound from "./lib/PageNotFound";
import JobDetailsTrend from "./pages/JobDetailsTrend";
import JobTrends from "./pages/Dashboard/JobTrends";
import CVGenerator from "./pages/Dashboard/CVGenerator";

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
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/roadmap/:careerId" element={<Roadmap />} />
            <Route path="/job-trends" element={<JobTrends />} />
            <Route path="/job-trends/:id" element={<JobDetailsTrend />} />
            <Route path="/cv-generator" element={<CVGenerator />} />
          </Route>

          {/* Routes WITHOUT Layout - Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-signup" element={<VerifySignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
