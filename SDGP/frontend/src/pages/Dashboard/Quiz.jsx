import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const FEATURE_ORDER = [
  "logic","creativity","leadership","empathy","discipline",
  "social","technical","risk","focus","adaptability"
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
    // guard
    if (!questions || questions.length === 0) return;

    // update traits
    setTraits(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, option.trait)) {
        console.warn("Unknown trait:", option.trait);
        return prev;
      }
      return { ...prev, [option.trait]: prev[option.trait] + option.value };
    });

    // log answer
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

    // next
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    // compute normalized traits with same logic
    const normalized = normalizeTraits(traits, questions);

    // call backend ML endpoint
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

      const prediction = await response.json();

      // construct legacy-style assessmentResult so old HTML pages continue to work
      const resultData = {
        bestCareer: prediction.bestCareer,
        topCareers: prediction.topCareers, // expected [{ career, score }, ...]
        traits: normalized,
        rawTraits: traits,
        answers: answersLog,
        totalQuestions: questions.length,
        createdAt: new Date().toISOString()
      };

      // save legacy key
      localStorage.setItem("assessmentResult", JSON.stringify(resultData));
      // append history
      const history = JSON.parse(localStorage.getItem("assessmentHistory") || "[]");
      history.push(resultData);
      localStorage.setItem("assessmentHistory", JSON.stringify(history));

      // navigate to React results page, pass ML data in location.state
      // build a friendly structure for the Results page: traitScores & careerMatches
      // tc.score is already a percentage (0-100) from the backend
      const careerMatches = (prediction.topCareers || []).map(tc => ({
        id: tc.career,
        title: tc.career.replace(/_/g, " "),
        description: "",
        matchScore: Math.round(tc.score || 0),
        rawScore: tc.score
      }));

      const reactResult = {
        traitScores: normalized,
        careerMatches,
        rawPrediction: prediction
      };

      navigate("/results", { state: reactResult });

    } catch (err) {
      console.error("ML Prediction Error:", err);
      alert("Prediction server is not responding. Please try again.");
    }
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
        <div className="mb-2 text-sm text-slate-600">
          Question {currentIndex + 1} / {questions.length}
        </div>

        <div className="mb-6">
          <div className="text-lg font-semibold mb-3">{currentQuestion.question}</div>
          <div className="grid gap-3">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectOption(opt)}
                className="p-3 border rounded hover:bg-slate-50 text-left"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Your progress will be saved locally.</div>
          <div>
            <Button onClick={finishQuiz} className="ml-2">Finish Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}