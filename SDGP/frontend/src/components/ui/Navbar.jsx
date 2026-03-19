import React from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, BookOpen, User, Settings, PieChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Careers', path: '/careers' },
  { icon: BookOpen, label: 'Quiz', path: '/quiz' },
  { icon: PieChart, label: 'Skill Gap', path: '/skillgap' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-900 text-white p-6 shadow-2xl">
        <h1 className="text-2xl font-bold mb-10 text-blue-500">CareerPath</h1>
        <div className="space-y-3">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div 
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                  location.pathname === item.path ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-slate-200 dark:border-slate-800 flex justify-around p-4 z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.path} to={item.path}>
            <item.icon size={24} className={location.pathname === item.path ? 'text-blue-500' : 'text-slate-400'} />
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;