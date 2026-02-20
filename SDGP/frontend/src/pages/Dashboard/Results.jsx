import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
//import { careers, roadmaps } from '../components/quiz/QuizData';
import TraitChart from "../../components/results/TraitChart";
import CareerCard from '../../components/results/CareerCard';
import ExplainabilityPanel from '../../components/results/ExplainabilityPanel';
//import RoadmapTimeline from '../components/roadmap/RoadmapTimeline';
import { 
  MapPin, ArrowLeft, RefreshCw, Share2, 
  ChevronLeft, Download, Sparkles 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      navigate(createPageUrl('Quiz'));
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-600">Loading results...</div>
      </div>
    );
  }

  const { traitScores, careerMatches } = results;
  const topCareer = careerMatches[0];

  const handleCareerClick = (career) => {
    setSelectedCareer(career);
    setShowRoadmap(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">GrowthMap</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Quiz')}>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Retake Quiz</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Assessment Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Your Career Recommendations
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Based on your responses, here are the ICT careers that best match your 
            strengths and preferences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Trait Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <TraitChart traitScores={traitScores} />
          </motion.div>

          {/* Right Column - Career Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Match Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-blue-100">Best Match</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{topCareer.title}</h2>
              <p className="text-blue-100 mb-4">{topCareer.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold">{topCareer.matchScore}%</div>
                <Button 
                  onClick={() => handleCareerClick(topCareer)}
                  className="bg-white text-purple-700 hover:bg-blue-50"
                >
                  View Roadmap
                </Button>
              </div>
            </motion.div>

            {/* Other Matches */}
            <div className="grid md:grid-cols-2 gap-4">
              {careerMatches.slice(1, 5).map((career, index) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  matchScore={career.matchScore}
                  rank={index + 1}
                  onClick={() => handleCareerClick(career)}
                />
              ))}
            </div>

            {/* View All Careers */}
            <div className="text-center pt-4">
              <Link to={createPageUrl('Careers')}>
                <Button variant="outline" className="gap-2">
                  View All ICT Careers
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Explainability Section */}
        {topCareer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <ExplainabilityPanel 
              career={topCareer} 
              traitScores={traitScores}
            />
          </motion.div>
        )}
      </main>

      {/* Roadmap Modal */}
      <Dialog open={showRoadmap} onOpenChange={setShowRoadmap}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">{selectedCareer?.title}</div>
                <div className="text-sm font-normal text-slate-500">Career Roadmap for Sri Lanka</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6">
            {selectedCareer && roadmaps[selectedCareer.id] ? (
              <RoadmapTimeline 
                roadmap={roadmaps[selectedCareer.id]} 
                careerTitle={selectedCareer.title}
              />
            ) : (
              <div className="text-center py-8 text-slate-500">
                Roadmap not available for this career.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            These recommendations are based on your quiz responses and are meant to guide your exploration.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Consider talking to career counselors and professionals for personalized advice.
          </p>
        </div>
      </footer>
    </div>
  );
}