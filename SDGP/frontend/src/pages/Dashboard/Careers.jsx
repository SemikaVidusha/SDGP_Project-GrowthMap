import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";

import { 
  Search, ArrowRight, TrendingUp, Briefcase,
  Code, Network, Palette, BarChart3, Shield, Globe, 
  Database, Users, CheckCircle, Smartphone, X, Bookmark, BookmarkCheck
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

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'saved'

  // Load bookmarks from localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('growthmap_bookmarks') || '[]');
    } catch { return []; }
  });

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('growthmap_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const demandColors = {
    "Very High": "bg-green-100 text-green-700",
    "High": "bg-blue-100 text-blue-700",
    "Medium": "bg-amber-100 text-amber-700"
  };

  const careers = [
    {
      id: 1,
      title: "Software Engineer",
      description: "Design and develop software applications and systems.",
      skills: ["JavaScript", "React", "Problem Solving", "APIs"],
      salary: "LKR 150,000 - 300,000",
      demand: "Very High",
      icon: "Code"
    },
    {
      id: 2,
      title: "Data Analyst",
      description: "Analyze data to help businesses make informed decisions.",
      skills: ["Python", "SQL", "Excel", "Statistics"],
      salary: "LKR 120,000 - 250,000",
      demand: "High",
      icon: "BarChart3"
    },
    {
      id: 3,
      title: "Cybersecurity Specialist",
      description: "Protect systems and networks from cyber threats.",
      skills: ["Networking", "Security", "Ethical Hacking"],
      salary: "LKR 180,000 - 350,000",
      demand: "Very High",
      icon: "Shield"
    },
    {
      id: 4,
      title: "Database Administrator",
      description: "Managing and optimizing database systems.",
      skills: ["SQL", "Oracle", "Data Modelling"],
      salary: "LKR 61,000 - 180,000",
      demand: "High",
      icon: "Database"
    },
    {
      id: 5,
      title: "Ethical Hacker",
      description: "Simulates attacks to find security vulnerabilities.",
      skills: ["Networking", "Programming", "Database Management"],
      salary: "LKR 180,000 - 300,000",
      demand: "Very High",
      icon: "Network"
    },
    {
      id: 6,
      title: "Mobile App Developer",
      description: "Specializes in creating apps for iOS and Android.",
      skills: ["Flutter", "React", "JavaScript"],
      salary: "LKR 66,000 - 300,000",
      demand: "Very High",
      icon: "Smartphone"
    }
  ];

  const filteredCareers = useMemo(() => {
    let list = careers;
    if (activeTab === 'saved') list = list.filter(c => bookmarks.includes(c.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [searchQuery, activeTab, bookmarks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-950 via-white dark:via-slate-900 to-purple-50 dark:to-slate-950">

      {/* Header */}
      <header className="bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

          <Link
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:text-slate-100 transition-colors"
          >
          </Link>

          <Link to={createPageUrl('Quiz')}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Take Assessment
            </Button>
          </Link>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Explore ICT Careers
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Discover the diverse world of ICT careers and find the path that
            matches your interests and skills.
          </p>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {['all', 'saved'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                {tab === 'all' ? 'All Careers' : `Saved (${bookmarks.length})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <Input
              placeholder="Search careers, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 rounded-xl border-slate-200 dark:border-slate-700 focus:border-purple-300 focus:ring-purple-200"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}

          </div>
        </motion.div>

        {/* Career Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredCareers.map((career, index) => {

            const Icon = iconMap[career.icon] || Briefcase;

            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all overflow-hidden group flex flex-col h-full"
              >

                {/* Card Content */}
                <div className="p-6 flex-grow">

                  <div className="flex items-start justify-between mb-4">

                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={demandColors[career.demand]}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {career.demand}
                      </Badge>
                      <button
                        onClick={() => toggleBookmark(career.id)}
                        title={bookmarks.includes(career.id) ? 'Remove bookmark' : 'Save career'}
                        className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                          bookmarks.includes(career.id)
                            ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/30'
                            : 'text-slate-400 hover:text-purple-500 hover:bg-purple-50'
                        }`}
                      >
                        {bookmarks.includes(career.id)
                          ? <BookmarkCheck className="w-4 h-4" />
                          : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {career.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {career.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {career.skills.slice(0, 3).map((skill, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}

                    {career.skills.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs"
                      >
                        +{career.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      Salary:
                    </span>{" "}
                    {career.salary}
                  </div>

                </div>

                {/* Button */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto">

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                  >
                    View Career Roadmap
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-16">

            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              {activeTab === 'saved'
                ? <Bookmark className="w-8 h-8 text-purple-400" />
                : <Search className="w-8 h-8 text-slate-400" />}
            </div>

            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              {activeTab === 'saved' ? 'No saved careers yet' : 'No careers found'}
            </h3>

            <p className="text-slate-500 dark:text-slate-400">
              {activeTab === 'saved'
                ? 'Click the bookmark icon on any career card to save it here.'
                : 'Try adjusting your search terms'}
            </p>

          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Not sure which career fits you?
          </h2>

          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Take our smart assessment quiz to discover which ICT career matches
            your unique strengths and preferences.
          </p>

          <Link to={createPageUrl('Quiz')}>
            <Button
              size="lg"
              className="bg-white dark:bg-slate-900 text-purple-700 hover:bg-blue-50"
            >
              Start Career Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

        </motion.div>

      </main>

    </div>
  );
}