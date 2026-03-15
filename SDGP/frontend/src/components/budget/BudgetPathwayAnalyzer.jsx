import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, TrendingUp, GraduationCap, BarChart3, ChevronDown, ChevronUp,
  ArrowRight, Lightbulb, Star, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { budgetPathways } from './BudgetPathwayData';
import PathwayCard from './PathwayCard';
import PathwayCostBar from './PathwayCostBar';
import PathwayDetailModal from './PathwayDetailModel';

const LKR = (val) => `Rs. ${val.toLocaleString()}`;

export default function BudgetPathwayAnalyzer({ careerId }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [showInstituteMsg, setShowInstituteMsg] = useState(null);

  const data = budgetPathways[careerId];
  if (!data) return null;

  const bestValue = data.alternatives.find(a => a.highlight) || data.alternatives[0];
  const maxSavings = data.traditional.cost - Math.min(...data.alternatives.map(a => a.cost));

  const handleFindInstitutes = (pathway) => {
    setShowInstituteMsg(pathway);
    setTimeout(() => setShowInstituteMsg(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      {/* Section Header */}
      <button
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors border-b border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-800 dark:text-slate-100">Budget-Friendly Pathway Analyzer</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Compare education costs & find affordable alternatives</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
            Save up to {LKR(maxSavings)}
          </span>
          {expanded
            ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
            : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-5 space-y-6">

              {/* Career Overview */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Career Goal</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{data.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.description}</p>
                  </div>
                  <div className="flex sm:flex-col gap-3 sm:gap-2 sm:text-right">
                    <div className="bg-white dark:bg-slate-900/10 rounded-xl px-4 py-2.5 text-center">
                      <p className="text-xs text-slate-400">Avg. Starting Salary</p>
                      <p className="text-base font-bold text-emerald-400">{LKR(data.avgStartingSalary)}/mo</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900/10 rounded-xl px-4 py-2.5 text-center">
                      <p className="text-xs text-slate-400">Pathways Available</p>
                      <p className="text-base font-bold text-blue-400">{data.alternatives.length + 1}</p>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.requiredSkills.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-900/10 text-slate-200 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Comparison Visual */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Cost Comparison</h4>
                </div>
                <PathwayCostBar
                  traditional={data.traditional}
                  alternatives={data.alternatives}
                />
              </div>

              {/* Highlight Best Value Banner */}
              {bestValue && (
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
                  <Star className="w-5 h-5 text-yellow-300 flex-shrink-0 fill-yellow-300" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">Best Value: {bestValue.label}</p>
                    <p className="text-xs text-purple-100 truncate">{bestValue.type} · {bestValue.institution}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">{LKR(bestValue.cost)}</p>
                    <p className="text-xs text-purple-200">{bestValue.duration}</p>
                  </div>
                </div>
              )}

              {/* Traditional vs Alternatives header */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Education Pathway Comparison</h4>
                </div>

                {/* Traditional */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 px-1">Traditional Pathway</p>
                  <PathwayCard
                    pathway={data.traditional}
                    isTraditional
                    index={0}
                    onViewDetails={() => {}}
                    onFindInstitutes={() => {}}
                  />
                </div>

                {/* Alternatives */}
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2 px-1">Affordable Alternatives</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.alternatives.map((alt, i) => (
                      <PathwayCard
                        key={i}
                        pathway={alt}
                        isTraditional={false}
                        index={i + 1}
                        onViewDetails={setSelectedPathway}
                        onFindInstitutes={handleFindInstitutes}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tip box */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Smart Planning Tip</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Starting with an affordable certification or diploma lets you enter the workforce sooner, earn a salary, and then optionally pursue a degree part-time — saving both time and money.
                  </p>
                </div>
              </div>

              {/* Institute toast */}
              <AnimatePresence>
                {showInstituteMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Institutes for "{showInstituteMsg.label}": {showInstituteMsg.institution}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed preview */}
      {!expanded && (
        <div className="px-5 py-3 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Traditional: {LKR(data.traditional.cost)}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Best Alt: {LKR(Math.min(...data.alternatives.map(a => a.cost)))}
          </span>
          <span className="ml-auto text-emerald-600 font-semibold text-xs">
            Save up to {LKR(maxSavings)} →
          </span>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPathway && (
          <PathwayDetailModal
            pathway={selectedPathway}
            careerTitle={data.title}
            onClose={() => setSelectedPathway(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}