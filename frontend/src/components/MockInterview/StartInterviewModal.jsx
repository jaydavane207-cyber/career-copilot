// frontend/src/components/MockInterview/StartInterviewModal.jsx
import React, { useState } from 'react';
import {
  Mic,
  Play,
  Users,
  Code,
  Layers,
  Clock,
  RotateCcw,
  AlertCircle,
  X
} from 'lucide-react';
import { mockInterviewService } from '../../services/mockInterviewService';
import Button from '../UI/Button';

export const StartInterviewModal = ({
  isOpen,
  onClose,
  onSessionStarted,
  existingDraft,
  onResumeDraft,
  onDiscardDraft
}) => {
  const [interviewType, setInterviewType] = useState('Behavioral');
  const [role, setRole] = useState('Fullstack Developer');
  const [questionCount, setQuestionCount] = useState(5);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tracks = [
    {
      id: 'Behavioral',
      title: 'Behavioral',
      subtitle: 'STAR Method & Culture Fit',
      icon: Users
    },
    {
      id: 'Technical',
      title: 'Technical',
      subtitle: 'Core CS & Framework Internals',
      icon: Code
    },
    {
      id: 'System Design',
      title: 'System Design',
      subtitle: 'High-Scale Distributed Systems',
      icon: Layers
    }
  ];

  const estimatedMinutes = questionCount * 3;

  const handleStart = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await mockInterviewService.getQuestions({
        type: interviewType,
        count: parseInt(questionCount, 10),
        role
      });

      if (res.success && res.questions?.length > 0) {
        const sessionConfig = {
          role,
          interviewType,
          timerEnabled,
          questions: res.questions,
          startedAt: Date.now()
        };
        if (onSessionStarted) {
          onSessionStarted(sessionConfig);
        }
        if (onClose) onClose();
      } else {
        setError('No questions returned for the selected filters. Please try another track.');
      }
    } catch (err) {
      console.error('Error starting interview session:', err);
      setError(err.response?.data?.message || 'Failed to initialize session. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] max-w-[500px] w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-[8px] bg-[#3B82F6] flex items-center justify-center text-white shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[24px] font-bold text-[#374151] tracking-[-0.5px] leading-tight">
              Start Interview
            </h2>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              Simulate real interviews with timed questions & feedback
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* In-Progress Draft Alert Banner */}
      {existingDraft && (
        <div className="p-4 rounded-[8px] bg-[#FFFBEB] border-l-4 border-[#F59E0B] text-[#92400E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
            <span>
              Unfinished <strong>{existingDraft.interviewType}</strong> session in draft.
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onResumeDraft}
              className="px-3 py-1.5 rounded-[8px] bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold transition-colors flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resume
            </button>
            <button
              onClick={onDiscardDraft}
              className="px-3 py-1.5 rounded-[8px] bg-white border border-[#FDE68A] text-[#92400E] hover:bg-[#FEF3C7] font-semibold transition-colors text-[11px]"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-[8px] bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[13px] text-[#7F1D1D] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleStart} className="space-y-5">
        {/* Track Selection (3 Radio Options with Icons) */}
        <div className="space-y-2.5">
          <label className="block text-[14px] font-semibold text-[#374151]">
            Track Selection
          </label>
          <div className="space-y-2">
            {tracks.map((t) => {
              const Icon = t.icon;
              const isSelected = interviewType === t.id;
              return (
                <label
                  key={t.id}
                  className={`flex items-center justify-between p-3.5 rounded-[8px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#3B82F6] bg-[#EBF5FF]'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#3B82F6] text-white'
                          : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#374151] leading-tight">
                        {t.title}
                      </p>
                      <p className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                        {t.subtitle}
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="interviewTrack"
                    value={t.id}
                    checked={isSelected}
                    onChange={() => setInterviewType(t.id)}
                    className="w-5 h-5 text-[#3B82F6] border-2 border-[#E5E7EB] focus:ring-[#3B82F6]"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Question Count Slider (3 to 10, default: 5) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-semibold text-[#374151]">
              Number of Questions: <span className="text-[#3B82F6] font-bold">{questionCount}</span>
            </label>
            <span className="text-[12px] text-[#6B7280]">
              Range: 3 - 10
            </span>
          </div>

          <input
            type="range"
            min="3"
            max="10"
            step="1"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-[#E5E7EB] rounded-[4px] appearance-none cursor-pointer accent-[#3B82F6]"
          />

          <div className="flex justify-between text-[11px] text-[#6B7280] pt-0.5">
            <span>3 questions</span>
            <span>5 (standard)</span>
            <span>10 questions</span>
          </div>
        </div>

        {/* Estimated Time (Calculated: 3 mins per question) */}
        <div className="p-3.5 rounded-[8px] bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2 text-[#374151]">
            <Clock className="w-4 h-4 text-[#3B82F6]" />
            <span className="font-semibold">Estimated Time:</span>
          </div>
          <span className="font-bold text-[#3B82F6]">
            ~{estimatedMinutes} mins ({questionCount} questions × 3 mins)
          </span>
        </div>

        {/* Target Role Selector */}
        <div className="space-y-1.5">
          <label className="block text-[14px] font-semibold text-[#374151]">
            Target Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
          >
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
            <option value="QA Engineer">QA Engineer</option>
          </select>
        </div>

        {/* Begin Interview Button (Large Primary Button) */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full py-3 text-[15px] font-semibold justify-center shadow-md hover:shadow-lg"
          >
            <Play className="w-4 h-4 fill-white mr-2" />
            Begin Interview
          </Button>
        </div>
      </form>
    </div>
  );

  // If used as modal
  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
        <div className="animate-scale-up w-full max-w-[500px]">
          {cardContent}
        </div>
      </div>
    );
  }

  // If embedded directly on page
  return cardContent;
};

export default StartInterviewModal;
