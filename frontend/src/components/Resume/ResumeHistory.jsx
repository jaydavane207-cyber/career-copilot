// frontend/src/components/Resume/ResumeHistory.jsx
import React, { useState } from 'react';
import {
  FileText,
  Trash2,
  Calendar,
  Award,
  Download,
  Eye,
  Clock,
  Check,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { downloadAnalysisPDF } from '../../utils/pdfReport';
import { Button } from '../UI/Button';
import { Modal } from '../Common/Modal';

/**
 * ResumeHistory Component:
 * Displays user's past resume analyses with timestamps, scores, and quick download/inspect actions.
 */
export const ResumeHistory = ({
  history = [],
  onSelect,
  onSelectAnalysis,
  onDelete,
  onDeleteAnalysis,
  selectedAnalysisId
}) => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSelect = onSelect || onSelectAnalysis;
  const handleDeleteAction = onDelete || onDeleteAnalysis;

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm space-y-2">
        <Clock className="w-8 h-8 mx-auto text-slate-300" />
        <h4 className="text-sm font-bold text-slate-700">No Past Analyses Recorded</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Upload your resume PDF and analyze it against a job description to start tracking your ATS improvement history.
        </p>
      </div>
    );
  }

  const handleDownload = (e, item) => {
    e.stopPropagation();
    try {
      setDownloadingId(item.id);
      downloadAnalysisPDF(item, item.fileName);
      setTimeout(() => setDownloadingId(null), 1500);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !handleDeleteAction) return;
    try {
      setDeleting(true);
      await handleDeleteAction(itemToDelete.id || itemToDelete.resumeId);
      setItemToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Resume Analysis History
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Review past match scores, missing keywords, and export PDF reports.
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {history.length} {history.length === 1 ? 'analysis' : 'analyses'}
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const isSelected = selectedAnalysisId === item.id;
          const score = item.matchScore !== undefined ? item.matchScore : 0;
          const isHigh = score >= 67;
          const isMedium = score >= 34 && score < 67;

          const badgeColor = isHigh
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : isMedium
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-rose-50 text-rose-700 border-rose-200';

          return (
            <div
              key={item.id}
              onClick={() => handleSelect && handleSelect(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.jobTitle || 'Target Role'}
                    </h4>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {item.fileName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.analyzedAt || item.uploadedAt)}
                    </span>

                    {item.missingKeywords && item.missingKeywords.length > 0 && (
                      <span className="text-rose-600 font-medium truncate max-w-xs">
                        Missing: {item.missingKeywords.slice(0, 3).join(', ')}
                        {item.missingKeywords.length > 3 ? ` +${item.missingKeywords.length - 3}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Score Pill & Action Buttons */}
              <div className="flex items-center gap-2.5 justify-end flex-shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                {/* Score badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-extrabold ${badgeColor}`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>{score}% Match</span>
                </div>

                {/* View Details */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (handleSelect) handleSelect(item);
                  }}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                  title="View Full Analysis"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Download PDF button */}
                <button
                  type="button"
                  onClick={(e) => handleDownload(e, item)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                  title="Download PDF Report"
                >
                  {downloadingId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>

                {/* Delete button with confirmation */}
                {handleDeleteAction && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete(item);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete History Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {itemToDelete && (
        <Modal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          title="Delete Resume Analysis"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-semibold">Are you sure you want to delete this analysis?</p>
                <p className="text-xs text-rose-600 mt-1">
                  Analysis for <strong>{itemToDelete.jobTitle}</strong> ({itemToDelete.fileName}) will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="secondary"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                loading={deleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ResumeHistory;
