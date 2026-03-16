import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TraitChart from "../../components/results/TraitChart";
import CareerCard from "../../components/results/CareerCard";
import ExplainabilityPanel from "../../components/results/ExplainabilityPanel";
import { RefreshCw, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const [rawResult, setRawResult] = useState(null);
  const [careersMeta, setCareersMeta] = useState([]);
  const [careerMatches, setCareerMatches] = useState([]);
  const [traitScores, setTraitScores] = useState({});

  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  // fetch career metadata
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/careers")
      .then(r => r.json())
      .then(setCareersMeta)
      .catch(() => setCareersMeta([]));
  }, []);

  // get prediction results
  useEffect(() => {
    if (location?.state?.rawPrediction) {
      setRawResult(location.state.rawPrediction);
      setTraitScores(location.state.traitScores || {});
      return;
    }

    const raw = localStorage.getItem("assessmentResult");
    if (raw) {
      const parsed = JSON.parse(raw);
      setRawResult(parsed);
      setTraitScores(parsed.traits || parsed.normalizedTraits || {});
      return;
    }

    navigate("/quiz");
  }, [location, navigate]);

  // merge ML result with MongoDB metadata
  useEffect(() => {
    if (!rawResult || !careersMeta.length) return;

    const merged = rawResult.topCareers.map(tc => {
      const meta = careersMeta.find(c => c.careerId === tc.career || c.id === tc.career);

      return {
        id: tc.career,
        title: meta?.name || tc.career.replace(/_/g, " "),
        description: meta?.description || "",
        skills: meta?.skills || [],
        demand: meta?.demand || "Medium",
        salary: meta?.salary || "Varies",
        traits: meta?.traits || {},
        matchScore: Math.round(tc.score),
        rawScore: tc.score
      };
    });

    const sorted = [...merged].sort((a, b) => b.rawScore - a.rawScore);

    setCareerMatches(sorted);
  }, [rawResult, careersMeta]);

  // fetch roadmap (kept as optional modal fallback)
  useEffect(() => {
    if (!selectedCareer?.id) return;

    fetch(`http://127.0.0.1:5000/api/roadmaps/${selectedCareer.id}`)
      .then(r => {
        if (!r.ok) throw new Error("Roadmap not found");
        return r.json();
      })
      .then(setRoadmap)
      .catch(() => setRoadmap(null));
  }, [selectedCareer]);

  if (!rawResult || !careerMatches.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-600">Loading results...</div>
      </div>
    );
  }

  const topCareer = careerMatches[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <h2 className="font-bold text-purple-600">GrowthMap</h2>
          <Link to="/quiz">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Retake Quiz
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Assessment Complete
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
              <div className="flex items-center justify-between mt-4">
                <div className="text-4xl font-bold">{topCareer.matchScore}%</div>
                <div>
                  <Button
                    onClick={() => navigate(`/roadmap/${topCareer.id}`)}
                    className="bg-white text-purple-700 hover:bg-blue-50"
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {careerMatches.slice(1, 5).map((career, index) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  matchScore={career.matchScore}
                  rank={index + 1}
                  onClick={() => navigate(`/roadmap/${career.id}`)}
                />
              ))}
            </div>

            <ExplainabilityPanel career={topCareer} traitScores={traitScores} />
          </div>
        </div>
      </main>

      {/* Legacy modal kept as fallback (optional) */}
      <Dialog open={showRoadmap} onOpenChange={setShowRoadmap}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="roadmap-modal-desc">
          <DialogHeader>
            <DialogTitle>{selectedCareer?.title} Roadmap</DialogTitle>
          </DialogHeader>

          {roadmap ? (
            <div className="space-y-4 px-4 pb-6 ">
              {(roadmap.stages || []).map((s, i) => (
                <div key={i} className="p-4 border rounded">
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="text-sm">{s.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">Roadmap not available.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}