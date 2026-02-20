import React from 'react';
import { motion } from 'framer-motion';
//import { traitDescriptions } from '../quiz/QuizData';
import { Brain, Lightbulb, Cpu, Users, Search } from 'lucide-react';

const iconMap = {
  Brain: Brain,
  Lightbulb: Lightbulb,
  Cpu: Cpu,
  Users: Users,
  Search: Search
};

export default function TraitChart({ traitScores }) {
  const maxScore = Math.max(...Object.values(traitScores), 1);
  
  const sortedTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Your Trait Profile</h3>
      
      <div className="space-y-5">
        {sortedTraits.map(([trait, score], index) => {
          const traitInfo = traitDescriptions[trait];
          if (!traitInfo) return null;
          
          const Icon = iconMap[traitInfo.icon];
          const percentage = Math.round((score / maxScore) * 100);
          
          return (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    {Icon && <Icon className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">{traitInfo.name}</span>
                    <p className="text-xs text-slate-500 hidden md:block">{traitInfo.description}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-600">{percentage}%</span>
              </div>
              
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden ml-12">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}