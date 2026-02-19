import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react"
import Navbar from "./components/Navbar";
import Preloader from "./components/preloader";

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
    }, 5000);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Preloader loading={loading} />

      {/* Navbar always visible */}
      <Navbar />

      {/* Page content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/results" element={<Results />} />
        <Route path="/skillgap" element={<SkillGap />} />
      </Routes>
      
      <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
      </Routes>
      
      
        
    </>
    
  );
}
