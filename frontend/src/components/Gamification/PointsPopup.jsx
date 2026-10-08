// frontend/src/components/Gamification/PointsPopup.jsx
import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

export const PointsPopup = ({ points = 50, label = 'Points Earned!', show = false, onComplete }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none animate-bounce">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-amber-200">
        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-amber-700 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-900 tracking-tight">
            +{points} Points!
          </div>
          <div className="text-[11px] font-semibold text-amber-950/80">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsPopup;
