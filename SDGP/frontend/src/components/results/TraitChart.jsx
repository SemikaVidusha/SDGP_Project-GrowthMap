import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Cpu, Users, Crown, Zap, Shield, Heart, Star, Search } from 'lucide-react';

const traitDescriptions = {
  logic: { name: 'Logical Thinking', description: 'Analytical problem solving', icon: 'Brain' },
  creativity: { name: 'Creative Thinking', description: 'Innovation and ideas', icon: 'Lightbulb' },
  technical: { name: 'Technical Aptitude', description: 'Technology understanding', icon: 'Cpu' },
  empathy: { name: 'Empathy', description: 'Understanding others', icon: 'Heart' },
  leadership: { name: 'Leadership', description: 'Team guidance', icon: 'Crown' },
  social: { name: 'Social Skills', description: 'Communication abilities', icon: 'Users' },
  discipline: { name: 'Discipline', description: 'Consistency and focus', icon: 'Shield' },
  adaptability: { name: 'Adaptability', description: 'Flexibility to change', icon: 'Zap' },
  focus: { name: 'Focus', description: 'Concentration power', icon: 'Search' },
  risk: { name: 'Risk Taking', description: 'Comfort with uncertainty', icon: 'Star' }
};

const iconMap = {
  Brain, Lightbulb, Cpu, Users, Crown, Zap, Shield, Heart, Star, Search
};

export default function TraitChart({ traitScores }) {
  const maxScore = Math.max(...Object.values(traitScores), 1);
  
  const sortedTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Your Trait Profile</h3>
      
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
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:to-slate-950 flex items-center justify-center">
                    {Icon && <Icon className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{traitInfo.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">{traitInfo.description}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-600">{percentage}%</span>
              </div>
              
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-12">
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