// frontend/src/components/Company/StartPreparationFlow.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Zap,
  Sparkles,
  Layers,
  Users,
  Code
} from 'lucide-react';
import companyService from '../../services/companyService';

export const StartPreparationFlow = ({ company, isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Senior Software Engineer');
  // Default interview date: 30 days from now
  const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [interviewDate, setInterviewDate] = useState(defaultDate);
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen || !company) return null;

  const roles = [
    { title: 'Senior Software Engineer', desc: 'System design, high-scale architecture & leadership' },
    { title: 'SDE', desc: 'Core DSA, low-level design, and algorithmic rigor' },
    { title: 'Frontend Engineer', desc: 'Web performance, React internals & component design' },
    { title: 'Product Manager', desc: 'Product sense, execution, metrics & stakeholder strategy' },
    { title: 'Data Scientist', desc: 'ML models, statistical inference & data pipelines' }
  ];

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const target = new Date(interviewDate);
    const today = new Date();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const daysRemaining = calculateDaysRemaining();

  const handleStartPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await companyService.startPreparation(company.id, role, interviewDate);
      if (res.success) {
        setPlanResult(res);
        setStep(4);
        if (onComplete) {
          onComplete(res);
        }
      }
    } catch (err) {
      console.error('Failed to start preparation:', err);
      setError(err.message || 'Failed to initialize preparation plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header with Step Progress */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Prepare for {company.name}
              </h2>
              <span className="text-xs text-gray-500">
                Step {step} of 4 • Personalized Interview Roadmap
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full h-1 bg-gray-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* STEP 1: Select Role */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Select your target role at {company.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  We'll customize questions, evaluation rubrics, and salary intelligence for this position.
                </p>
              </div>

              <div className="space-y-2.5">
                {roles.map((r) => (
                  <div
                    key={r.title}
                    onClick={() => setRole(r.title)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      role === r.title
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{r.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    </div>
                    {role === r.title && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Set Interview Date */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  When is your upcoming interview?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Setting your timeline helps us calibrate your daily practice velocity and mock review pacing.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <label className="text-xs font-semibold text-gray-700 block">
                  Interview Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={interviewDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-xs text-blue-900">
                  <span className="font-bold">You have {daysRemaining} days to prepare!</span>
                  <p className="text-gray-600 mt-0.5">
                    {daysRemaining >= 21
                      ? 'Ample time for comprehensive system design and STAR behavioral mastery.'
                      : daysRemaining >= 10
                      ? 'Accelerated sprint: We recommend focusing heavily on top high-frequency questions.'
                      : 'Final countdown: Focus on mock interviews and company core values.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Personalized Plan Preview */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Your Customized Roadmap for {company.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calibrated specifically for {role} over your {daysRemaining}-day prep window.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Questions to Practice</span>
                  <p className="text-lg font-extrabold text-blue-600">
                    {daysRemaining >= 25 ? '20' : daysRemaining >= 14 ? '15' : '10'} Questions
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Mock Interviews</span>
                  <p className="text-lg font-extrabold text-indigo-600">
                    {daysRemaining >= 25 ? '4' : '3'} Full Loops
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Estimated Effort</span>
                  <p className="text-lg font-extrabold text-gray-900">
                    ~{daysRemaining >= 25 ? '120' : '80'} Hours
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Timeline</span>
                  <p className="text-lg font-extrabold text-emerald-600">
                    {Math.max(1, Math.ceil(daysRemaining / 7))} Weeks
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Focus Pillars:
                </span>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Company-specific high-frequency System Design questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>STAR behavioral frameworks mapped to {company.name} values</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Timed algorithmic coding with complexity constraints</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-gray-900">
                  Preparation Plan Activated!
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                  Your personalized study schedule for {company.name} ({role}) is ready. We'll track your readiness score as you practice.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Role:</span>
                  <span className="font-bold text-gray-900">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interview Date:</span>
                  <span className="font-bold text-gray-900">{interviewDate} ({daysRemaining} days away)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Readiness:</span>
                  <span className="font-bold text-blue-600">15% Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleStartPlan}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              {loading ? (
                <span>Activating Plan...</span>
              ) : (
                <>
                  <span>Activate Preparation Plan</span>
                  <Zap className="w-4 h-4 fill-white" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              Start Practicing Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default StartPreparationFlow;
