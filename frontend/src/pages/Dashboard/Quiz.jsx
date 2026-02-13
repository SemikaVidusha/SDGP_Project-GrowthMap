import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { base44 } from '@/api/base44Client';
import { quizQuestions, careers } from '../components/quiz/QuizData';
import QuestionCard from '../components/quiz/QuestionCard';
import { ArrowLeft, ArrowRight, MapPin, Loader2 } from 'lucide-react';

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleSelectOption = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const calculateTraitScores = () => {
    const traits = {
      logical: 0,
      creativity: 0,
      systems: 0,
      collaboration: 0,
      detail: 0
    };

    Object.entries(answers).forEach(([questionIndex, optionIndex]) => {
      const question = quizQuestions[parseInt(questionIndex)];
      const selectedOption = question.options[optionIndex];
      
      Object.entries(selectedOption.traits).forEach(([trait, score]) => {
        traits[trait] = (traits[trait] || 0) + score;
      });
    });

    return traits;
  };

  const calculateCareerMatches = (traitScores) => {
    const maxScore = Math.max(...Object.values(traitScores), 1);
    const normalizedTraits = {};
    
    Object.entries(traitScores).forEach(([trait, score]) => {
      normalizedTraits[trait] = score / maxScore;
    });

    const careerScores = careers.map(career => {
      let matchScore = 0;
      let totalWeight = 0;

      Object.entries(career.traits).forEach(([trait, weight]) => {
        const userTrait = normalizedTraits[trait] || 0;
        matchScore += userTrait * weight;
        totalWeight += weight;
      });

      const normalizedMatch = totalWeight > 0 ? (matchScore / totalWeight) * 100 : 0;
      
      return {
        ...career,
        matchScore: Math.round(normalizedMatch)
      };
    });

    return careerScores.sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const traitScores = calculateTraitScores();
    const careerMatches = calculateCareerMatches(traitScores);

    // Save to database
    try {
      await base44.entities.QuizResponse.create({
        session_id: sessionId,
        answers: Object.entries(answers).map(([qIndex, optIndex]) => ({
          question_id: parseInt(qIndex),
          selected_option: optIndex
        })),
        trait_scores: traitScores,
        recommended_careers: careerMatches.slice(0, 5).map(c => ({
          id: c.id,
          title: c.title,
          matchScore: c.matchScore
        })),
        completed_at: new Date().toISOString()
      });
    } catch (error) {
      console.log('Error saving quiz response:', error);
    }

    // Store results in sessionStorage for results page
    sessionStorage.setItem('quizResults', JSON.stringify({
      traitScores,
      careerMatches,
      sessionId
    }));

    navigate(createPageUrl('Results'));
  };

  const isCurrentAnswered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === quizQuestions.length;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(createPageUrl('Home'))}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">GrowthMap</span>
          </button>
          <div className="text-sm text-slate-500">
            {Object.keys(answers).length} of {quizQuestions.length} answered
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10"
        >
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion}
              question={quizQuestions[currentQuestion]}
              selectedOption={answers[currentQuestion]}
              onSelect={handleSelectOption}
              questionNumber={currentQuestion + 1}
              totalQuestions={quizQuestions.length}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    See Results
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Question dots navigation */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {quizQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestion
                  ? 'bg-purple-600 scale-125'
                  : answers[index] !== undefined
                    ? 'bg-purple-300'
                    : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}