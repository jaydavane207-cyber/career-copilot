// frontend/src/pages/InterviewsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Video,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import interviewService from '../services/interviewService';
import InterviewCalendar from '../components/Interviews/InterviewCalendar';
import AddInterviewForm from '../components/Interviews/AddInterviewForm';
import InterviewDetailModal from '../components/Interviews/InterviewDetailModal';

export const InterviewsPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'upcoming'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [defaultScheduleDate, setDefaultScheduleDate] = useState(null);

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await interviewService.getInterviews();
      if (res && res.data) {
        setInterviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleOpenAddModal = (date = null) => {
    setDefaultScheduleDate(date ? { interviewDatetime: date } : null);
    setEditingInterview(null);
    setIsAddModalOpen(true);
  };

  const handleEditInterview = (interview) => {
    setEditingInterview(interview);
    setDefaultScheduleDate(null);
    setIsAddModalOpen(true);
  };

  const filteredInterviews = interviews.filter((item) => {
    const company = (item.companyName || item.company_name || '').toLowerCase();
    const role = (item.roleTitle || item.role_title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = company.includes(query) || role.includes(query);

    if (filterType === 'all') return matchesSearch;
    const type = (item.interviewType || item.interview_type || '').toLowerCase();
    return matchesSearch && type === filterType.toLowerCase();
  });

  const upcomingInterviews = interviews.filter((i) => i.status === 'upcoming');
  const nextInterview = upcomingInterviews[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Stats Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Interview Tracker & Prep
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-semibold">
              {upcomingInterviews.length} Upcoming Round{upcomingInterviews.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Interviews Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Track interview dates, generate automated daily prep roadmaps, and practice with AI answer scoring.
          </p>
        </div>

        {/* Schedule Interview CTA */}
        <button
          onClick={() => handleOpenAddModal()}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Upcoming Interviews</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{upcomingInterviews.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Next Scheduled Round</p>
            <p className="text-sm font-bold text-gray-900 mt-1 truncate max-w-[180px]">
              {nextInterview ? `${nextInterview.companyName || nextInterview.company_name} (${nextInterview.stage})` : 'None scheduled'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Completed Interviews</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">
              {interviews.filter((i) => i.status === 'completed').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calendar' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-gray-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-gray-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming List ({upcomingInterviews.length})</span>
          </button>
        </div>

        {/* Filter controls */}
        {activeTab === 'upcoming' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company or role..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-xl bg-white font-semibold text-gray-700"
            >
              <option value="all">All Formats</option>
              <option value="technical">Technical</option>
              <option value="system_design">System Design</option>
              <option value="behavioral">Behavioral</option>
              <option value="hr">HR</option>
            </select>
          </div>
        )}
      </div>

      {/* Main View Display */}
      {activeTab === 'calendar' ? (
        <InterviewCalendar
          interviews={interviews}
          onSelectInterview={(item) => setSelectedInterview(item)}
          onAddInterview={(date) => handleOpenAddModal(date)}
        />
      ) : (
        /* Upcoming Cards List */
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
              <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-bold text-gray-800">No interviews match your criteria</p>
              <button
                onClick={() => handleOpenAddModal()}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
              >
                + Schedule Interview
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInterviews.map((item) => {
                const d = new Date(item.interviewDatetime || item.interview_datetime);
                const dateStr = d.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedInterview(item)}
                    className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-black text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                            {(item.companyName || item.company_name || 'C')[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {item.companyName || item.company_name}
                            </h3>
                            <p className="text-xs text-gray-600 font-medium">
                              {item.roleTitle || item.role_title}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                          {item.stage}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                          {dateStr} at {timeStr}
                        </span>
                        <span>•</span>
                        <span>{item.durationMinutes || 60}m</span>
                        <span>•</span>
                        <span className="capitalize">{item.interviewType || 'Technical'}</span>
                      </div>

                      {item.meetLink && (
                        <p className="text-[11px] text-blue-600 font-medium truncate mt-2 flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{item.meetLink}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {item.status || 'upcoming'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/interviews/${item.id}/prep`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-blue-200" />
                        <span>Prep Plan</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Interview Modal */}
      <AddInterviewForm
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingInterview(null);
          setDefaultScheduleDate(null);
        }}
        initialData={editingInterview || defaultScheduleDate}
        onSuccess={() => {
          fetchInterviews();
        }}
      />

      {/* Interview Detail Modal */}
      <InterviewDetailModal
        isOpen={Boolean(selectedInterview)}
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onEdit={(interview) => {
          setSelectedInterview(null);
          handleEditInterview(interview);
        }}
        onDeleted={() => {
          setSelectedInterview(null);
          fetchInterviews();
        }}
        onUpdated={() => {
          fetchInterviews();
        }}
      />
    </div>
  );
};

export default InterviewsPage;
