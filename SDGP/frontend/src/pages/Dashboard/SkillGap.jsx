import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserInputForm from "../../components/skillgap/UserInputForm";
import GapAnalysisResult from "../../components/skillgap/GapAnalysisResult";
import { analyzeSkillGap } from "../../components/skillgap/GapEngine";




export default function SkillGap() {
  const [step, setStep] = useState('input'); // 'input' | 'result'
  const [analysisResult, setAnalysisResult] = useState(null);
  const handleAnalyze = (formData) => {
  const result = analyzeSkillGap(formData);
  console.log("ANALYSIS RESULT:", result);
  setAnalysisResult(result);
  setStep('result');
  };

  

  const handleReset = () => {
    setAnalysisResult(null);
    setStep('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse inline-block" />
              AI-Powered Analysis
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Skill Gap Analyzer</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Discover exactly what skills you need to reach your dream ICT career — and get a personalized roadmap to get there.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          {['input', 'result'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === s || (s === 'result' && step === 'result') ? 'text-purple-700' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === s ? 'bg-purple-600 text-white' : s === 'result' && step === 'result' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {i + 1}
                </div>
                <span className="hidden sm:inline">{s === 'input' ? 'Your Profile' : 'Gap Analysis'}</span>
              </div>
              {i < 1 && <div className={`flex-1 max-w-16 h-0.5 transition-colors ${step === 'result' ? 'bg-purple-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserInputForm onAnalyze={handleAnalyze} />
            </motion.div>
          )}
          {step === 'result' && analysisResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GapAnalysisResult result={analysisResult} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
