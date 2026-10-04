// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Mic, History, BarChart2, Plus, Sparkles, BookOpen } from 'lucide-react';
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
import SpacedRepetitionReminder from './components/CodingTracker/SpacedRepetitionReminder';
import ProblemDetailModal from './components/CodingTracker/ProblemDetailModal';
import Toast from './components/Common/Toast';
import { codingService } from './services/codingService';

// Mock Interview Page Container
import StartInterviewModal from './components/MockInterview/StartInterviewModal';
import InterviewSession from './components/MockInterview/InterviewSession';
import Results from './components/MockInterview/Results';
import AnswerReview from './components/MockInterview/AnswerReview';
import InterviewHistory from './components/MockInterview/InterviewHistory';
import StatisticsDashboard from './components/MockInterview/StatisticsDashboard';
import { mockInterviewService } from './services/mockInterviewService';

// Coding View Wrapper
const CodingView = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [spacedData, setSpacedData] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const refreshCodingData = async () => {
    try {
      const [pRes, sRes, wRes, srRes] = await Promise.all([
        codingService.getProblems(),
        codingService.getStats(),
        codingService.getWeakTopics(),
        codingService.getSpacedRepetition()
      ]);
      if (pRes.success) setProblems(pRes.problems || []);
      if (sRes.success) setStats(sRes.stats);
      if (wRes.success) setWeakTopics(wRes.weakTopics || []);
      if (srRes.success) setSpacedData(srRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshCodingData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await codingService.deleteProblem(id);
      if (res.success) {
        showToast('Problem removed from practice log.', 'info');
        refreshCodingData();
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to delete problem.', 'error');
    }
  };

  const handleReview = async (id) => {
    try {
      const res = await codingService.reviewProblem(id);
      if (res.success) {
        showToast(res.message || 'Problem reviewed successfully!', 'success');
        refreshCodingData();
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to mark problem as reviewed.', 'error');
    }
  };

  const handleReviewTopic = (topic) => {
    setSelectedTopicFilter(topic);
    showToast(`Filtering problems for weak topic: ${topic}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Coding Practice Tracker</h2>
        <p className="text-xs text-slate-500">
          Track problem-solving velocity, conquer weak algorithmic topics, and reinforce memory via automated spaced repetition.
        </p>
      </div>

      {/* Spaced Repetition Reminder Banner */}
      <SpacedRepetitionReminder
        spacedData={spacedData}
        onReviewProblem={handleReview}
        onViewDetails={(prob) => setSelectedProblem(prob)}
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid: Form/Weak/Chart on Left, Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <LogProblem
            onProblemLogged={refreshCodingData}
            showToast={showToast}
          />
          <WeakTopics
            weakTopics={weakTopics}
            onReviewTopic={handleReviewTopic}
          />
          <ProblemsChart
            distribution={stats?.topicDistribution}
            topicBreakdown={stats?.topicBreakdown}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ProblemsList
            problems={problems}
            onDelete={handleDelete}
            onReview={handleReview}
            onViewDetails={(prob) => setSelectedProblem(prob)}
            selectedTopicFilter={selectedTopicFilter}
            onClearTopicFilter={() => setSelectedTopicFilter('All')}
            showToast={showToast}
          />
        </div>
      </div>

      {/* Problem Details Modal */}
      <ProblemDetailModal
        problem={selectedProblem}
        isOpen={Boolean(selectedProblem)}
        onClose={() => setSelectedProblem(null)}
        onReview={handleReview}
      />

      {/* Success / Info / Error Toast */}
      {toast && (
        <Toast toast={toast} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

// Mock Interview View Wrapper
const MockInterviewView = () => {
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'history' | 'analytics'
  const [activeSession, setActiveSession] = useState(null);
  const [result, setResult] = useState(null);
  const [viewingAnswers, setViewingAnswers] = useState(false);
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingDraft, setExistingDraft] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadHistory = async () => {
    try {
      const res = await mockInterviewService.getHistory();
      if (res.success) setHistory(res.history || []);
    } catch (e) {
      console.error('Error fetching interview history:', e);
    }
  };

  // Check for local storage drafts
  const checkDraft = () => {
    try {
      const raw = localStorage.getItem('career_copilot_interview_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        setExistingDraft(parsed);
      } else {
        setExistingDraft(null);
      }
    } catch (e) {
      console.warn('Failed to parse draft from localStorage:', e);
    }
  };

  useEffect(() => {
    loadHistory();
    checkDraft();
  }, []);

  const handleResumeDraft = () => {
    if (existingDraft) {
      setActiveSession(existingDraft);
      setResult(null);
      setViewingAnswers(false);
      showToast('Resumed unfinished interview session from draft.', 'info');
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('career_copilot_interview_draft');
    setExistingDraft(null);
    showToast('Discarded draft session.', 'info');
  };

  const handleSessionStarted = (sess) => {
    setActiveSession(sess);
    setResult(null);
    setViewingAnswers(false);
    setIsModalOpen(false);
    showToast(`Started ${sess.interviewType} Interview Simulation!`, 'success');
  };

  const handleSubmit = async (payload) => {
    try {
      const res = await mockInterviewService.submitSession(payload);
      if (res.success) {
        setResult(res.result);
        setActiveSession(null);
        setViewingAnswers(false);
        setExistingDraft(null);
        showToast('Interview evaluated and saved to your history!', 'success');
        loadHistory();
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to submit interview answers. Please try again.', 'error');
    }
  };

  const handleSelectPastSession = (item) => {
    setResult(item);
    setViewingAnswers(true);
  };

  const handleRestart = () => {
    setResult(null);
    setViewingAnswers(false);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header & Navigation Tabs */}
      {!activeSession && !result && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Simulated Mock Interviews
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Practice 100 questions across Behavioral, Technical, and System Design tracks with timed simulation, rubric scoring, and model answers.
            </p>
          </div>

          {/* Action Tabs & Launch Modal Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'practice' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Practice
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'history' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Analytics
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Render Dynamic State */}
      {activeSession ? (
        <InterviewSession
          session={activeSession}
          onSubmitAnswers={handleSubmit}
          onExitSession={() => {
            setActiveSession(null);
            checkDraft();
          }}
        />
      ) : result ? (
        viewingAnswers ? (
          <AnswerReview
            session={result}
            onBackToResults={() => setViewingAnswers(false)}
            onRestart={handleRestart}
          />
        ) : (
          <Results
            result={result}
            onRestart={handleRestart}
            onViewAnswers={() => setViewingAnswers(true)}
          />
        )
      ) : activeTab === 'history' ? (
        <InterviewHistory
          history={history}
          onSelectSession={handleSelectPastSession}
          onStartNew={() => setIsModalOpen(true)}
        />
      ) : activeTab === 'analytics' ? (
        <StatisticsDashboard
          history={history}
          onStartTrack={(track) => {
            setIsModalOpen(true);
          }}
        />
      ) : (
        /* Default 'practice' Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StartInterviewModal
              onSessionStarted={handleSessionStarted}
              existingDraft={existingDraft}
              onResumeDraft={handleResumeDraft}
              onDiscardDraft={handleDiscardDraft}
            />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <InterviewHistory
              history={history.slice(0, 4)}
              onSelectSession={handleSelectPastSession}
              onStartNew={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Reusable Launch Modal Dialog */}
      <StartInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSessionStarted={handleSessionStarted}
        existingDraft={existingDraft}
        onResumeDraft={handleResumeDraft}
        onDiscardDraft={handleDiscardDraft}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast toast={toast} onClose={() => setToast(null)} />
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
