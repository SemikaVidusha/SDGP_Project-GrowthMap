import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import Preloader from "./components/preloader";
import Layout from "./Layout";

import Home from "./pages/Dashboard/Home";
import Quiz from "./pages/Dashboard/Quiz";
import Careers from "./pages/Dashboard/Careers";
import Results from "./pages/Dashboard/Results";
import Login from "./pages/Dashboard/Auth/Login";
import Signup from "./pages/Dashboard/Auth/Signup";
import SkillGap from "./pages/Dashboard/SkillGap";

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
      <Preloader loading={loading} />

      <Routes>

        {/* Routes WITH Header + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/skillgap" element={<SkillGap />} />
          <Route path="/results" element={<Results />} />
        </Route>

        {/* Routes WITHOUT Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </>
  );
}