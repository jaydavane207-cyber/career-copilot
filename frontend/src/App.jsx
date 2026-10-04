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
import AppLayout from './components/Layout/AppLayout';

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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#374151] tracking-[-0.5px]">
          Coding Practice Tracker
        </h1>
        <p className="text-[14px] text-[#6B7280]">
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
    <div className="space-y-6">
      {/* Page Header & Navigation Tabs */}
      {!activeSession && !result && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-[8px] bg-[#3B82F6] text-white flex items-center justify-center shadow-xs">
                <Mic className="w-5 h-5" />
              </div>
              <h1 className="text-[28px] font-bold text-[#374151] tracking-[-0.5px]">
                Simulated Mock Interviews
              </h1>
            </div>
            <p className="text-[14px] text-[#6B7280] mt-1">
              Practice questions across Behavioral, Technical, and System Design tracks with timed simulation, rubric scoring, and model answers.
            </p>
          </div>

          {/* Action Tabs & Launch Modal Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center bg-[#F3F4F6] p-1 rounded-[8px] text-[13px] font-semibold text-[#6B7280]">
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-colors ${
                  activeTab === 'practice' ? 'bg-white text-[#3B82F6] shadow-xs font-bold' : 'hover:text-[#374151]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Practice
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-colors ${
                  activeTab === 'history' ? 'bg-white text-[#3B82F6] shadow-xs font-bold' : 'hover:text-[#374151]'
                }`}
              >
                <History className="w-4 h-4" />
                History ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-colors ${
                  activeTab === 'analytics' ? 'bg-white text-[#3B82F6] shadow-xs font-bold' : 'hover:text-[#374151]'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                Analytics
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-[8px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-[13px] shadow-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 flex justify-center">
            <StartInterviewModal
              onSessionStarted={handleSessionStarted}
              existingDraft={existingDraft}
              onResumeDraft={handleResumeDraft}
              onDiscardDraft={handleDiscardDraft}
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <InterviewHistory
              history={history.slice(0, 5)}
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
    <Routes>
      {/* Public Landing & Auth Pages */}
      <Route
        path="/"
        element={
          <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#374151] font-sans antialiased">
            <Navbar />
            <main className="flex-1">
              <Home />
            </main>
          </div>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Authenticated Application Routes wrapped in AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/jobs" element={<KanbanBoard />} />
        <Route path="/skills" element={<GapAnalysis />} />
        <Route path="/study-plan" element={<PlanDashboard />} />
        <Route path="/coding" element={<CodingView />} />
        <Route path="/mock-interview" element={<MockInterviewView />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
