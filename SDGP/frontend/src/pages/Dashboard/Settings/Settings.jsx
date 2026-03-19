import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Sun, Moon, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 dark:text-white">Settings</h2>
      <div className="space-y-4">
        <GlassCard className="flex justify-between items-center">
          <div className="flex items-center gap-3"><Moon size={20}/><span>Dark Mode</span></div>
          <button onClick={() => setDark(!dark)} className="w-12 h-6 bg-slate-300 dark:bg-blue-600 rounded-full relative transition-colors">
            <motion.div animate={{ x: dark ? 24 : 4 }} className="w-4 h-4 bg-white rounded-full absolute top-1" />
          </button>
        </GlassCard>
        
        <GlassCard className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center gap-3"><Bell size={20}/><span>Notifications</span></div>
          <span className="text-blue-500 text-sm">Enabled</span>
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;