// frontend/src/components/Interviews/InterviewDetailModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  MapPin,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  BookOpen,
  ArrowRight,
  Share2
} from 'lucide-react';
import interviewService from '../../services/interviewService';

export const InterviewDetailModal = ({
  interview,
  isOpen,
  onClose,
  onEdit,
  onDeleted,
  onUpdated
}) => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !interview) return null;

  const interviewDate = new Date(interview.interviewDatetime || interview.interview_datetime);
  const now = new Date();
  const diffMs = interviewDate.getTime() - now.getTime();
  const isPast = diffMs < 0;

  // Format locale string: e.g. "Tuesday, Oct 24, 2026 at 2:30 PM"
  const formattedDate = interviewDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = interviewDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Countdown string
  const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  const countdownText = isPast
    ? `Completed ${diffDays > 0 ? `${diffDays}d ` : ''}${remainingHours}h ago`
    : `In ${diffDays > 0 ? `${diffDays} days ` : ''}${remainingHours} hours`;

  const companyName = interview.companyName || interview.company_name;
  const roleTitle = interview.roleTitle || interview.role_title;
  const stage = interview.stage || 'Interview';
  const interviewType = interview.interviewType || interview.interview_type || 'technical';
  const meetLink = interview.meetLink || interview.meet_link;
  const duration = interview.durationMinutes || interview.duration_minutes || 60;
  const status = interview.status || 'upcoming';

  const getTypeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'system_design':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'behavioral':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'hr':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusBadge = (st) => {
    switch (st.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'upcoming':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleStatusToggle = async (newStatus) => {
    try {
      setLoadingAction(true);
      const res = await interviewService.updateInterview(interview.id, { status: newStatus });
      if (onUpdated) onUpdated(res.data || res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingAction(true);
      await interviewService.deleteInterview(interview.id);
      if (onDeleted) onDeleted(interview.id);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenPrepPlan = () => {
    onClose();
    navigate(`/interviews/${interview.id}/prep`);
  };

  // Google Calendar Link
  const gcalTitle = encodeURIComponent(`${companyName} Interview – ${stage}`);
  const gcalDetails = encodeURIComponent(`Role: ${roleTitle}\nStage: ${stage}\nMeet: ${meetLink || 'N/A'}`);
  const pad = (n) => String(n).padStart(2, '0');
  const toGcalIso = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const endDate = new Date(interviewDate.getTime() + duration * 60 * 1000);
  const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${toGcalIso(interviewDate)}/${toGcalIso(endDate)}&details=${gcalDetails}&location=${encodeURIComponent(meetLink || interview.location || 'Online')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E5E7EB]">
        {/* Top Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl shadow-xs flex-shrink-0">
              {companyName ? companyName[0].toUpperCase() : 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-white/20 backdrop-blur-md text-white border-white/30`}>
                  {stage}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/20 text-blue-100">
                  {countdownText}
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight truncate">
                {companyName}
              </h2>
              <p className="text-sm text-blue-100 font-medium truncate">
                {roleTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className={`px-2.5 py-1 rounded-lg font-bold border capitalize ${getTypeStyle(interviewType)}`}>
              {interviewType.replace('_', ' ')}
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-bold border capitalize ${getStatusBadge(status)}`}>
              Status: {status}
            </span>
            <span className="px-2.5 py-1 rounded-lg font-medium bg-gray-100 text-gray-700">
              {duration} minutes
            </span>
            <span className="px-2.5 py-1 rounded-lg font-medium bg-gray-100 text-gray-700 capitalize">
              {interview.mode || 'Online'}
            </span>
          </div>

          {/* Date & Time display */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Scheduled For</p>
                <p className="text-sm font-bold text-gray-900">{formattedDate}</p>
                <p className="text-xs text-gray-600">{formattedTime} ({duration} mins)</p>
              </div>
            </div>

            <a
              href={gcalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
              title="Add to Google Calendar"
            >
              <span>+ Google Cal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Meeting Link */}
          {meetLink ? (
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <Video className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-blue-900 uppercase">Video Call Link</p>
                  <p className="text-xs text-blue-700 truncate font-mono">{meetLink}</p>
                </div>
              </div>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-2xs"
              >
                <span>Join</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Location: {interview.location || 'Remote / Video call not yet provided'}</span>
            </div>
          )}

          {/* Notes */}
          {interview.notes && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 mb-1">Notes & Objectives</h4>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                {interview.notes}
              </div>
            </div>
          )}

          {/* Prep Plan CTA Banner */}
          <div
            onClick={handleOpenPrepPlan}
            className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200 hover:border-blue-400 cursor-pointer transition-all group flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                  Launch AI Smart Prep Plan
                  <span className="text-[10px] uppercase font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">Recommended</span>
                </h4>
                <p className="text-xs text-gray-600">
                  Daily plan, company-specific questions & AI answer feedback
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Delete Confirmation Box */}
          {confirmDelete && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-2">
              <p className="font-bold text-red-800">
                Are you sure you want to delete this interview and its prep logs?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loadingAction}
                  className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {status === 'upcoming' ? (
                <button
                  type="button"
                  onClick={() => handleStatusToggle('completed')}
                  disabled={loadingAction}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStatusToggle('upcoming')}
                  disabled={loadingAction}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition-colors"
                >
                  <span>Re-open</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(interview);
                }}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 flex items-center gap-1 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenPrepPlan}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Prep Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailModal;
