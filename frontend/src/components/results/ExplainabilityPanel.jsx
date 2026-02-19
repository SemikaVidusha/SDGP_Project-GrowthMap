import React from 'react';
import { motion } from 'framer-motion';
//import { traitDescriptions } from '../quiz/QuizData';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ExplainabilityPanel({ career, traitScores }) {
  // Calculate how well user's traits match career requirements
  const getTraitMatch = () => {
    const careerTraits = career.traits;
    const matches = [];
    
    const maxUserScore = Math.max(...Object.values(traitScores), 1);
    
    Object.entries(careerTraits).forEach(([trait, importance]) => {
      const userScore = traitScores[trait] || 0;
      const normalizedUser = userScore / maxUserScore;
      const match = Math.min(normalizedUser / importance, 1);
      
      matches.push({
        trait,
        importance: importance * 100,
        userStrength: normalizedUser * 100,
        matchQuality: match >= 0.7 ? 'strong' : match >= 0.4 ? 'moderate' : 'developing',
        traitInfo: traitDescriptions[trait]
      });
    });
    
    return matches.sort((a, b) => b.importance - a.importance);
  };

  const traitMatches = getTraitMatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-purple-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
          <Info className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Why This Career?</h3>
          <p className="text-sm text-slate-600">Understanding your match with {career.title}</p>
        </div>
      </div>

      <div className="space-y-4">
        {traitMatches.map((match, index) => (
          <motion.div
            key={match.trait}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {match.matchQuality === 'strong' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : match.matchQuality === 'moderate' ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-medium text-slate-700">
                  {match.traitInfo?.name || match.trait}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                match.matchQuality === 'strong' 
                  ? 'bg-green-100 text-green-700'
                  : match.matchQuality === 'moderate'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
              }`}>
                {match.matchQuality === 'strong' ? 'Strong Match' : 
                 match.matchQuality === 'moderate' ? 'Good Match' : 'Growth Area'}
              </span>
            </div>
            
            <div className="ml-7">
              <div className="flex items-center gap-4 text-sm mb-2">
                <span className="text-slate-500">Career needs:</span>
                <span className="font-medium text-purple-600">{Math.round(match.importance)}% importance</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">Your strength:</span>
                <span className="font-medium text-blue-600">{Math.round(match.userStrength)}%</span>
              </div>
              
              {match.matchQuality === 'developing' && (
                <p className="text-xs text-slate-500 mt-2 italic">
                  This is an area you can develop through education and practice.
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white/70 rounded-xl">
        <p className="text-sm text-slate-600">
          <strong className="text-slate-800">Note:</strong> These recommendations are based on your quiz responses. 
          Your actual career success depends on many factors including dedication, continuous learning, 
          and practical experience. Use this as a starting point for exploration.
        </p>
      </div>
    </motion.div>
  );
}