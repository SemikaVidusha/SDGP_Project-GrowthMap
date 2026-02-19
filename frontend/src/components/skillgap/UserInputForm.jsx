import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronRight, Plus, X, Target, GraduationCap, Briefcase, Code2, Users, Award } from 'lucide-react';

const CAREER_OPTIONS = [
  { id: "software-engineer", label: "Software Engineer" },
  { id: "data-analyst", label: "Data Analyst" },
  { id: "ui-ux-designer", label: "UI/UX Designer" },
  { id: "cybersecurity-specialist", label: "Cybersecurity Specialist" },
  { id: "web-developer", label: "Web Developer" },
  { id: "network-technician", label: "Network Technician" },
  { id: "mobile-developer", label: "Mobile App Developer" },
  { id: "database-administrator", label: "Database Administrator" },
  { id: "project-manager", label: "IT Project Manager" },
  { id: "qa-engineer", label: "QA Engineer" },
];

const TECH_SUGGESTIONS = ["Python", "JavaScript", "SQL", "React", "Java", "C++", "HTML/CSS", "Git", "Linux", "Figma", "Excel", "Machine Learning", "Node.js", "Flutter", "AWS", "Docker", "Networking", "Selenium"];
const SOFT_SUGGESTIONS = ["Communication", "Teamwork", "Problem Solving", "Leadership", "Creativity", "Time Management", "Attention to Detail", "Critical Thinking", "Adaptability", "Collaboration"];

function TagInput({ value, onChange, suggestions, placeholder }) {
  const [inputVal, setInputVal] = useState('');

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (tag) => onChange(value.filter(t => t !== tag));

  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault();
      addTag(inputVal);
    }
  };

  const unusedSuggestions = suggestions.filter(s => !value.map(v => v.toLowerCase()).includes(s.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 border border-slate-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-400 transition-all">
        {value.map(tag => (
          <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-purple-900 transition-colors"><X className="w-3 h-3" /></button>
          </span>
        ))}
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder={value.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-24 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unusedSuggestions.slice(0, 8).map(s => (
            <button key={s} onClick={() => addTag(s)} className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 border border-slate-200 rounded-full hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
              <Plus className="w-3 h-3" /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserInputForm({ onAnalyze }) {
  const [form, setForm] = useState({
    targetCareer: '',
    currentEducation: '',
    yearsExperience: '',
    technicalSkills: [],
    softSkills: [],
    certifications: [],
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.targetCareer) e.targetCareer = 'Please select a target career';
    if (!form.currentEducation) e.currentEducation = 'Please select your education level';
    if (form.technicalSkills.length === 0) e.technicalSkills = 'Add at least one technical skill';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onAnalyze(form);
  };

  const sections = [
    {
      icon: Target,
      title: "Target Career",
      color: "text-purple-600",
      bg: "bg-purple-50",
      content: (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CAREER_OPTIONS.map(c => (
              <button
                key={c.id}
                onClick={() => { setForm(f => ({ ...f, targetCareer: c.id })); setErrors(e => ({ ...e, targetCareer: '' })); }}
                className={`p-3 text-sm font-medium rounded-xl border-2 text-left transition-all ${form.targetCareer === c.id ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-purple-300 text-slate-700 hover:bg-slate-50'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {errors.targetCareer && <p className="text-red-500 text-xs mt-1">{errors.targetCareer}</p>}
        </div>
      )
    },
    {
      icon: GraduationCap,
      title: "Education Level",
      color: "text-blue-600",
      bg: "bg-blue-50",
      content: (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'ol', label: "O/L (Ordinary Level)" },
              { id: 'al', label: "A/L (Advanced Level)" },
              { id: 'diploma', label: "Diploma / HND" },
              { id: 'degree', label: "Bachelor's Degree" },
              { id: 'postgrad', label: "Postgraduate" },
            ].map(e => (
              <button key={e.id} onClick={() => { setForm(f => ({ ...f, currentEducation: e.id })); setErrors(er => ({ ...er, currentEducation: '' })); }}
                className={`p-3 text-sm font-medium rounded-xl border-2 text-left transition-all ${form.currentEducation === e.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-slate-50'}`}>
                {e.label}
              </button>
            ))}
          </div>
          {errors.currentEducation && <p className="text-red-500 text-xs mt-1">{errors.currentEducation}</p>}
        </div>
      )
    },
    {
      icon: Briefcase,
      title: "Years of Experience",
      color: "text-green-600",
      bg: "bg-green-50",
      content: (
        <div className="flex flex-wrap gap-2">
          {['0', '0.5', '1', '2', '3', '5+'].map(y => (
            <button key={y} onClick={() => setForm(f => ({ ...f, yearsExperience: y }))}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${form.yearsExperience === y ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300 text-slate-600'}`}>
              {y === '0' ? 'No exp' : y === '5+' ? '5+ years' : `${y} yr${y === '1' ? '' : 's'}`}
            </button>
          ))}
        </div>
      )
    },
    {
      icon: Code2,
      title: "Technical Skills",
      color: "text-orange-600",
      bg: "bg-orange-50",
      content: (
        <div>
          <TagInput value={form.technicalSkills} onChange={v => { setForm(f => ({ ...f, technicalSkills: v })); setErrors(e => ({ ...e, technicalSkills: '' })); }} suggestions={TECH_SUGGESTIONS} placeholder="Type a skill and press Enter..." />
          {errors.technicalSkills && <p className="text-red-500 text-xs mt-1">{errors.technicalSkills}</p>}
        </div>
      )
    },
    {
      icon: Users,
      title: "Soft Skills",
      color: "text-pink-600",
      bg: "bg-pink-50",
      content: (
        <TagInput value={form.softSkills} onChange={v => setForm(f => ({ ...f, softSkills: v }))} suggestions={SOFT_SUGGESTIONS} placeholder="Type a soft skill and press Enter..." />
      )
    },
    {
      icon: Award,
      title: "Certifications (optional)",
      color: "text-teal-600",
      bg: "bg-teal-50",
      content: (
        <TagInput value={form.certifications} onChange={v => setForm(f => ({ ...f, certifications: v }))} suggestions={["CCNA", "CompTIA Security+", "AWS", "Google Analytics", "PMP", "ISTQB"]} placeholder="Type a certification and press Enter..." />
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {sections.map((section, i) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className={`flex items-center gap-3 px-5 py-4 ${section.bg} border-b border-slate-100`}>
            <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
              <section.icon className={`w-4 h-4 ${section.color}`} />
            </div>
            <h3 className="font-semibold text-slate-800">{section.title}</h3>
          </div>
          <div className="p-5">{section.content}</div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button onClick={handleSubmit} size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-base font-semibold rounded-2xl shadow-lg shadow-purple-200 mt-2">
          Analyze My Skill Gap
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}