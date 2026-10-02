// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Briefcase,
  Target,
  Code2,
  Mic,
  Award,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Building2,
  Zap,
  ShieldCheck
} from 'lucide-react';

/**
 * Landing Page Component (Home)
 * High-converting presentation for Career Copilot:
 * - Highlights free career preparation tailored for the Indian tech ecosystem
 * - Prominent Sign-up CTA buttons throughout
 * - Interactive Google Sign-up mockup button in hero section
 * - Comprehensive breakdown of core prep tools (ATS Resume, Job Kanban, DSA Tracker, Mock Interview)
 */
export const Home = () => {
  const { isAuthenticated } = useAuth();

  // Core platform tools
  const features = [
    {
      title: 'Indian Tech ATS Resume Scorer',
      desc: 'Parse PDF resumes, test keyword coverage for Indian startups & MNCs, and receive instant actionable recommendations.',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      title: 'Job Application Kanban Pipeline',
      desc: 'Track jobs across Bangalore, Hyderabad, Gurugram, and Pune through OA, Technical Rounds, and Offer stages.',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      title: 'Role Skill-Gap Matrix',
      desc: 'Benchmark your verified competencies against 20+ in-demand roles with curated Indian developer study roadmaps.',
      icon: Target,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Algorithmic DSA Practice Tracker',
      desc: 'Log solved LeetCode and Striver DSA sheet problems, analyze weak topics, and track problem-solving velocity.',
      icon: Code2,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
      title: 'Simulated Technical Mock Interviews',
      desc: 'Timed practice sessions covering backend architecture, system design, and behavioral STAR frameworks.',
      icon: Mic,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      title: 'Unified 0-100% Readiness Score',
      desc: 'A composite career metric combining your resume quality, DSA progress, and interview confidence.',
      icon: Award,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    }
  ];

  // In-demand Indian tech roles and CTC benchmarks
  const targetRoles = [
    { role: 'SDE-1 (Java / Spring / DSA)', ctc: '₹12 - ₹24 LPA', hubs: 'Bengaluru, Hyderabad' },
    { role: 'Full Stack Developer (MERN)', ctc: '₹10 - ₹22 LPA', hubs: 'Pune, Remote, Noida' },
    { role: 'Backend Engineer (Node / Go)', ctc: '₹14 - ₹28 LPA', hubs: 'Bengaluru, Gurugram' },
    { role: 'DevOps & Cloud Engineer', ctc: '₹12 - ₹26 LPA', hubs: 'Hyderabad, Mumbai' }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-16 sm:pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Free Career Prep Platform for Indian Tech Aspirants</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
          Crack Top Indian <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Tech Jobs & SDE Roles
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          From Bangalore product startups to global MNCs: optimize your resume for Indian ATS filters, track applications, solve DSA blind spots, and practice mock interviews — 100% free.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link
            to={isAuthenticated ? '/dashboard' : '/signup'}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAuthenticated ? 'Go to My Dashboard' : 'Start Free Prep (Sign Up)'}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {!isAuthenticated && (
            <div className="w-full sm:w-auto">
              <GoogleAuthButton mode="signup" className="py-4 px-6 rounded-2xl" />
            </div>
          )}
        </div>

        {/* Highlights Row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Free Forever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Indian Tech Hiring Benchmarks</span>
          </div>
        </div>
      </section>

      {/* Indian Tech Salary & Role Targets */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mb-8">
            <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-4 h-4" />
              Indian Job Market Benchmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Target CTC Brackets Across Tech Hubs
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Career Copilot benchmarks your preparation specifically for current hiring expectations in Bengaluru, Hyderabad, Pune, Gurugram, and Remote teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {targetRoles.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-all"
              >
                <p className="text-xs font-medium text-slate-300">{item.role}</p>
                <p className="text-xl font-black text-white mt-1 text-emerald-400">{item.ctc}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{item.hubs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Preparation Loop Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Complete Preparation System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need To Secure Offers
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto">
            Six cohesive modules designed to take you from resume screening to final HR negotiation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 hover:border-indigo-200"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-indigo-600 rounded-3xl p-8 sm:p-14 text-center text-white shadow-xl shadow-indigo-100 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Land Your Dream Tech Offer?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto">
            Create your free Career Copilot account in 30 seconds. No paywalls, no hidden fees.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Free Account Now'}</span>
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl transition-all text-sm border border-indigo-500"
              >
                <span>Sign In With Existing Account</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
