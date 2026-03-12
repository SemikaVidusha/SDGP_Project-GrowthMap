import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  User, Mail, MapPin, Calendar, Briefcase, GraduationCap,
  ArrowLeft, Edit3, Save, X, CheckCircle2, Target, BookOpen,
  Award, TrendingUp, Sparkles
} from 'lucide-react';
const educationLabels = {
  ol: "O/L (Ordinary Level)",
  al: "A/L (Advanced Level)",
  diploma: "Diploma",
  degree: "Bachelor's Degree",
  postgrad: "Postgraduate"
};

export default function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    bio: "",
    location: "",
    current_role: "",
    education: "",
    target_career: ""
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // LOAD USER FROM LOCAL STORAGE (Fake Backend)
  useEffect(() => {
    const storedUser = localStorage.getItem("growthmap_user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setForm(parsedUser);
    } else {
      const defaultUser = {
        full_name: "Demo User",
        email: "demo@growthmap.lk",
        bio: "",
        location: "",
        current_role: "",
        education: "",
        target_career: ""
      };

      localStorage.setItem("growthmap_user", JSON.stringify(defaultUser));
      setUser(defaultUser);
      setForm(defaultUser);
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setSaving(true);

    // simulate API delay
    setTimeout(() => {
      localStorage.setItem("growthmap_user", JSON.stringify(form));
      setUser(form);
      setSaving(false);
      setSaved(true);
      setEditing(false);

      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  if (!user) {
    return <div className="p-10">Loading profile...</div>;
  }

   const avatarLetter = user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  const statsCards = [
    { label: 'Career', value: user?.target_career ? user.target_career.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'Education', value: educationLabels[user?.education] || '—', icon: GraduationCap, color: 'from-purple-500 to-pink-500' },
    { label: 'Current Role', value: user?.current_role || '—', icon: Briefcase, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {avatarLetter}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user?.full_name || 'Your Profile'}</h1>
              <p className="text-blue-100 text-sm mt-0.5">{user?.email}</p>
              {user?.location && (
                <div className="flex items-center justify-center sm:justify-start gap-1 text-blue-200 text-xs mt-1">
                  <MapPin className="w-3 h-3" /> {user.location}
                </div>
              )}
            </div>
            <div className="sm:ml-auto">
              {!editing ? (
                <Button onClick={() => setEditing(true)} size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl backdrop-blur-sm">
                  <Edit3 className="w-4 h-4 mr-1.5" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleSave} disabled={saving} size="sm"
                    className="bg-white text-purple-700 hover:bg-blue-50 rounded-xl">
                    <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Saving…' : 'Save'}
                  </Button>
                  <Button onClick={() => setEditing(false)} size="sm" variant="ghost"
                    className="text-white hover:bg-white/20 rounded-xl">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {saved && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
          </motion.div>
        )}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statsCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* About / Bio */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-slate-800">About Me</h2>
          </div>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Write a short bio about yourself, your interests, and your career goals…"
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-slate-700 placeholder-slate-400"
            />
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed">
              {user?.bio || <span className="text-slate-400 italic">No bio added yet. Click Edit Profile to add one.</span>}
            </p>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-slate-800">Career Details</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Location', icon: MapPin, field: 'location', placeholder: 'e.g. Colombo, Sri Lanka' },
              { label: 'Current Role', icon: Briefcase, field: 'current_role', placeholder: 'e.g. Student, Junior Developer' },
            ].map(({ label, icon: Icon, field, placeholder }) => (
              <div key={field}>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </label>
                {editing ? (
                  <input
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700 placeholder-slate-400"
                  />
                ) : (
                  <p className="text-sm text-slate-700 px-3 py-2 bg-slate-50 rounded-xl">
                    {user?.[field] || <span className="text-slate-400">Not set</span>}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Education Level
              </label>
              {editing ? (
                <select
                  value={form.education}
                  onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700 bg-white"
                >
                  <option value="">Select level…</option>
                  {Object.entries(educationLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              ) : (
                <p className="text-sm text-slate-700 px-3 py-2 bg-slate-50 rounded-xl">
                  {educationLabels[user?.education] || <span className="text-slate-400">Not set</span>}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                <Target className="w-3.5 h-3.5" /> Target Career
              </label>
              {editing ? (
                <select
                  value={form.target_career}
                  onChange={e => setForm(f => ({ ...f, target_career: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700 bg-white"
                >
                  <option value="">Select career…</option>
                  {['software-engineer','data-analyst','ui-ux-designer','cybersecurity-specialist','web-developer','network-technician','mobile-developer','database-administrator','project-manager','qa-engineer'].map(c => (
                    <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-slate-700 px-3 py-2 bg-slate-50 rounded-xl">
                  {user?.target_career ? user.target_career.replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase()) : <span className="text-slate-400">Not set</span>}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="grid sm:grid-cols-2 gap-4">
          <Link to={createPageUrl("SkillGap")}>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-sm group-hover:text-purple-700">Skill Gap Analyzer</span>
              </div>
              <p className="text-xs text-slate-500">Discover what skills you're missing for your target career</p>
            </div>
          </Link>
          <Link to={createPageUrl("Quiz")}>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-sm group-hover:text-orange-700">Career Assessment</span>
              </div>
              <p className="text-xs text-slate-500">Retake the quiz to rediscover your best-fit ICT careers</p>
            </div>
          </Link>
        </motion.div>


      </div>
    </div>
  );
}