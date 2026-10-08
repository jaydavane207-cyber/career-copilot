// frontend/src/components/Gamification/NotificationBanner.jsx
import React, { useEffect, useState } from 'react';
import { Award, ArrowUpRight, TrendingUp, CheckCircle, X, Sparkles } from 'lucide-react';

export const NotificationBanner = ({
  notification,
  onClose,
  duration = 5000
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!notification) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [notification, duration, onClose]);

  if (!notification || !visible) return null;

  const { type = 'badge', title, message, points } = notification;

  const getIcon = () => {
    switch (type) {
      case 'badge':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'rank_up':
        return <ArrowUpRight className="w-5 h-5 text-emerald-500" />;
      case 'level_up':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'badge':
        return 'border-amber-400 bg-amber-50/95 text-amber-950';
      case 'rank_up':
        return 'border-emerald-400 bg-emerald-50/95 text-emerald-950';
      case 'level_up':
        return 'border-indigo-400 bg-indigo-50/95 text-indigo-950';
      case 'achievement':
        return 'border-blue-400 bg-blue-50/95 text-blue-950';
      default:
        return 'border-slate-300 bg-white text-slate-900';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-slide-in">
      <div className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${getBorderColor()} flex items-start gap-3`}>
        <div className="p-2 rounded-xl bg-white shadow-xs flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold tracking-tight">
              {title || 'Gamification Milestone!'}
            </h4>
            {points && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                +{points} pts
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-medium">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
