import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TraitChart from "../../components/results/TraitChart";
import CareerCard from "../../components/results/CareerCard";
import ExplainabilityPanel from "../../components/results/ExplainabilityPanel";
import { RefreshCw, Sparkles } from "lucide-react";

/*
 Results.jsx:
 - tries to read navigation state first (preferred)
 - falls back to legacy localStorage.assessmentResult (support legacy)
 - fetches career metadata (GET /api/careers) to fill titles/descriptions
 - renders using TraitChart, CareerCard, ExplainabilityPanel
*/

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [careersMeta, setCareersMeta] = useState([]);

  useEffect(() => {
    // fetch careers metadata (best-effort)
    fetch("http://127.0.0.1:5000/api/careers")
      .then(r => {
        if (!r.ok) throw new Error("No careers metadata");
        return r.json();
      })
      .then(data => setCareersMeta(data))
      .catch(() => setCareersMeta([]));
  }, []);

  useEffect(() => {
    // Primary: react-router state
    if (location.state && location.state.careerMatches) {
      setResults(location.state);
      return;
    }

    // Fallback: legacy localStorage key saved by quiz.js
    const raw = localStorage.getItem("assessmentResult");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        // parsed has: bestCareer, topCareers [{career,score}], traits, rawTraits...
        const careerMatches = (parsed.topCareers || []).map(tc => {
          const meta = (careersMeta || []).find(c => c.id === tc.career);
          return {
            id: tc.career,
            title: meta?.name || tc.career.replace(/_/g, " "),
            description: meta?.description || "",
            matchScore: Math.round((tc.score || 0) * 100),
            rawScore: tc.score
          };
        });

        const normalizedTraitScores = parsed.traits || parsed.normalizedTraits || {};
        const reactResult = {
          traitScores: normalizedTraitScores,
          careerMatches,
          rawPrediction: parsed
        };
        setResults(reactResult);
        return;
      } catch (e) {
        console.error("Failed parse legacy assessmentResult:", e);
      }
    }

    // if nothing, redirect to /quiz
    navigate("/quiz");
  // note: careersMeta may update after we run fallback; ensure re-run when careersMeta arrives
  }, [location, navigate, careersMeta]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-600">Loading results...</div>
      </div>
    );
  }

  const { traitScores, careerMatches } = results;
  const topCareer = careerMatches && careerMatches.length ? careerMatches[0] : { id: "", title: "Unknown", description: "", matchScore: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">

      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <h2 className="font-bold text-purple-600">GrowthMap</h2>
          <Link to="/quiz">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Assessment Complete
          </div>
          <h1 className="text-3xl font-bold">Your Career Recommendations</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <TraitChart traitScores={traitScores} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold">{topCareer.title}</h2>
              <p className="text-blue-100">{topCareer.description}</p>
              <div className="text-4xl font-bold mt-4">{topCareer.matchScore}%</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {careerMatches.slice(1, 5).map((career, index) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  matchScore={career.matchScore}
                  rank={index + 1}
                />
              ))}
            </div>

            <div className="mt-8">
              <ExplainabilityPanel career={topCareer} traitScores={traitScores} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}