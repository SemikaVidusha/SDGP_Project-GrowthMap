import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, BookOpen, Building2, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LKR = (val) => `Rs. ${val.toLocaleString()}`;

export default function PathwayDetailModal({ pathway, careerTitle, onClose }) {
  if (!pathway) return null;

  const breakdown = pathway.costBreakdown || {};
  const items = [
    { label: 'Tuition / Course Fees', value: breakdown.tuition },
    { label: 'Living / Accommodation', value: breakdown.living },
    { label: 'Study Materials', value: breakdown.materials },
    { label: 'Exams / Certification Fees', value: breakdown.exams },
  ].filter(i => i.value > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{pathway.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{careerTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <DollarSign className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Cost</p>
              <p className="text-sm font-bold text-purple-700">{LKR(pathway.cost)}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
              <p className="text-sm font-bold text-blue-700">{pathway.duration}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <Building2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Institution</p>
              <p className="text-xs font-bold text-green-700 leading-tight">{pathway.institution}</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">Cost Breakdown</h3>
            <div className="space-y-2">
              {items.map((item, i) => {
                const pct = Math.round((item.value / pathway.cost) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300 w-40 flex-shrink-0">{item.label}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 w-28 text-right">{LKR(item.value)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Gained */}
          {pathway.skillsGained && (
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">Skills You'll Gain</h3>
              <div className="flex flex-wrap gap-2">
                {pathway.skillsGained.map((s, i) => (
                  <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-medium border border-purple-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes */}
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">Key Outcomes</h3>
            <ul className="space-y-2">
              {pathway.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <Button onClick={onClose} className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}