import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const questions = [
  { id: 1, q: "Do you have experience with React Hooks?", options: ["Beginner", "Intermediate", "Expert"] },
  { id: 2, q: "How familiar are you with RESTful APIs?", options: ["Not at all", "Somewhat", "Very Familiar"] },
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2"><span>Progress</span><span>{Math.round(((current + 1) / questions.length) * 100)}%</span></div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
             <motion.div className="bg-blue-500 h-full" animate={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-6">{questions[current].q}</h2>
            <div className="space-y-4">
              {questions[current].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => current < questions.length - 1 && setCurrent(current + 1)}
                  className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-500/10 transition-all flex justify-between items-center group"
                >
                  {opt} <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;