// frontend/src/components/CodingTracker/ProblemsList.jsx
import React, { useState, useMemo } from 'react';
import {
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import ConfirmDialog from './ConfirmDialog';

export const ProblemsList = ({
  problems = [],
  onDelete,
  onReview,
  onViewDetails,
  selectedTopicFilter,
  onClearTopicFilter,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState(selectedTopicFilter || 'All');
  const [selectedDifficulties, setSelectedDifficulties] = useState({
    Easy: true,
    Medium: true,
    Hard: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [problemToDelete, setProblemToDelete] = useState(null);

  React.useEffect(() => {
    if (selectedTopicFilter) {
      setTopicFilter(selectedTopicFilter);
    }
  }, [selectedTopicFilter]);

  const uniqueTopics = useMemo(() => {
    const set = new Set();
    problems.forEach((p) => {
      if (p.topic) set.add(p.topic);
    });
    return Array.from(set).sort();
  }, [problems]);

  const toggleDifficulty = (diff) => {
    setSelectedDifficulties((prev) => ({ ...prev, [diff]: !prev[diff] }));
    setCurrentPage(1);
  };

  // Sort newest first
  const sortedProblems = useMemo(() => {
    return [...problems].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });
  }, [problems]);

  // Filtering
  const filteredProblems = useMemo(() => {
    return sortedProblems.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (p.problemName || p.title || '').toLowerCase().includes(q);
        const topicMatch = (p.topic || '').toLowerCase().includes(q);
        if (!nameMatch && !topicMatch) return false;
      }
      if (topicFilter !== 'All' && p.topic !== topicFilter) {
        return false;
      }
      const diff = p.difficulty || 'Medium';
      if (!selectedDifficulties[diff]) {
        return false;
      }
      return true;
    });
  }, [sortedProblems, searchQuery, topicFilter, selectedDifficulties]);

  // Pagination: 10 per page
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / itemsPerPage));
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]';
      case 'medium':
        return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
      case 'hard':
        return 'bg-[#FEE2E2] text-[#7F1D1D] border border-[#FECACA]';
      default:
        return 'bg-[#F3F4F6] text-[#374151]';
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {/* H2: "All Problems" */}
          <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
            All Problems
          </h2>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Showing {paginatedProblems.length} of {filteredProblems.length} filtered problems
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Filters Toolbar: Topic dropdown & Difficulty checkboxes */}
      <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-[13px]">
        {/* Topic dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#374151]">Topic:</span>
          <select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-[8px] border border-[#E5E7EB] bg-white text-[#374151] font-medium text-[13px] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="All">All Topics ({problems.length})</option>
            {uniqueTopics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty checkboxes */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#374151]">Difficulty:</span>
          {['Easy', 'Medium', 'Hard'].map((diff) => (
            <label
              key={diff}
              className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-[#374151]"
            >
              <input
                type="checkbox"
                checked={selectedDifficulties[diff]}
                onChange={() => toggleDifficulty(diff)}
                className="w-4 h-4 rounded text-[#3B82F6] accent-[#3B82F6]"
              />
              <span>{diff}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Table: Date | Topic (pill badge) | Difficulty | Time (minutes) | Rating (stars) | Solved (✓/✗) | Actions (Delete) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[12px] font-semibold text-[#374151]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Topic</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-center">Solved</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-[14px]">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((p) => {
                const dateStr = formatDate(p.date || p.createdAt);
                const isSolved = p.solved !== false;

                return (
                  <tr
                    key={p.id}
                    onClick={() => onViewDetails && onViewDetails(p)}
                    className="hover:bg-[#F3F4F6] transition-colors cursor-pointer group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 text-[12px] text-[#6B7280] whitespace-nowrap">
                      {dateStr}
                    </td>

                    {/* Topic (with pill badge) */}
                    <td className="py-3.5 px-4">
                      <span className="bg-[#EBF5FF] text-[#3B82F6] px-2.5 py-1 rounded-[16px] text-[12px] font-semibold whitespace-nowrap">
                        {p.topic}
                      </span>
                    </td>

                    {/* Difficulty (Easy/Medium/Hard color-coded) */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-[12px] text-[11px] font-bold ${getDifficultyColor(
                          p.difficulty
                        )}`}
                      >
                        {p.difficulty}
                      </span>
                    </td>

                    {/* Time (minutes) */}
                    <td className="py-3.5 px-4 text-[13px] font-medium text-[#374151]">
                      {p.timeTaken || 25}m
                    </td>

                    {/* Rating (stars) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (p.selfRating || 3)
                                ? 'text-[#F59E0B] fill-[#F59E0B]'
                                : 'text-[#E5E7EB]'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Solved (✓/✗ icon) */}
                    <td className="py-3.5 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] inline-block" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#EF4444] inline-block" />
                      )}
                    </td>

                    {/* Actions (Delete icon) */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProblemToDelete(p);
                        }}
                        className="p-1.5 rounded-[6px] text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                        title="Delete problem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#6B7280] text-[14px]">
                  No matching problems found. Adjust filters or log a problem.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination: 10 per page */}
      <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between text-[13px] text-[#6B7280]">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of{' '}
          {filteredProblems.length} items
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-semibold text-[#374151]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="font-bold text-[#111827] px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-[8px] border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-semibold text-[#374151]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(problemToDelete)}
        title="Remove Problem"
        message={`Are you sure you want to delete "${problemToDelete?.problemName || 'Problem'}" from practice history?`}
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={() => {
          if (problemToDelete && onDelete) {
            onDelete(problemToDelete.id);
          }
          setProblemToDelete(null);
        }}
        onCancel={() => setProblemToDelete(null)}
      />
    </div>
  );
};

export default ProblemsList;
