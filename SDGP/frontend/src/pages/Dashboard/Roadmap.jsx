import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoadmapTimeline from "@/components/results/RoadmapTimeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Roadmap() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/roadmaps/${careerId}`);
        if (!res.ok) throw new Error("Roadmap not found");
        const data = await res.json();
        setRoadmap(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [careerId]);

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading roadmap...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 ">
      <Button
        variant="ghost "
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        {roadmap.title}
      </h1>

      <RoadmapTimeline roadmap={roadmap} />
    </div>
  );
}