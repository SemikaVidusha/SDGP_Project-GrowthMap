import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { MapPin, UserCircle, Settings, Menu, X } from "lucide-react";
import { createPageUrl } from "@/utils";
import Footer from "./components/Footer";

function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 animate-fadeout">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
          <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
            <path
              d="M8 28 L16 18 L22 24 L30 12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="30" cy="12" r="3" fill="white" />
          </svg>
        </div>

        <span className="text-white text-2xl font-bold tracking-wide">
          GrowthMap
        </span>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const navLinks = [
  { label: "Home", page: "Home" },
  { label: "Quiz", page: "Quiz" },
  { label: "Careers", page: "Careers" },
  { label: "Skill Gap", page: "SkillGap" },
];

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (page) =>
    location.pathname.toLowerCase().includes(page.toLowerCase());

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={createPageUrl("Home")}
          className="flex items-center gap-2 font-bold text-slate-800 hover:text-purple-700"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span>GrowthMap</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isActive(page)
                  ? "bg-purple-100 text-purple-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Link to={createPageUrl("Profile")} className="p-2 hover:bg-slate-100 rounded-lg">
            <UserCircle className="w-5 h-5 text-slate-600" />
          </Link>
          <Link to={createPageUrl("Settings")} className="p-2 hover:bg-slate-100 rounded-lg">
            <Settings className="w-5 h-5 text-slate-600" />
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">

      {loading && <Preloader />}

      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Professional Footer Component */}
      <Footer />

    </div>
  );
}