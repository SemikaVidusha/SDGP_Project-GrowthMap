import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, Network, Palette, BarChart3, Shield, Globe, 
  Database, Users, CheckCircle, Smartphone, ChevronRight,
  TrendingUp, Briefcase
} from 'lucide-react';

const iconMap = {
  Code: Code,
  Network: Network,
  Palette: Palette,
  BarChart3: BarChart3,
  Shield: Shield,
  Globe: Globe,
  Database: Database,
  Users: Users,
  CheckCircle: CheckCircle,
  Smartphone: Smartphone
};

export default function CareerCard({ career, matchScore, rank, onClick }) {
  const Icon = iconMap[career.icon] || Briefcase;
  
  const demandColors = {
    "Very High": "bg-green-100 text-green-700",
    "High": "bg-blue-100 text-blue-700",
    "Medium": "bg-amber-100 text-amber-700"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-purple-200 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {rank <= 2 && (
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-0.5">
                  #{rank + 1} Match
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{career.title}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {matchScore}%
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">match</span>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
        {career.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {career.skills.slice(0, 3).map((skill, i) => (
          <Badge key={i} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">
            {skill}
          </Badge>
        ))}
        {career.skills.length > 3 && (
          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            +{career.skills.length - 3} more
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <Badge className={`${demandColors[career.demand]} text-xs`}>
              {career.demand} Demand
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 gap-1">
          View Roadmap
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Salary Range: {career.salary}
      </div>
    </motion.div>
  );
}