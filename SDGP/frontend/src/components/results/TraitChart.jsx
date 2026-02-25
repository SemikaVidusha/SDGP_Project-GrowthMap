import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Cpu, Users, Search } from 'lucide-react';

const traitDescriptions = {
  logic: "Ability to analyze problems systematically and think in structured steps.",
  creativity: "Capacity for innovative thinking, design sense, and originality.",
  leadership: "Skill in guiding teams, decision-making, and motivating others.",
  empathy: "Understanding emotions, supporting others, and emotional intelligence.",
  discipline: "Consistency, self-control, and responsibility in work.",
  social: "Communication skills, teamwork, and interpersonal ability.",
  technical: "Interest and skill in technology, systems, and computing.",
  risk: "Willingness to try new things and take calculated risks.",
  focus: "Ability to concentrate deeply and avoid distractions.",
  adaptability: "Flexibility and ability to adjust to change."
};

const iconMap = {
  logic: Brain,
  creativity: Lightbulb,
  technical: Cpu,
  social: Users,
  focus: Search
};

export default function TraitChart({ traitScores }) {
  const maxScore = Math.max(...Object.values(traitScores), 1);

  const sortedTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Your Trait Profile
      </h3>

      <div className="space-y-5">
        {sortedTraits.map(([trait, score], index) => {
          const Icon = iconMap[trait];
          const percentage = Math.round((score / maxScore) * 100);

          return (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    {Icon && <Icon className="w-5 h-5 text-purple-600" />}
                  </div>

                  <div>
                    <span className="font-medium text-slate-700 capitalize">
                      {trait}
                    </span>
                    <p className="text-xs text-slate-500 hidden md:block">
                      {traitDescriptions[trait]}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-purple-600">
                  {percentage}%
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden ml-12">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}