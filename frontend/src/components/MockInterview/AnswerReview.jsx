// frontend/src/components/MockInterview/AnswerReview.jsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Lightbulb,
  Download,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { downloadInterviewPDF } from '../../utils/interviewPdfReport';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

export const AnswerReview = ({ session, onBackToResults, onRestart }) => {
  const questions = session?.answers || session?.questions || [];
  const [activeTab, setActiveTab] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8 text-center text-[14px] text-[#6B7280]">
        No question answers available for review.
      </div>
    );
  }

  const currentQ = questions[activeTab] || questions[0];
  const qConfidence = currentQ.confidence || 3;
  const expectedKeywords = currentQ.expectedKeywords || [];

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden max-w-[1100px] mx-auto space-y-6 p-6 sm:p-8 animate-fade-in">
      {/* Top Header Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <button
            onClick={onBackToResults}
            className="text-[13px] font-semibold text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results Summary
          </button>
          <h2 className="text-[24px] font-bold text-[#374151] tracking-[-0.5px]">
            Answer Review & Key Points
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            Review your submissions side-by-side with recommended answers and improvement tips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => downloadInterviewPDF(session)}
            className="flex items-center gap-1.5 text-[12px]"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          {onRestart && (
            <Button
              variant="secondary"
              onClick={onRestart}
              className="flex items-center gap-1.5 text-[12px]"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
          )}
        </div>
      </div>

      {/* 1. Tabbed Interface: Question 1, Question 2, ..., Question N */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E5E7EB] pb-px scrollbar-none">
        {questions.map((q, idx) => {
          const isActive = activeTab === idx;
          const isAnswered = q.userAnswer && q.userAnswer.trim().length > 0;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`h-[44px] px-4 font-semibold text-[14px] whitespace-nowrap transition-all border-b-[3px] flex items-center gap-2 ${
                isActive
                  ? 'border-[#3B82F6] text-[#3B82F6] bg-white'
                  : 'border-transparent text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]'
              }`}
            >
              <span>Question {idx + 1}</span>
              {isAnswered ? (
                <span className="w-2 h-2 rounded-full bg-[#10B981]" title="Answered" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#E5E7EB]" title="Unanswered" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current Question Meta & Title */}
      <div className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant="info">
            {currentQ.category || 'Core Question'}
          </Badge>
          <span className="text-[12px] text-[#6B7280]">
            Question {activeTab + 1} of {questions.length}
          </span>
        </div>
        <h3 className="text-[18px] font-bold text-[#374151] pt-1">
          {currentQ.question}
        </h3>
      </div>

      {/* 2. 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Your Answer + Confidence Rating */}
        <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BFDBFE]">
            <h4 className="text-[16px] font-bold text-[#1E3A8A]">
              Your Answer
            </h4>

            {/* Confidence Rating Stars */}
            <div className="flex items-center gap-1.5" title={`Confidence: ${qConfidence} of 5`}>
              <span className="text-[12px] font-semibold text-[#1E3A8A] mr-1">
                Confidence:
              </span>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= qConfidence
                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                      : 'text-[#93C5FD]'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentQ.userAnswer && currentQ.userAnswer.trim().length > 0 ? (
            <div className="text-[14px] text-[#1E3A8A] leading-[22px] whitespace-pre-wrap font-sans">
              {currentQ.userAnswer}
            </div>
          ) : (
            <p className="text-[13px] text-[#3B82F6] italic">
              No response recorded for this question during the simulation.
            </p>
          )}

          <div className="pt-2 text-[11px] text-[#1D4ED8]">
            Length: {(currentQ.userAnswer || '').trim().length} characters • {currentQ.userAnswer ? currentQ.userAnswer.trim().split(/\s+/).filter(Boolean).length : 0} words
          </div>
        </div>

        {/* Right Column: Sample Answer / Key Points to Include */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
            <h4 className="text-[16px] font-bold text-[#92400E]">
              Sample Answer & Key Points
            </h4>
            <span className="text-[11px] font-semibold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-[12px]">
              High-Scoring Rubric
            </span>
          </div>

          {/* Sample Model Answer */}
          <div className="text-[14px] text-[#78350F] leading-[22px] whitespace-pre-wrap font-sans">
            {(typeof currentQ.sampleAnswer === 'object' && currentQ.sampleAnswer !== null
              ? currentQ.sampleAnswer?.strongAnswer
              : currentQ.sampleAnswer) ||
              currentQ.strongAnswer ||
              currentQ.modelAnswer ||
              `A high-scoring answer explains the core mechanism, demonstrates real-world application, and balances pros and cons with measurable trade-offs. For behavioral questions, follow the STAR format (Situation, Task, Action, Result). For technical questions, highlight underlying complexity and memory constraints.`}
          </div>

          {/* Key Points to Include */}
          {expectedKeywords && expectedKeywords.length > 0 && (
            <div className="pt-3 border-t border-[#FDE68A] space-y-2">
              <h5 className="text-[12px] font-bold uppercase tracking-wider text-[#92400E]">
                Key Points to Include:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {expectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[16px] bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[12px] font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706]" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Tips Section Below: "How to improve this answer" in Yellow Card */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] p-6 rounded-[12px] space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#D97706] flex-shrink-0" />
          <h4 className="text-[16px] font-bold leading-tight">
            How to improve this answer
          </h4>
        </div>

        <div className="text-[14px] text-[#78350F] leading-[22px] space-y-2">
          <p>
            {currentQ.improvementTip ||
              (currentQ.category?.toLowerCase().includes('behav')
                ? 'Structure your response strictly into STAR segments: Situation (10%), Task (10%), Action (60%), and Result (20%). Quantify results with metrics (e.g., "reduced latency by 35%", "delivered 2 weeks ahead of deadline").'
                : 'State the highest-level concept first before diving into implementation details. Mention edge cases, throughput bottlenecks, or architectural compromises you chose to make.')}
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[13px]">
            <li>Emphasize measurable business or engineering impact rather than just tasks completed.</li>
            <li>Maintain clear, concise communication without overly verbose rambling.</li>
            <li>Conclude with what you learned and how you would iterate in production.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnswerReview;
