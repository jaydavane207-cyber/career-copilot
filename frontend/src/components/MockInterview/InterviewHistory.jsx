// frontend/src/components/MockInterview/InterviewHistory.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import { formatDate, formatPercentage } from '../../utils/formatters';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import EmptyState from '../UI/EmptyState';

const ITEMS_PER_PAGE = 5;

export const InterviewHistory = ({ history = [], onSelectSession, onStartNew }) => {
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHistory = history.filter(item => {
    if (filterType === 'All') return true;
    return (item.interviewType || '').toLowerCase() === filterType.toLowerCase();
  });

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getScoreBadge = (score) => {
    if (score >= 75) return <Badge variant="success">{score}%</Badge>;
    if (score >= 50) return <Badge variant="info">{score}%</Badge>;
    return <Badge variant="warning">{score}%</Badge>;
  };

  const getTypeBadge = (type) => {
    const lower = (type || '').toLowerCase();
    if (lower.includes('behav')) return <Badge variant="neutral">Behavioral</Badge>;
    if (lower.includes('system')) return <Badge variant="neutral">System Design</Badge>;
    return <Badge variant="neutral">Technical</Badge>;
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <EmptyState
          icon={BookOpen}
          title="No interview history found"
          description="Take your first simulated mock interview to build confidence and view historical trends."
          actionText="Start First Interview"
          onAction={onStartNew}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden space-y-4 p-6 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-[20px] font-bold text-[#374151] tracking-[-0.5px]">
            Interview History
          </h3>
          <p className="text-[13px] text-[#6B7280]">
            Review past mock interview sessions, answer scores, and detailed feedback
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-[8px] text-[12px] font-semibold text-[#6B7280]">
            {['All', 'Behavioral', 'Technical', 'System Design'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-[6px] transition-colors ${
                  filterType === type
                    ? 'bg-white text-[#3B82F6] shadow-xs font-bold'
                    : 'hover:text-[#374151]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {onStartNew && (
            <Button
              variant="primary"
              onClick={onStartNew}
              className="flex items-center gap-1.5 text-[12px] py-1.5 px-3"
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Questions</th>
              <th className="py-3 px-4">Avg Confidence</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-[14px]">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[13px] text-[#6B7280]">
                  No records found matching "{filterType}".
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const stats = item.sessionStats || {};
                const answers = item.answers || item.questions || [];
                const qCount = stats.totalQuestions || answers.length || 0;
                const avgConf = stats.avgConfidence !== undefined ? stats.avgConfidence : '3.8';
                const score = Math.round(item.overallScore || 0);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F3F4F6] transition-colors"
                  >
                    {/* Date */}
                    <td className="py-4 px-4 font-medium text-[#374151] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                        <span>{formatDate(item.completedAt || item.date || item.createdAt)}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getTypeBadge(item.interviewType)}
                    </td>

                    {/* Questions */}
                    <td className="py-4 px-4 text-[#374151] whitespace-nowrap">
                      {qCount} questions
                    </td>

                    {/* Avg Confidence */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[#374151]">
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="font-semibold">{avgConf}</span>
                        <span className="text-[12px] text-[#6B7280]">/ 5</span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getScoreBadge(score)}
                    </td>

                    {/* Actions (Review button) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectSession && onSelectSession(item)}
                        className="btn-secondary text-[12px] py-1.5 px-3 inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (5 per page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] text-[13px] text-[#6B7280]">
          <div>
            Showing <span className="font-semibold text-[#374151]">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-[#374151]">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredHistory.length)}
            </span>{' '}
            of <span className="font-semibold text-[#374151]">{filteredHistory.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validPage === 1}
              className="p-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-[#374151]" />
            </button>

            <span className="text-[13px] font-semibold text-[#374151] px-2">
              Page {validPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
              className="p-2 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-[#374151]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
