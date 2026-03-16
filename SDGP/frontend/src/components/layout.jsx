import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, UserCircle, Settings, Compass, Brain, Target, Menu, X } from 'lucide-react';

function Preloader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'preloader-fadeout 0.5s ease 1.5s forwards'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'preloader-pulse 1s ease-in-out infinite'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 28 L16 18 L22 24 L30 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="30" cy="12" r="3" fill="white"/>
          </svg>
        </div>
        <span style={{ color: 'white', fontSize: '24px', fontWeight: '700', letterSpacing: '0.5px' }}>
          GrowthMap
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.8)',
              animation: `preloader-bounce 0.8s ease-in-out ${i * 0.15}s infinite`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const navLinks = [
  { label: 'Home', page: 'Home' },
  { label: 'Quiz', page: 'Quiz' },
  { label: 'Careers', page: 'Careers' },
  { label: 'Skill Gap', page: 'SkillGap' },
];

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (page) => location.pathname.toLowerCase().includes(page.toLowerCase());

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to={createPageUrl('Home')} className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 hover:text-purple-700 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-base">GrowthMap</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(page)
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <Link to={createPageUrl('Profile')} title="Profile"
            className={`p-2 rounded-lg transition-colors ${isActive('Profile') ? 'bg-purple-100 text-purple-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800'}`}>
            <UserCircle className="w-5 h-5" />
          </Link>
          <Link to={createPageUrl('Settings')} title="Settings"
            className={`p-2 rounded-lg transition-colors ${isActive('Settings') ? 'bg-purple-100 text-purple-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800'}`}>
            <Settings className="w-5 h-5" />
          </Link>
          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden ml-1 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(page) ? 'bg-purple-100 text-purple-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2 flex gap-2">
            <Link to={createPageUrl('Profile')} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 flex-1">
              <UserCircle className="w-4 h-4" /> Profile
            </Link>
            <Link to={createPageUrl('Settings')} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 flex-1">
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <img 
                src={logo} 
                alt="GrowthMap Logo"
                className="h-10 w-auto object-contain"
              />
              </div>
              <span className="text-lg font-bold">GrowthMap</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">Your personalised ICT career navigator, built for Sri Lankan students.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Explore</p>
              {navLinks.map(({ label, page }) => (
                <Link key={page} to={createPageUrl(page)} className="text-slate-400 hover:text-purple-400 transition-colors">{label}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Account</p>
              <Link to={createPageUrl('Profile')} className="text-slate-400 hover:text-purple-400 transition-colors">Profile</Link>
              <Link to={createPageUrl('Settings')} className="text-slate-400 hover:text-purple-400 transition-colors">Settings</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 dark:text-slate-400 text-xs">
          GrowthMap · Final Year Project Prototype · 2026
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children, currentPageName }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Pages that have their own gradient header — don't show the standalone footer/header overlap
  const hideFooter = false;

  return (
    <div className="min-h-screen flex flex-col">
      {loading && <Preloader />}
      <style>{`
        :root {
          --color-primary: #7c3aed;
          --color-primary-dark: #6d28d9;
          --color-secondary: #3b82f6;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        * { scroll-behavior: smooth; }
        @keyframes preloader-fadeout { to { opacity: 0; pointer-events: none; } }
        @keyframes preloader-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes preloader-bounce { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-8px); opacity: 1; } }
      `}</style>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}