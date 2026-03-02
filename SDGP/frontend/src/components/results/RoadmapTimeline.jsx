import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, BookOpen, Award, Briefcase,
  ChevronDown, ChevronUp, Clock, CheckCircle2
} from 'lucide-react';

const levelIcons = {
  "Foundation": GraduationCap,
  "NVQ Level 3-4": Award,
  "NVQ Level 4": Award,
  "NVQ Level 5": Award,
  "NVQ Level 5-6": Award,
  "NVQ Level 6": Award,
  "Degree": BookOpen,
  "Degree/HND": BookOpen,
  "Professional": Briefcase
};

const levelColors = {
  "Foundation": "from-slate-500 to-slate-600",
  "NVQ Level 3-4": "from-blue-500 to-blue-600",
  "NVQ Level 4": "from-blue-500 to-blue-600",
  "NVQ Level 5": "from-indigo-500 to-indigo-600",
  "NVQ Level 5-6": "from-indigo-500 to-indigo-600",
  "NVQ Level 6": "from-violet-500 to-violet-600",
  "Degree": "from-purple-500 to-purple-600",
  "Degree/HND": "from-purple-500 to-purple-600",
  "Professional": "from-amber-500 to-orange-500"
};

export default function RoadmapTimeline({ roadmap, careerTitle }) {
  const [expandedStage, setExpandedStage] = useState(-1);

  if (!roadmap || !roadmap.stages) {
    return (
      <div className="text-center py-8 text-slate-500">
        Roadmap information not available for this career.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500" />

      <div className="space-y-6">
        {roadmap.stages.map((stage, index) => {
          const Icon = levelIcons[stage.level] || GraduationCap;
          const colorClass = levelColors[stage.level] || "from-slate-500 to-slate-600";
          const isExpanded = expandedStage === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative pl-16 md:pl-20"
            >
              <div className={`absolute left-3 md:left-5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg z-10`}>
                <Icon className="w-4 h-4 text-white" />
              </div>

              <div className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-purple-200 shadow-lg' : 'border-slate-100 shadow-sm'}`}>
                <button
                  onClick={() => setExpandedStage(isExpanded ? -1 : index)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`bg-gradient-to-r ${colorClass} text-white text-xs`}>
                          {stage.level || "Stage"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{stage.duration || ""}</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800">{stage.title || stage.level}</h4>
                      <p className="text-sm text-slate-600 mt-1">{stage.description || ""}</p>
                    </div>
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                        {/* Requirements */}
                        {stage.requirements && stage.requirements.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Requirements</h5>
                            <div className="flex flex-wrap gap-2">
                              {stage.requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {stage.skills && stage.skills.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Skills</h5>
                            <div className="flex flex-wrap gap-2">
                              {stage.skills.map((s, i) => (
                                <div key={i} className="text-sm text-slate-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tools */}
                        {stage.tools && stage.tools.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Tools</h5>
                            <div className="flex flex-wrap gap-2">
                              {stage.tools.map((t, i) => (
                                <div key={i} className="text-sm text-slate-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                                  {t}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {stage.projects && stage.projects.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Projects</h5>
                            <div className="space-y-2">
                              {stage.projects.map((p, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                                  {p}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Qualifications */}
                        {stage.qualifications && stage.qualifications.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Qualifications</h5>
                            <div className="flex flex-wrap gap-2">
                              {stage.qualifications.map((q, i) => (
                                <div key={i} className="text-sm text-slate-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                                  {q}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Milestone */}
                        {stage.milestone && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Milestone</h5>
                            <p className="text-sm text-slate-600">{stage.milestone}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}