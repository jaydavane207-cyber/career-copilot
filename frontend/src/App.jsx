// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import DashboardPage from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Module Components
import ResumeAnalyzer from './components/Resume/ResumeAnalyzer';
import KanbanBoard from './components/JobTracker/KanbanBoard';
import GapAnalysis from './components/SkillGap/GapAnalysis';
import PlanDashboard from './components/StudyPlanner/PlanDashboard';

// Coding Tracker Page Container
import LogProblem from './components/CodingTracker/LogProblem';
import StatsCards from './components/CodingTracker/StatsCards';
import ProblemsList from './components/CodingTracker/ProblemsList';
import WeakTopics from './components/CodingTracker/WeakTopics';
import ProblemsChart from './components/CodingTracker/ProblemsChart';
import { codingService } from './services/codingService';

// Mock Interview Page Container
import StartInterview from './components/MockInterview/StartInterview';
import InterviewSession from './components/MockInterview/InterviewSession';
import Results from './components/MockInterview/Results';
import InterviewHistory from './components/MockInterview/InterviewHistory';
import { mockInterviewService } from './services/dashboardService';

// Coding View Wrapper
const CodingView = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);

  const refreshCodingData = async () => {
    try {
      const [pRes, sRes, wRes] = await Promise.all([
        codingService.getProblems(),
        codingService.getStats(),
        codingService.getWeakTopics()
      ]);
      if (pRes.success) setProblems(pRes.problems || []);
      if (sRes.success) setStats(sRes.stats);
      if (wRes.success) setWeakTopics(wRes.weakTopics || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshCodingData();
  }, []);

  const handleDelete = async (id) => {
    await codingService.deleteProblem(id);
    refreshCodingData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Algorithmic Practice Tracker</h2>
        <p className="text-xs text-slate-500">Log problems, analyze topic weaknesses, and build problem-solving velocity.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <LogProblem onProblemLogged={refreshCodingData} />
          <WeakTopics weakTopics={weakTopics} />
          <ProblemsChart distribution={stats?.topicDistribution} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ProblemsList problems={problems} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

// Mock Interview View Wrapper
const MockInterviewView = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await mockInterviewService.getHistory();
      if (res.success) setHistory(res.history || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      const res = await mockInterviewService.submitSession(payload);
      if (res.success) {
        setResult(res.result);
        setActiveSession(null);
        loadHistory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Simulated Mock Interviews</h2>
        <p className="text-xs text-slate-500">Timed sessions covering technical architecture and behavioral frameworks.</p>
      </div>

      {activeSession ? (
        <InterviewSession session={activeSession} onSubmitAnswers={handleSubmit} />
      ) : result ? (
        <Results result={result} onRestart={() => setResult(null)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StartInterview onSessionStarted={(sess) => setActiveSession(sess)} />
          </div>
          <div className="lg:col-span-1">
            <InterviewHistory history={history} onSelect={(item) => setResult(item)} />
          </div>
        </div>
      )}
    </div>
  );
};

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <ResumeAnalyzer />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <KanbanBoard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <GapAnalysis />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-plan"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <PlanDashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/coding" element={<ProtectedRoute><CodingView /></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewView /></ProtectedRoute>} />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
