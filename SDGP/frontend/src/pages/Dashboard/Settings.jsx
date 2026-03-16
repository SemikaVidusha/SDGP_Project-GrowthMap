import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Bell, Moon, Globe, Shield, Trash2, ChevronRight,
  LogOut, Eye, EyeOff, Check, MapPin, Palette, Volume2
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function SettingRow({ icon: Icon, iconColor, label, description, right, border = true }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 ${border ? 'border-b border-slate-50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm px-5 overflow-hidden">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-4 pb-2">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();

  const [prefs, setPrefs] = useState({
    darkMode: false,
    emailNotifications: true,
    quizReminders: false,
    progressUpdates: true,
    publicProfile: false,
    dataSharing: false,
    soundEffects: true,
    language: 'en',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          method: "DELETE",
          headers: {
            "x-auth-token": token
          }
        });
        if (res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch("http://localhost:5000/api/users/settings", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Object.keys(data).length > 0) {
            setPrefs(prev => ({ ...prev, ...data }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, [navigate]);

  const set = (key) => async (val) => {
    const newPrefs = { ...prefs, [key]: val };
    setPrefs(newPrefs);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/users/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newPrefs)
        });
        
        // Update live theme without reloading
        if (key === 'darkMode') {
          setTheme(val ? 'dark' : 'light');
        }
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-950 via-white dark:via-slate-900 to-purple-50 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-10 px-4">
        <div className="max-w-xl mx-auto text-center">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900/20 rounded-full text-m font-medium mb-3">
              <Check className="w-3 h-3" />
              {saved ? 'Preferences saved' : 'App Settings'}
            </div>
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="text-blue-100 text-m mt-1">Manage your preferences and account</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        <Section title="Appearance">
          <SettingRow
            icon={Moon} iconColor="bg-gradient-to-br from-indigo-500 to-purple-600"
            label="Dark Mode"
            description="Switch to a darker interface (coming soon)"
            border={false}
            right={<Toggle checked={prefs.darkMode} onChange={set('darkMode')} />}
          />
        </Section>

        
        {/* Sound */}
        <Section title="Sound & Experience">
          <SettingRow
            icon={Volume2} iconColor="bg-gradient-to-br from-teal-500 to-green-500"
            label="Sound Effects"
            description="Play sounds on quiz interactions"
            border={false}
            right={<Toggle checked={prefs.soundEffects} onChange={set('soundEffects')} />}
          />
        </Section>

        {/* Language */}
        <Section title="Language & Region">
          <SettingRow
            icon={Globe} iconColor="bg-gradient-to-br from-sky-500 to-blue-500"
            label="Language"
            description="Interface language for GrowthMap"
            border={false}
            right={
              <select
                value={prefs.language}
                onChange={e => set('language')(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white dark:bg-slate-900"
              >
                <option value="en">English</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
            }
          />
        </Section>

        

        {/* Account */}
        <Section title="Account">
          <Link to={createPageUrl("Profile")}>
            <SettingRow
              icon={MapPin} iconColor="bg-gradient-to-br from-blue-500 to-purple-600"
              label="Edit Profile"
              description="Update your name, bio, and career details"
              right={<ChevronRight className="w-4 h-4 text-slate-400" />}
            />
          </Link>
          <SettingRow
            icon={LogOut} iconColor="bg-gradient-to-br from-slate-500 to-slate-600"
            label="Sign Out"
            description="Sign out of your GrowthMap account"
            border={false}
            right={
              <Button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }} size="sm" variant="outline"
                className="text-xs rounded-xl border-slate-200 dark:border-slate-700 hover:border-red-300 hover:text-red-600">
                Sign Out
              </Button>
            }
          />
        </Section>

        {/* Delete account */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 shadow-sm px-5 overflow-hidden">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Delete Account</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Permanently remove your account and all data</p>
                </div>
              </div>
              <Button onClick={() => setShowDeleteConfirm(true)} size="sm" variant="outline"
                className="text-xs rounded-xl border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0">
                Delete
              </Button>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              <p className="text-sm text-red-700 font-medium">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <Button onClick={handleDeleteAccount} size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl">
                  Yes, delete my account
                </Button>
                <Button onClick={() => setShowDeleteConfirm(false)} size="sm" variant="outline"
                  className="text-xs rounded-xl">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>


      </div>
    </div>
  );
}