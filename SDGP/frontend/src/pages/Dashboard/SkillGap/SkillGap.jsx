import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, PolarRadiusAxis 
} from 'recharts';
import { 
  Target, AlertCircle, CheckCircle2, 
  Lightbulb, Download 
} from 'lucide-react';
import { downloadPDF } from '../../utils/generatePDF';

const SkillGap = () => {
  // Sample data - backend eken ena data anuwa meka update karanna puluwan
  const skillData = [
    { subject: 'React', current: 70, target: 90, fullMark: 100 },
    { subject: 'Node.js', current: 50, target: 85, fullMark: 100 },
    { subject: 'MongoDB', current: 40, target: 80, fullMark: 100 },
    { subject: 'UI Design', current: 75, target: 90, fullMark: 100 },
    { subject: 'Express', current: 30, target: 80, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Section with PDF Button */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">Skill Gap Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Compare your current skills with your target career goal.</p>
        </div>
        
        <button 
          onClick={() => downloadPDF('report-content')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 font-bold"
        >
          <Download size={20} /> Download PDF Report
        </button>
      </header>

      {/* PDF Capture Area Starts Here */}
      <div id="report-content" className="space-y-8 p-2">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. Radar Chart Section */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-3xl p-6"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <Target className="text-blue-500" /> Proficiency Radar
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 'bold' }} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Current
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> Target
              </div>
            </div>
          </motion.div>

          {/* 2. Gap Breakdown Section */}
          <div className="space-y-6">
            <motion.div className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Detailed Breakdown</h3>
              <div className="space-y-6">
                {skillData.map((skill, index) => {
                  const gap = skill.target - skill.current;
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{skill.subject}</span>
                        <span className="text-sm font-bold text-blue-500">{skill.current}% / {skill.target}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.current}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        />
                      </div>
                      {gap > 20 && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} /> Priority: High Gap ({gap}%)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. AI Insights / Recommendations Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 shadow-2xl rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <Lightbulb className="text-amber-500" /> Learning Roadmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/30 backdrop-blur-sm">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Short Term</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">Focus on **Node.js** and **Express**. You have a 30% gap here.</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/30 backdrop-blur-sm">
              <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Resources</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">Check out MongoDB University and FreeCodeCamp React courses.</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/30 backdrop-blur-sm">
              <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">Status</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" /> UI Design skills are near target!
              </p>
            </div>
          </div>
        </motion.div>

      </div>
      {/* PDF Capture Area Ends Here */}
      
    </motion.div>
  );
};

export default SkillGap;