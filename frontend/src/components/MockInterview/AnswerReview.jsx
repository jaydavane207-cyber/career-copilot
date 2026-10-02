// frontend/src/components/MockInterview/AnswerReview.jsx
import React from 'react';

export const AnswerReview = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h4 className="text-sm font-bold text-slate-900">Detailed Question & Key Concepts Review</h4>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h5 className="font-bold text-slate-900">{idx + 1}. {q.question}</h5>
            <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 text-[11px] text-indigo-900">
              <span className="font-bold">Key technical concepts expected: </span>
              {q.expectedKeywords ? q.expectedKeywords.join(', ') : 'Fundamental trade-offs'}
            </div>
            {q.userResponse && (
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <span className="font-semibold text-slate-700">Your answer: </span>
                {q.userResponse}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerReview;
