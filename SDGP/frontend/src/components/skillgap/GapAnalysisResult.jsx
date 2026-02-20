import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from "../ui/badge";
import {
  CheckCircle2, XCircle, AlertCircle, RotateCcw, BookOpen,
  Clock, TrendingUp, Zap, ChevronDown, ChevronUp, MapPin
} from 'lucide-react';
import UserInputForm from "./UserInputForm.jsx";
import InstituteMapModal from "./InstituteMapModel";
import LocationDetector from "./LocationDetector";

function MatchMeter({ percent }) {
  const color = percent >= 75 ? '#22c55e' : percent >= 50 ? '#f59e0b' : percent >= 25 ? '#f97316' : '#ef4444';
  const label = percent >= 75 ? 'Career Ready' : percent >= 50 ? 'Almost There' : percent >= 25 ? 'Developing' : 'Beginner';
  const labelColor = percent >= 75 ? 'text-green-600' : percent >= 50 ? 'text-amber-600' : percent >= 25 ? 'text-orange-600' : 'text-red-600';
  const bgColor = percent >= 75 ? 'bg-green-100' : percent >= 50 ? 'bg-amber-100' : percent >= 25 ? 'bg-orange-100' : 'bg-red-100';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <motion.circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - percent / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-3xl font-bold text-slate-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {percent}%
          </motion.span>
          <span className="text-xs text-slate-500 font-medium">Match</span>
        </div>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${bgColor} ${labelColor}`}>{label}</span>
    </div>
  );
}

function SkillRow({ skill, matched }) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${matched ? 'bg-green-50' : 'bg-red-50'}`}>
      <span className="text-sm text-slate-700 font-medium">{skill}</span>
      <div className="flex items-center gap-1.5">
        {matched
          ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600 font-medium">Matched</span></>
          : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-xs text-red-500 font-medium">Missing</span></>
        }
      </div>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, iconColor, count, total, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span className="font-semibold text-slate-800">{title}</span>
          <span className="text-sm text-slate-500 font-normal">{count}/{total} matched</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 grid gap-2">{children}</div>}
    </div>
  );
}

export default function GapAnalysisResult({ result, onReset }) {
  const { career, matchPercentage, techAnalysis, softAnalysis, certAnalysis, educationMet, expGap, missingTech, priorityGaps, timeline } = result;
  const [selectedResource, setSelectedResource] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Debugging logs
  useEffect(() => {
    console.log("Skill Gap Result:", result);
    console.log("User Location:", userLocation);
  }, [result, userLocation]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Hero Result Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${career.color} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <MatchMeter percent={matchPercentage} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white/80 text-sm font-medium mb-1">Your match score for</p>
            <h2 className="text-2xl font-bold mb-3">{career.title}</h2>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
                <Clock className="w-4 h-4" />
                <span>Est. {timeline} to readiness</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{missingTech.length} tech skills missing</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Priority Gaps */}
      {priorityGaps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Priority Gaps to Bridge</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {priorityGaps.map((g, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${g.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                {g.priority === 'high' ? '🔴' : '🟡'} {g.skill}
              </span>
            ))}
          </div>
          {!educationMet && (
            <p className="text-amber-700 text-sm mt-3 font-medium">⚠️ Your current education may not meet the requirements. Consider upgrading your qualifications.</p>
          )}
          {expGap > 0 && (
            <p className="text-amber-700 text-sm mt-2 font-medium">⚠️ {expGap} more year{expGap !== 1 ? 's' : ''} of experience recommended for this role.</p>
          )}
        </motion.div>
      )}

      {/* Skills & Certifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <CollapsibleSection title="Technical Skills" icon={Zap} iconColor="text-orange-500"
          count={techAnalysis.filter(s => s.matched).length} total={techAnalysis.length}>
          {techAnalysis.map(s => <SkillRow key={s.skill} skill={s.skill} matched={s.matched} />)}
        </CollapsibleSection>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <CollapsibleSection title="Soft Skills" icon={TrendingUp} iconColor="text-blue-500"
          count={softAnalysis.filter(s => s.matched).length} total={softAnalysis.length}>
          {softAnalysis.map(s => <SkillRow key={s.skill} skill={s.skill} matched={s.matched} />)}
        </CollapsibleSection>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <CollapsibleSection title="Recommended Certifications" icon={BookOpen} iconColor="text-purple-500"
          count={certAnalysis.filter(c => c.matched).length} total={certAnalysis.length}>
          {certAnalysis.map(c => <SkillRow key={c.cert} skill={c.cert} matched={c.matched} />)}
        </CollapsibleSection>
      </motion.div>

      {/* Learning Resources */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-purple-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-slate-800">Recommended Learning Resources</span>
          </div>
        </div>

        {/* Location detector */}
        <div className="px-5 pt-4 pb-2">
          <LocationDetector onLocationDetected={setUserLocation} />
        </div>

        <div className="p-5 pt-3 grid sm:grid-cols-2 gap-3">
          {career.resources.map((r, i) => (
            <div key={i} className="flex flex-col p-3 border border-slate-100 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-all group cursor-pointer"
              onClick={() => setSelectedResource(r)}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800 group-hover:text-purple-700">{r.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.skill}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${r.type === 'Free' ? 'bg-green-100 text-green-700' : r.type === 'Freemium' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {r.type}
                </span>
              </div>
              {r.institute && (
                <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 group-hover:text-purple-800">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{r.institute.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Map Modal */}
      {selectedResource && (
        <InstituteMapModal
          resource={selectedResource}
          userLocation={userLocation}
          onClose={() => setSelectedResource(null)}
        />
      )}

      {/* Action Plan Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-3">📋 Your Personalized Action Plan</h3>
        <ol className="space-y-2 text-sm text-blue-100">
          {missingTech.slice(0, 3).map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5">{i + 1}</span>
              <span>Learn <strong className="text-white">{s}</strong> — start with free resources or beginner courses online.</span>
            </li>
          ))}
          {!educationMet && (
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5">{missingTech.slice(0, 3).length + 1}</span>
              <span>Pursue a <strong className="text-white">{career.education}</strong>-level qualification from a recognized institution.</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5">✓</span>
            <span>Aim for your first certification: <strong className="text-white">{career.certifications[0]}</strong> to boost your profile.</span>
          </li>
        </ol>
        <p className="mt-4 text-sm text-blue-100 font-medium">⏱ Estimated time to career readiness: <strong className="text-white">{timeline}</strong></p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button onClick={onReset} variant="outline" size="lg"
          className="w-full border-2 border-slate-200 hover:border-purple-400 hover:text-purple-600 rounded-2xl py-5 font-medium">
          <RotateCcw className="w-4 h-4 mr-2" /> Analyze a Different Career
        </Button>
      </motion.div>
    </div>
  );
}
