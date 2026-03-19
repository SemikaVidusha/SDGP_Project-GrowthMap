import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { MapPin, UserCircle, Settings, Menu, X, LogOut } from "lucide-react";
import { createPageUrl } from "@/utils";
import Footer from "./components/Footer";
import logo from '@/assets/logo.png';

const navLinks = [
  { label: "Home", page: "Home" },
  { label: "Quiz", page: "Quiz" },
  { label: "Careers", page: "Careers" },
  { label: "Skill Gap", page: "SkillGap" },
  { label: "Job Trends", page: "job-trends" },
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (page) =>
    location.pathname.toLowerCase().includes(page.toLowerCase());

  const handleLogout = () => {
    // Clear temporary user storage (if using localStorage fake backend)
    localStorage.removeItem("growthmap_user");

    // Redirect to login
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={createPageUrl("Home")}
          className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 hover:text-purple-700"
        >
          <div className="w-15 h-15 rounded-lg bg-gradient-to-br  flex items-center justify-center">
            <img 
            src={logo} 
            alt="GrowthMap Logo"
            className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>
          <span>GrowthMap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isActive(page)
                  ? "bg-purple-100 text-purple-700"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">

          <Link
            to={createPageUrl("Profile")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <UserCircle className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>

          <Link
            to={createPageUrl("Settings")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-100 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-red-500" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map(({ label, page }) => (
              <Link
                key={page}
                to={createPageUrl(page)}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">

      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}