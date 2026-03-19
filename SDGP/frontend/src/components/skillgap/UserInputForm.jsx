import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ChevronRight, ChevronDown, Plus, X, Target, GraduationCap, Briefcase, Code2, Users, Award } from 'lucide-react';

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

const TECH_SUGGESTIONS = [
  "Python","JavaScript","SQL","React","Java","C++","HTML/CSS","Git",
  "Linux","Figma","Excel","Machine Learning","Node.js","Flutter",
  "AWS","Docker","Networking","Selenium"
];

const SOFT_SUGGESTIONS = [
  "Communication","Teamwork","Problem Solving","Leadership",
  "Creativity","Time Management","Attention to Detail",
  "Critical Thinking","Adaptability","Collaboration"
];

import { useRef, useEffect } from "react";

function TagInput({ value, onChange, suggestions, placeholder }) {

  const [inputVal, setInputVal] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const unusedSuggestions = suggestions.filter(
    s => !value.map(v => v.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="space-y-2 relative">

      <div className="flex flex-wrap gap-2 min-h-10 p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-purple-300 transition">

        {value.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
          >
            {tag}
            <button onClick={() => removeTag(tag)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setShowDropdown(true)}
          placeholder={value.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-24 outline-none text-sm text-slate-700 dark:text-slate-200 bg-transparent"
        />

        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>

      </div>

      {showDropdown && unusedSuggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-md max-h-40 overflow-y-auto">
          {unusedSuggestions.map(s => (
            <button
              key={s}
              onClick={() => addTag(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50"
            >
              {s}
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
    if (!form.currentEducation) e.currentEducation = 'Please select education level';
    if (form.technicalSkills.length === 0) e.technicalSkills = 'Add at least one technical skill';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onAnalyze(form);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      {/* Target Career */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-teal-300 to-purple-400  border-b">
          <Target className="w-4 h-4 text-black-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Target Career</h3>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CAREER_OPTIONS.map(c => (
            <button
              key={c.id}
              onClick={() => setForm(f => ({ ...f, targetCareer: c.id }))}
              className={`p-3 text-sm font-medium rounded-xl border-2 text-left transition-all ${
                form.targetCareer === c.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-teal-300 to-purple-400  border-b">
          <GraduationCap className="w-4 h-4 text-black-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Education Level</h3>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'ol', label: "O/L (Ordinary Level)" },
            { id: 'al', label: "A/L (Advanced Level)" },
            { id: 'diploma', label: "Diploma / HND" },
            { id: 'degree', label: "Bachelor's Degree" },
            { id: 'postgrad', label: "Postgraduate" },
          ].map(e => (
            <button
              key={e.id}
              onClick={() => setForm(f => ({ ...f, currentEducation: e.id }))}
              className={`p-3 text-sm font-medium rounded-xl border-2 text-left transition-all ${
                form.currentEducation === e.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-teal-300 to-purple-400  border-b">
          <Briefcase className="w-4 h-4 text-black-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Years of Experience</h3>
        </div>

        <div className="p-5 flex flex-wrap gap-2">
          {['0','0.5','1','2','3','5+'].map(y => (
            <button
              key={y}
              onClick={() => setForm(f => ({ ...f, yearsExperience: y }))}
              className={`px-5 py-2 rounded-xl border-2 text-sm ${
                form.yearsExperience === y
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {y === '0' ? 'No exp' : y === '5+' ? '5+ years' : `${y} yr`}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-teal-300 to-purple-400  border-b ">
          <Code2 className="w-4 h-4 text-black-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Technical Skills</h3>
        </div>

        <TagInput
          value={form.technicalSkills}
          onChange={v => setForm(f => ({ ...f, technicalSkills: v }))}
          suggestions={TECH_SUGGESTIONS}
          placeholder="Type a technical skill..."
        />

        {errors.technicalSkills && (
          <p className="text-purple-500 text-xs mt-1">{errors.technicalSkills}</p>
        )}
      </div>

      {/* Soft Skills */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-teal-300 to-purple-400 border-b">
          <Users className="w-4 h-4 text-black-600" />
          <h3 className="font-semibold">Soft Skills</h3>
        </div>

        <TagInput
          value={form.softSkills}
          onChange={v => setForm(f => ({ ...f, softSkills: v }))}
          suggestions={SOFT_SUGGESTIONS}
          placeholder="Type a soft skill..."
        />
      </div>

      {/* Certifications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-teal-300 to-purple-400  border-b">
          <Award className="w-4 h-4 text-black-600" />
          <h3 className="font-semibold">Certifications</h3>
        </div>

        <TagInput
          value={form.certifications}
          onChange={v => setForm(f => ({ ...f, certifications: v }))}
          suggestions={["CCNA","AWS","Google Analytics","PMP","ISTQB"]}
          placeholder="Type a certification..."
        />
      </div>

      <Button
        onClick={handleSubmit}
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl"
      >
        Analyze My Skill Gap
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>

    </div>
  );
}