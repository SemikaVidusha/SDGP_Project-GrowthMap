import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, CheckCircle2, Star, ExternalLink, BookOpen, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LKR = (val) => `Rs. ${val.toLocaleString()}`;

export default function PathwayCard({ pathway, isTraditional, index, onViewDetails, onFindInstitutes }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative rounded-2xl border-2 overflow-hidden transition-shadow hover:shadow-lg ${
        pathway.highlight
          ? 'border-purple-300 shadow-md'
          : isTraditional
          ? 'border-blue-200'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {pathway.highlight && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      )}

      <div className={`px-5 py-4 ${isTraditional ? 'bg-blue-50' : pathway.highlight ? 'bg-purple-50' : 'bg-white dark:bg-slate-900'}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isTraditional ? 'bg-blue-100' : pathway.highlight ? 'bg-purple-100' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {isTraditional
                ? <Building2 className="w-5 h-5 text-blue-600" />
                : <BookOpen className={`w-5 h-5 ${pathway.highlight ? 'text-purple-600' : 'text-slate-600 dark:text-slate-300'}`} />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{pathway.label}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${pathway.badgeColor}`}>{pathway.badge}</span>
                {pathway.highlight && (
                  <span className="flex items-center gap-1 text-xs text-purple-600 font-semibold">
                    <Star className="w-3 h-3 fill-purple-500 text-purple-500" /> Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{pathway.type}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{pathway.institution}</p>
            </div>
          </div>
        </div>

        {/* Cost & Duration */}
        <div className="flex gap-3 mb-4">
          <div className={`flex-1 rounded-xl p-3 text-center ${isTraditional ? 'bg-blue-100/60' : pathway.highlight ? 'bg-purple-100/60' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Total Cost</p>
            <p className={`text-lg font-bold ${isTraditional ? 'text-blue-700' : pathway.highlight ? 'text-purple-700' : 'text-slate-700 dark:text-slate-200'}`}>
              {LKR(pathway.cost)}
            </p>
          </div>
          <div className={`flex-1 rounded-xl p-3 text-center ${isTraditional ? 'bg-blue-100/60' : pathway.highlight ? 'bg-purple-100/60' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Duration</p>
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">{pathway.duration}</p>
          </div>
        </div>

        {/* Skills Gained (only for alternatives) */}
        {!isTraditional && pathway.skillsGained && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills You'll Gain</p>
            <div className="flex flex-wrap gap-1.5">
              {pathway.skillsGained.map((s, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Outcomes */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Outcomes</p>
          <ul className="space-y-1.5">
            {pathway.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        {!isTraditional && (
          <div className="flex gap-2 flex-wrap pt-1">
            <Button
              size="sm"
              onClick={() => onViewDetails(pathway)}
              className={`rounded-xl text-xs flex-1 ${pathway.highlight ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFindInstitutes(pathway)}
              className="rounded-xl text-xs flex-1 border-slate-300 hover:border-purple-400 hover:text-purple-700"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Find Institutes
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}