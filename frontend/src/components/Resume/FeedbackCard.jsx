// frontend/src/components/Resume/FeedbackCard.jsx
import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';

/**
 * FeedbackCard Component
 * Displays category score, feedback text, detected issues, and actionable suggestions
 */
export const FeedbackCard = ({
  title,
  score,
  feedback,
  issues = [],
  suggestions = [],
  currentVerbs = [],
  suggestedVerbs = [],
  found = [],
  missing = [],
  icon: Icon
}) => {
  // Score color formatting
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (val >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Title on left, Score on right */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <h4 className="text-lg font-semibold text-gray-900 tracking-tight">
              {title}
            </h4>
          </div>
          {score !== undefined && (
            <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(score)} flex items-center gap-1`}>
              <span>{score}</span>
              <span className="text-xs opacity-75">/100</span>
            </div>
          )}
        </div>

        {/* General Feedback Text */}
        {feedback && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {feedback}
          </p>
        )}

        {/* Extra: Current Verbs vs Suggested Verbs (for Action Verbs card) */}
        {(currentVerbs.length > 0 || suggestedVerbs.length > 0) && (
          <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3 text-xs border border-gray-100">
            {currentVerbs.length > 0 && (
              <div>
                <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Detected Verbs:
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentVerbs.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-mono">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {suggestedVerbs.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                  Power Alternatives:
                </span>
                <div className="flex flex-wrap gap-1">
                  {suggestedVerbs.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono font-medium">
                      +{v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extra: Metrics Found vs Missing (for Quantifiable Results card) */}
        {(found.length > 0 || missing.length > 0) && (
          <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3 text-xs border border-gray-100">
            {found.length > 0 && (
              <div>
                <span className="font-semibold text-green-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  Metrics Detected:
                </span>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 pl-1">
                  {found.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {missing.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="font-semibold text-amber-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Missing Metrics:
                </span>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 pl-1">
                  {missing.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Issues List (Red Bullets) */}
        {issues && issues.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              Identified Issues ({issues.length}):
            </h5>
            <ul className="space-y-1.5 pl-1">
              {issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions List (Blue Arrows) */}
        {suggestions && suggestions.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Recommendations:
            </h5>
            <ul className="space-y-1.5">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
