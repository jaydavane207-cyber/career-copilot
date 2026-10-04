// frontend/src/components/CodingTracker/ProblemsList.jsx
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  Eye,
  Calendar,
  X
} from 'lucide-react';
import { getDifficultyBadge } from '../../utils/helpers';
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
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [solvedFilter, setSolvedFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Deletion modal state
  const [problemToDelete, setProblemToDelete] = useState(null);

  // Sync external topic filter if changed from outside (e.g. from WeakTopics "Review These")
  React.useEffect(() => {
    if (selectedTopicFilter) {
      setTopicFilter(selectedTopicFilter);
    }
  }, [selectedTopicFilter]);

  // Unique topics list for dropdown
  const uniqueTopics = useMemo(() => {
    const set = new Set();
    problems.forEach(p => {
      if (p.topic) set.add(p.topic);
    });
    return Array.from(set).sort();
  }, [problems]);

  // Filtering logic
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (p.problemName || p.title || '').toLowerCase().includes(q);
        const notesMatch = (p.notes || '').toLowerCase().includes(q);
        const topicMatch = (p.topic || '').toLowerCase().includes(q);
        if (!nameMatch && !notesMatch && !topicMatch) return false;
      }

      // 2. Topic Filter
      if (topicFilter !== 'All' && p.topic !== topicFilter) {
        return false;
      }

      // 3. Difficulty Filter
      if (difficultyFilter !== 'All') {
        if ((p.difficulty || '').toLowerCase() !== difficultyFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Solved Filter
      if (solvedFilter !== 'All') {
        const wantSolved = solvedFilter === 'Solved';
        if (Boolean(p.solved) !== wantSolved) return false;
      }

      // 5. Date Filter
      if (dateFilter !== 'All') {
        const probDate = new Date(p.date || p.createdAt);
        const now = new Date();
        if (dateFilter === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (probDate < sevenDaysAgo) return false;
        } else if (dateFilter === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (probDate < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [problems, searchQuery, topicFilter, difficultyFilter, solvedFilter, dateFilter]);

  // Export as CSV function
  const handleExportCSV = () => {
    if (filteredProblems.length === 0) {
      if (showToast) showToast('No problems available to export.', 'info');
      return;
    }

    const headers = [
      'Problem Name',
      'Topic',
      'Difficulty',
      'Time Taken (mins)',
      'Solved',
      'Self Rating (1-5)',
      'Date Practiced',
      'Notes',
      'Last Reviewed At',
      'Next Review Date'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = filteredProblems.map(p => [
      escapeCsv(p.problemName || p.title),
      escapeCsv(p.topic),
      escapeCsv(p.difficulty),
      p.timeTaken ?? 30,
      p.solved ? 'Yes' : 'No',
      p.selfRating ?? 3,
      escapeCsv(formatDate(p.date)),
      escapeCsv(p.notes || ''),
      escapeCsv(p.lastReviewedAt ? formatDate(p.lastReviewedAt) : 'Never'),
      escapeCsv(p.nextReviewDate ? formatDate(p.nextReviewDate) : 'N/A')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `coding_practice_tracker_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) {
      showToast(`Exported ${filteredProblems.length} problems to CSV!`, 'success');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTopicFilter('All');
    setDifficultyFilter('All');
    setSolvedFilter('All');
    setDateFilter('All');
    if (onClearTopicFilter) onClearTopicFilter();
  };

  const hasActiveFilters = searchQuery || topicFilter !== 'All' || difficultyFilter !== 'All' || solvedFilter !== 'All' || dateFilter !== 'All';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Top Header & Actions Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900">
              Logged Problems ({filteredProblems.length})
            </h4>
            {hasActiveFilters && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Filtered from {problems.length}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any problem to inspect details, takeaways, and spaced repetition schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Download logged problems as a CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search problems, notes, patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 bg-white"
          />
        </div>

        {/* Topic Filter */}
        <div>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="All">All Topics</option>
            {uniqueTopics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Status / Solved Filter */}
        <div>
          <select
            value={solvedFilter}
            onChange={(e) => setSolvedFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Needs Practice</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      {filteredProblems.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">No matching problems found</p>
          <p className="text-[11px] text-slate-400">
            {hasActiveFilters
              ? 'Try relaxing search query or filter criteria.'
              : 'Log your first problem using the form on the left!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Problem Name</th>
                <th className="py-3 px-3">Topic</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProblems.map((p) => {
                const isDue = p.isDue;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onViewDetails && onViewDetails(p)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Problem Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate group-hover:text-indigo-600 transition-colors">
                          {p.problemName || p.title}
                        </span>
                        {isDue && (
                          <span
                            title="Due for spaced repetition review"
                            className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0"
                          />
                        )}
                      </div>
                      {p.notes && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal italic">
                          "{p.notes}"
                        </p>
                      )}
                    </td>

                    {/* Topic */}
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 whitespace-nowrap">
                        {p.topic}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getDifficultyBadge(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                      {p.timeTaken}m
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= (p.selfRating || 3)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {p.solved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Solved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <HelpCircle className="w-3 h-3 text-amber-500" />
                          Review
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDate(p.date)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isDue && onReview && (
                          <button
                            type="button"
                            onClick={() => onReview(p.id)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Mark as Reviewed today"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onViewDetails && onViewDetails(p)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setProblemToDelete(p)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(problemToDelete)}
        title="Delete Logged Problem?"
        message={`Are you sure you want to remove "${problemToDelete?.problemName || problemToDelete?.title || 'this problem'}"? This will remove its spaced repetition record.`}
        confirmText="Delete Problem"
        cancelText="Keep"
        isDanger={true}
        onConfirm={() => {
          if (problemToDelete && onDelete) {
            onDelete(problemToDelete.id);
            setProblemToDelete(null);
          }
        }}
        onCancel={() => setProblemToDelete(null)}
      />
    </div>
  );
};

export default ProblemsList;
