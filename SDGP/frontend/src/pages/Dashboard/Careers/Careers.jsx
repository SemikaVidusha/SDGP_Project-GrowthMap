import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Star, ArrowRight } from 'lucide-react';

const careers = [
  { id: 1, title: "Full Stack Developer", demand: "High", difficulty: "Hard", color: "from-blue-500 to-indigo-600" },
  { id: 2, title: "Data Scientist", demand: "Very High", difficulty: "Medium", color: "from-purple-500 to-pink-600" },
  { id: 3, title: "UI/UX Designer", demand: "Medium", difficulty: "Easy", color: "from-orange-400 to-red-500" },
  { id: 4, title: "Cloud Engineer", demand: "High", difficulty: "Hard", color: "from-cyan-500 to-blue-600" },
];

const Careers = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10">
      <h1 className="text-4xl font-bold mb-2">Explore Careers</h1>
      <p className="text-slate-500 mb-10">Select a career path to analyze your skill gap.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {careers.map((career) => (
          <motion.div 
            whileHover={{ y: -10 }}
            key={career.id}
            className="glass-card overflow-hidden rounded-3xl cursor-pointer group"
          >
            <div className={`h-2 bg-gradient-to-r ${career.color}`} />
            <div className="p-6">
              <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{career.title}</h3>
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs flex items-center gap-1 opacity-70"><TrendingUp size={14}/> Demand: {career.demand}</span>
                <span className="text-xs flex items-center gap-1 opacity-70"><Star size={14}/> Level: {career.difficulty}</span>
              </div>
              <button className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 group-hover:bg-blue-500 transition-colors">
                Select Path <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Careers;