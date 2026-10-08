// frontend/src/components/Stories/SuccessStoriesFeed.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Trophy,
  ThumbsUp,
  Eye,
  Share2,
  DollarSign,
  Briefcase,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Building2,
  Calendar,
  PlusCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { storyService } from '../../services/storyService';
import ShareStoryModal from './ShareStoryModal';

const POPULAR_COMPANIES = ['All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Stripe'];
const ROLES = ['All', 'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Product Manager', 'Data Scientist'];
const EXP_LEVELS = ['All', 'Junior', 'Mid', 'Senior'];
const SORT_OPTIONS = [
  { label: 'Most Helpful', value: 'helpful' },
  { label: 'Newest Stories', value: 'newest' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Highest Salary', value: 'salary' },
  { label: 'Highest Negotiation', value: 'negotiation' }
];

export const SuccessStoriesFeed = ({ onSelectStory }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStories, setTotalStories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    company: 'All',
    role: 'All',
    experience_level: 'All',
    search: '',
    sort: 'helpful'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadStories = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await storyService.getStories({
        ...filters,
        page,
        limit: 8
      });
      if (res.success) {
        setStories(res.stories || []);
        setTotalStories(res.total || 0);
        setCurrentPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load success stories:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStories(1);
  }, [loadStories]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleUpvote = async (e, storyId) => {
    e.stopPropagation();
    try {
      const res = await storyService.upvoteStory(storyId);
      if (res.success) {
        setStories((prev) =>
          prev.map((s) => {
            if (s.id === storyId) {
              return {
                ...s,
                helpful_count: res.helpful_count,
                has_upvoted: res.upvoted
              };
            }
            return s;
          })
        );
        showToast(res.upvoted ? '👍 Upvoted story!' : 'Upvote removed');
      }
    } catch (err) {
      showToast('Log in to upvote stories');
    }
  };

  const handleShare = async (e, storyId) => {
    e.stopPropagation();
    try {
      const res = await storyService.shareStory(storyId);
      if (res.share_url) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(res.share_url);
          showToast('🔗 Story link copied to clipboard!');
        } else {
          showToast('🔗 Shared successfully!');
        }
      }
    } catch (err) {
      showToast('Could not share story');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Community Motivation & Proof Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Real Stories, Real Offers, Life-Changing Compensation
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Discover how candidates studied, overcame rigorous interview loops, and negotiated +$20k–$50k compensation boosts at world-class tech companies.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Trophy className="w-4 h-4 text-slate-900" />
              <span>Share Your Success Story</span>
            </button>
            <span className="text-xs text-blue-200 font-semibold">
              🎉 {totalStories}+ Inspiring Stories Shared
            </span>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search stories by role, company, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex-shrink-0">Sort By:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* Company Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Company:</span>
            {POPULAR_COMPANIES.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => handleFilterChange('company', c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.company === c
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Experience Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Level:</span>
            {EXP_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleFilterChange('experience_level', lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.experience_level === lvl
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-16 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Stories Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or be the first person to share a success story for this role!
          </p>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Share Your Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stories.map((story) => {
            const hasUpvoted = Boolean(story.has_upvoted);
            const negotiated = story.negotiation_amount || 0;
            const pct = story.salary_percentage_increase || 0;

            return (
              <div
                key={story.id}
                onClick={() => onSelectStory && onSelectStory(story.id)}
                className="group bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-blue-300 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {story.company_name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {story.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{story.rating || 5}.0</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {story.story_title}
                  </h3>

                  {/* Salary Card Highlight */}
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200/90 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Final Package
                      </div>
                      <div className="text-base font-black text-emerald-700">
                        ${Number(story.final_salary || 180000).toLocaleString()}
                      </div>
                    </div>
                    {negotiated > 0 && (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                          <TrendingUp className="w-3 h-3 text-emerald-700" />
                          +${Number(negotiated).toLocaleString()} ({pct}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preparation Tags */}
                  {Array.isArray(story.key_preparation) && story.key_preparation.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {story.key_preparation.slice(0, 3).map((prep, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          {prep}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Story preview text */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {story.story_preview || story.story_text}
                  </p>
                </div>

                {/* Footer Engagement Controls */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    {/* Upvote Button */}
                    <button
                      type="button"
                      onClick={(e) => handleUpvote(e, story.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        hasUpvoted
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-blue-600' : ''}`} />
                      <span>{story.helpful_count || 0}</span>
                    </button>

                    {/* Views */}
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{story.views || 1}</span>
                    </div>

                    {/* Share */}
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, story.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-blue-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>Read full story</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => loadStories(currentPage - 1)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => loadStories(currentPage + 1)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Share Modal Dialog */}
      <ShareStoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSuccess={() => {
          loadStories(1);
        }}
      />
    </div>
  );
};

export default SuccessStoriesFeed;
