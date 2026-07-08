import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "@/components/ui/progress-indicator"

// Feature order must match backend exactly
const FEATURE_ORDER = [
  "logic", "creativity", "technical", "empathy",
  "leadership", "social", "discipline", "adaptability",
  "focus", "risk"
];

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [traits, setTraits] = useState({
    logic: 0, creativity: 0, leadership: 0, empathy: 0,
    discipline: 0, social: 0, technical: 0, risk: 0,
    focus: 0, adaptability: 0
  });
  const [answersLog, setAnswersLog] = useState([]);
  const [participantImageLoading, setParticipantImageLoading] = useState(true);
  const participantImageRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Timer state: 30 seconds per question
  const TIMER_SECONDS = 30;
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);
  const quizFinishedRef = useRef(false);

  // Handle image loading state
  useEffect(() => {
    const img = participantImageRef.current;
    if (!img) return;
    if (img.complete && img.naturalHeight > 0) {
      setParticipantImageLoading(false);
      return;
    }
    const timeout = setTimeout(() => {
      setParticipantImageLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Countdown timer — resets on each question change
  useEffect(() => {
    if (loading || questions.length === 0) return;
    setTimeLeft(TIMER_SECONDS);
    clearInterval(timerRef.current);
    if (quizFinishedRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-skip: advance without trait update
          setCurrentIndex(ci => {
            const next = ci + 1;
            if (next < questions.length) return next;
            quizFinishedRef.current = true;
            return ci;
          });
          return TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading, questions.length]);

  useEffect(() => {
    // load questions from public/data/questions.json
    async function load() {
      try {
        const res = await fetch("/data/questions.json");
        if (!res.ok) throw new Error("questions.json not found");
        const qs = await res.json();
        setQuestions(qs);
      } catch (e) {
        console.error("Failed to load quiz questions:", e);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // legacy normalizeTraits implementation ported
  function normalizeTraits(rawTraits, questionsList) {
    const maxScores = {};
    questionsList.forEach(q => {
      q.options.forEach(opt => {
        if (!maxScores[opt.trait] || opt.value > maxScores[opt.trait]) {
          maxScores[opt.trait] = opt.value;
        }
      });
    });

    const normalized = {};
    Object.keys(rawTraits).forEach(trait => {
      const max = (maxScores[trait] || 1) * questionsList.length;
      normalized[trait] = max === 0 ? 0 : rawTraits[trait] / max;
    });

    // ensure every feature in FEATURE_ORDER present
    FEATURE_ORDER.forEach(f => {
      if (normalized[f] === undefined) normalized[f] = 0;
    });

    return normalized;
  }

const selectOption = (option) => {
  setSelectedOption(option);
};

  const goNext = () => {
  if (!selectedOption) return;
  clearInterval(timerRef.current);
  const option = selectedOption;
  setTraits(prev => ({
    ...prev,
    [option.trait]: prev[option.trait] + option.value
  }));
  const q = questions[currentIndex];
  setAnswersLog(prev => ([
    ...prev,
    {
      questionId: q.id,
      question: q.question,
      selected: option.text,
      trait: option.trait,
      value: option.value
    }
  ]));
  setSelectedOption(null);
  const next = currentIndex + 1;
  if (next < questions.length) {
    setCurrentIndex(next);
  } else {
    finishQuiz();
  }
};

const goBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};

  const finishQuiz = async () => {
    // compute normalized traits with same logic
    const normalized = normalizeTraits(traits, questions);

    // Mock data for fallback - available in both paths
    const mockPrediction = {
      bestCareer: "software_engineer",
      topCareers: [
        { career: "software_engineer", score: 0.92 },
        { career: "frontend_developer", score: 0.85 },
        { career: "fullstack_developer", score: 0.78 },
        { career: "data_scientist", score: 0.71 },
        { career: "ai_ml_engineer", score: 0.65 }
      ]
    };

    let prediction = mockPrediction;

    // Try backend first
    try {
      const response = await fetch("http://127.0.0.1:5000/api/ml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traits: normalized })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Prediction failed (${response.status}): ${text}`);
      }

      prediction = await response.json();
      console.log("Real ML prediction used");

    } catch (err) {
      console.error("ML Prediction Error:", err);
      console.warn("Using mock prediction data");
    }



// Now always save and navigate
    const resultData = {
      bestCareer: prediction.bestCareer,
      topCareers: prediction.topCareers,
      traits: normalized,
      rawTraits: traits,
      answers: answersLog,
      totalQuestions: questions.length,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("assessmentResult", JSON.stringify(resultData));
    const history = JSON.parse(localStorage.getItem("assessmentHistory") || "[]");
    history.push(resultData);
    localStorage.setItem("assessmentHistory", JSON.stringify(history));

    const careerMatches = (prediction.topCareers || []).map(tc => ({
      id: tc.career,
      title: tc.career.replace(/_/g, " "),
      description: "",
      matchScore: Math.round((tc.score || 0) * 100),
      rawScore: tc.score
    }));

    const reactResult = {
      traitScores: normalized,
      careerMatches,
      rawPrediction: prediction,
      isMock: prediction === mockPrediction
    };

    navigate("/results", { state: reactResult });
  };




  // UI helpers
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading quiz...</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No quiz questions found. Put questions.json into public/data/</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Career Assessment</h2>
        <ProgressIndicator
          current={currentIndex + 1}
          total={questions.length}
        />

        {/* Timer Bar */}
        <div className="mt-3 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Time remaining</span>
            <span className={`font-semibold tabular-nums ${
              timeLeft <= 10 ? 'text-red-500' : 'text-slate-600'
            }`}>{timeLeft}s</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft <= 10
                  ? 'bg-gradient-to-r from-red-500 to-rose-400'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-lg font-semibold mb-3">{currentQuestion.question}</div>
          <div className="grid gap-3">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectOption(opt)}
                className={`p-4 border rounded-lg text-left transition transform
                          ${selectedOption === opt
                            ? "border-purple-500 bg-purple-50"
                            : "hover:bg-slate-50 hover:-translate-y-0.5"
                          }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500">
            Your progress will be saved locally.
          </div>

          <div className="flex gap-2">

            {currentIndex > 0 && (
              <Button variant="outline" onClick={goBack}>
                Back
              </Button>
            )}

            {currentIndex < questions.length - 1 ? (
              <Button className="h-full bg-gradient-to-r from-blue-500 to-purple-500" onClick={goNext} disabled={!selectedOption}>
                Next
              </Button>
            ) : (
              <Button className="h-full bg-gradient-to-r from-blue-500 to-purple-500" onClick={goNext} disabled={!selectedOption}>
                Finish
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Example for Quiz Page submission
const submitQuiz = async (quizData) => {
    const response = await fetch('http://localhost:5000/api/skills/quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') 
        },
        body: JSON.stringify({ score: 85, category: 'Technical' })
    });
    const data = await response.json();
    console.log("Results Saved:", data);
}