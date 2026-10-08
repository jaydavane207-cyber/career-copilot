// frontend/src/components/Stories/StoryDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ThumbsUp,
  Share2,
  Eye,
  Star,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Send,
  Clock,
  Code2,
  Mic,
  Lightbulb,
  AlertCircle,
  Quote
} from 'lucide-react';
import { storyService } from '../../services/storyService';
import Avatar from '../UI/Avatar';

export const StoryDetailPage = ({ storyId, onBack, onSelectStory }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await storyService.getStoryDetail(storyId);
      if (res.success) {
        setData(res);
      } else {
        throw new Error(res.message || 'Story not found');
      }
    } catch (err) {
      console.error('Error loading story detail:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load story.');
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchDetail]);

  const handleUpvote = async () => {
    try {
      const res = await storyService.upvoteStory(storyId);
      if (res.success) {
        setData((prev) => ({
          ...prev,
          story: {
            ...prev.story,
            helpful_count: res.helpful_count,
            has_upvoted: res.upvoted
          }
        }));
        showToast(res.upvoted ? '👍 Upvoted this story!' : 'Upvote removed');
      }
    } catch (e) {
      showToast('Log in to upvote stories');
    }
  };

  const handleShare = async (platform = 'generic') => {
    try {
      const res = await storyService.shareStory(storyId, platform);
      if (res.platform_urls && platform in res.platform_urls) {
        window.open(res.platform_urls[platform], '_blank');
      } else if (res.share_url) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(res.share_url);
          showToast('🔗 Story link copied to clipboard!');
        } else {
          showToast('🔗 Story shared!');
        }
      }
    } catch (e) {
      showToast('Could not share story');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await storyService.addComment(storyId, newComment.trim(), commentRating);
      if (res.success) {
        setData((prev) => ({
          ...prev,
          comments: [res.comment, ...(prev.comments || [])]
        }));
        setNewComment('');
        showToast('💬 Comment posted successfully!');
      }
    } catch (err) {
      showToast('Could not post comment. Please log in.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded-xl w-32 animate-pulse" />
        <div className="h-48 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !data?.story) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Story Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'This success story may have been removed.'}</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Return to Stories
        </button>
      </div>
    );
  }

  const { story, comments = [], related_stories = [] } = data;
  const startSalary = story.starting_salary || 150000;
  const finalSalary = story.final_salary || 180000;
  const negotiated = story.negotiation_amount || (finalSalary > startSalary ? finalSalary - startSalary : 0);
  const salaryPct = story.salary_percentage_increase || (startSalary > 0 ? (((finalSalary - startSalary) / startSalary) * 100).toFixed(1) : 0);
  const isAnonymous = story.is_anonymous;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Success Stories</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Story Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  name={isAnonymous ? 'Anonymous' : story.author_name}
                  size="md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {isAnonymous ? 'Anonymous Achiever' : story.author_name}
                    </span>
                    {story.is_verified && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Verified Offer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {story.experience_level} • {story.years_experience} Years Exp • {story.job_type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 text-xs font-black">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{story.rating || 5}.0 Experience</span>
              </div>
            </div>

            {/* Title & Company */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                <Building2 className="w-3.5 h-3.5" />
                <span>
                  {story.company_name} • {story.role}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-semibold normal-case">{story.location}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {story.story_title}
              </h1>
            </div>

            {/* Salary Breakdown Highlight */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Total Compensation Breakdown
                  </div>
                  <div className="text-2xl font-black text-emerald-800 mt-1">
                    ${startSalary.toLocaleString()} → ${finalSalary.toLocaleString()}
                  </div>
                </div>

                {negotiated > 0 && (
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                      <TrendingUp className="w-4 h-4 text-emerald-800" />
                      <span>Negotiated +${negotiated.toLocaleString()} (+{salaryPct}%)</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Journey Stats 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center">
                <div className="text-base font-black text-slate-900">{story.interview_duration} Days</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Total Loop Time</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center">
                <div className="text-base font-black text-slate-900">{story.preparation_weeks} Weeks</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Dedicated Prep</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center">
                <div className="text-base font-black text-slate-900">{story.mock_interviews_done} Mocks</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">AI Practice</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center">
                <div className="text-base font-black text-slate-900">{story.coding_problems_logged} Problems</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">LeetCode / DSA</div>
              </div>
            </div>

            {/* Key Preparation Areas */}
            {Array.isArray(story.key_preparation) && story.key_preparation.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Core Preparation Focus:</div>
                <div className="flex flex-wrap gap-2">
                  {story.key_preparation.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-800 rounded-xl border border-blue-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Full Story Narrative Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Full Offer Story & Roadmap
            </h3>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {story.story_text}
            </div>

            {/* Actionable Tips Card */}
            {Array.isArray(story.key_tips) && story.key_tips.length > 0 && (
              <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-sm">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>Key Actionable Tips From the Winner</span>
                </div>
                <div className="space-y-2">
                  {story.key_tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-indigo-950 font-medium">
                      <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What Helped Most Callout */}
            {story.what_helped_most && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-900">What Helped Most:</div>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5 leading-relaxed">
                    {story.what_helped_most}
                  </p>
                </div>
              </div>
            )}

            {/* Advice for Others */}
            {story.advice_for_others && (
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-slate-50 rounded-r-2xl space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-blue-600" />
                  <span>Advice for candidates starting today:</span>
                </div>
                <p className="text-sm font-semibold italic text-slate-800 leading-relaxed">
                  "{story.advice_for_others}"
                </p>
              </div>
            )}

            {/* Bottom Engagement & Sharing Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    story.has_upvoted
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${story.has_upvoted ? 'fill-white' : ''}`} />
                  <span>Helpful ({story.helpful_count || 0})</span>
                </button>

                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Seen by {(story.views || 1).toLocaleString()} people</span>
                </div>
              </div>

              {/* Social Share Group */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare('twitter')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  title="Share to X"
                >
                  Post to X
                </button>
                <button
                  type="button"
                  onClick={() => handleShare('linkedin')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0077b5] text-xs font-bold transition-all cursor-pointer"
                  title="Share on LinkedIn"
                >
                  LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => handleShare('generic')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Community Q&A & Comments ({comments.length})
                </h3>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Ask a question or congratulate the author:
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-500 font-medium mr-1">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCommentRating(star)}
                      className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= commentRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your question, appreciation, or thoughts..."
                rows={3}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </form>

            {/* Comment Thread List */}
            {comments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No questions yet. Be the first to ask!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.author?.name || 'Aspirant'} size="xs" />
                        <span className="text-xs font-bold text-slate-800">
                          {c.author?.name || 'Community Member'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{c.rating || 5}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {c.comment_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Related Stories Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-black text-slate-900">Related Success Stories</h4>
            </div>

            {related_stories.length === 0 ? (
              <p className="text-xs text-slate-500">No other related stories found.</p>
            ) : (
              <div className="space-y-3">
                {related_stories.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectStory && onSelectStory(rel.id)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {rel.company_name}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        ${Number(rel.final_salary || 180000).toLocaleString()}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-2">
                      {rel.story_title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>👍 {rel.helpful_count || 0} helpful</span>
                      <span>•</span>
                      <span>{rel.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inspiration / Motivation Box */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md space-y-3">
            <h4 className="text-base font-bold">Ready to write your own story?</h4>
            <p className="text-xs text-blue-100 leading-relaxed font-medium">
              Start by scheduling an AI Mock Interview or diagnosing skill gaps against real hiring rubrics.
            </p>
            <div className="pt-2">
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl bg-white text-blue-700 font-black text-xs hover:bg-blue-50 transition-colors shadow-xs"
              >
                Explore More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
