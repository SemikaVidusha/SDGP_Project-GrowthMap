import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { 
  Compass, MapPin, BookOpen, ArrowRight, 
  Sparkles, Target, Users, Brain,
  Code, Shield, Palette, BarChart3
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "Smart Assessment",
      description: "20 carefully crafted questions that analyze your thinking style and preferences"
    },
    {
      icon: Target,
      title: "Personalized Matches",
      description: "Get matched with ICT careers that align with your unique strengths"
    },
    {
      icon: MapPin,
      title: "Sri Lankan Pathway",
      description: "Step-by-step roadmaps aligned with NVQ levels and local institutions"
    },
    {
      icon: BookOpen,
      title: "Learning Resources",
      description: "Curated courses and certifications for each stage of your journey"
    }
  ];

  const careers = [
    { icon: Code, name: "Software Engineer", color: "from-blue-500 to-cyan-500" },
    { icon: Shield, name: "Cybersecurity", color: "from-green-500 to-emerald-500" },
    { icon: Palette, name: "UI/UX Designer", color: "from-purple-500 to-pink-500" },
    { icon: BarChart3, name: "Data Analyst", color: "from-orange-500 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-950 via-white dark:via-slate-900 to-purple-50 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Discover Your ICT Future
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Your Personalized
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Career Roadmap
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Take our smart assessment quiz and discover the perfect ICT career path for you, 
                with step-by-step guidance aligned with Sri Lankan education pathways.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={createPageUrl("Quiz")}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-200 w-full sm:w-auto">
                    Start Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Careers")}>
                  <Button variant="outline" size="lg" className="border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 px-8 py-6 text-lg rounded-xl w-full sm:w-auto">
                    <Compass className="mr-2 w-5 h-5" />
                    Explore Careers
                  </Button>
                </Link>
                <Link to={createPageUrl("SkillGap")}>
                  <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg rounded-xl w-full sm:w-auto">
                    <Target className="mr-2 w-5 h-5" />
                    Skill Gap Analyzer
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  20 Questions
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  10 ICT Careers
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Free to Use
                </div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Floating cards */}
                <div className="absolute -left-4 top-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Software Engineer</div>
                      <div className="text-xs text-green-600">92% Match</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-32 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">UI/UX Designer</div>
                      <div className="text-xs text-blue-600">85% Match</div>
                    </div>
                  </div>
                </div>

                {/* Main illustration */}
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">GrowthMap</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Your ICT Career Navigator</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How GrowthMap Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our intelligent platform analyzes your strengths and guides you towards 
              the perfect ICT career with a customized learning path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 dark:from-slate-950 to-purple-50 dark:to-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Preview Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ICT Careers You Can Explore
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Discover which path aligns with your unique skills and interests
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {careers.map((career, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${career.color} flex items-center justify-center mb-4`}>
                  <career.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{career.name}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Careers")}>
              <Button variant="outline" size="lg" className="border-2">
                View All 10 Careers
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Path?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                Take our 5-minute assessment and discover your ideal ICT career 
                with a personalized roadmap for success.
              </p>
              <Link to={createPageUrl("Quiz")}>
                <Button size="lg" className="bg-white dark:bg-slate-900 text-purple-700 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl">
                  Start Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}