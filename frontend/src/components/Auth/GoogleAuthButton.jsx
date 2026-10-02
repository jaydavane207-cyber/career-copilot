// frontend/src/components/Auth/GoogleAuthButton.jsx
import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * Google Sign-up / Sign-in Mockup Button Component
 * Renders a Google-branded CTA button and provides an interactive modal
 * explaining the MVP mock status with quick-action options.
 */
export const GoogleAuthButton = ({
  mode = 'signup',
  onUseDemo = null,
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);

  const buttonText = mode === 'signup' ? 'Sign up with Google' : 'Continue with Google';

  const handleClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${className}`}
      >
        {/* Google Official Multicolored G Logo */}
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{buttonText}</span>
        <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1">Mock</span>
      </button>

      {/* Interactive Mock Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Google OAuth (Mockup Mode)</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Google OAuth 2.0 integration is mocked for this MVP release. You can test complete platform capabilities right now using our standard form or 1-click demo!
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-5 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Production-ready JWT & Bcrypt Auth Active</span>
              </div>
              <p className="text-[11px] text-slate-500">
                You can create a real account via the Email/Password form with PostgreSQL database storage or use the instant demo account.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {onUseDemo && (
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    onUseDemo();
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Auto-Fill Demo Credentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Continue With Email/Password Form
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
