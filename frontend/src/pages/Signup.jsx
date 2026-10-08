// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Mail,
  Lock,
  User,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Code2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validators';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';
import ImportDataModal from '../components/Auth/ImportDataModal';
import { LinkedInIcon } from '../components/Profile/ExperiencePreview';
import { GitHubIcon } from '../components/Profile/RepositoriesDisplay';

/**
 * Calculates password strength percentage:
 * Weak (red): 0-33%
 * Fair (orange): 34-66%
 * Strong (green): 67-100%
 */
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, text: '', color: 'bg-transparent' };
  let score = 0;
  if (pwd.length >= 8) score += 35;
  if (/[A-Z]/.test(pwd)) score += 20;
  if (/[0-9]/.test(pwd)) score += 25;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

  score = Math.min(100, score);

  if (score <= 33) {
    return { score, text: 'Weak password', color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' };
  }
  if (score <= 66) {
    return { score, text: 'Fair password', color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' };
  }
  return { score, text: 'Strong password', color: 'bg-[#10B981]', textColor: 'text-[#10B981]' };
};

/**
 * 4-Step Signup Page with Feature 3 LinkedIn/GitHub OAuth Quick Setup
 * Steps:
 * 1. Basic Info (Email, Password, Confirm Password)
 * 2. Personal Info (Full Name, Target Role)
 * 3. Quick Setup (Import from LinkedIn / GitHub / Skip)
 * 4. Review & Account Creation
 */
export const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Step 2: Personal Info
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');

  // Step 3: Imported Data Payload
  const [importedData, setImportedData] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [modalProvider, setModalProvider] = useState(null);

  // Status and submission states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  /**
   * Validate Step 1 (Basic Info)
   */
  const handleNextStep1 = (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to proceed.');
      return;
    }

    setCurrentStep(2);
  };

  /**
   * Validate Step 2 (Personal Info)
   */
  const handleNextStep2 = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setCurrentStep(3);
  };

  /**
   * Handle incoming imported data from modal in Step 3
   */
  const handleImportSuccess = (data) => {
    setImportedData(data);
    if (data.profile?.name && !name.trim()) {
      setName(data.profile.name);
    }
    if (data.profile?.headline && targetRole === 'Full Stack Developer') {
      setTargetRole(data.profile.headline.split('|')[0].trim());
    }
    setIsImportModalOpen(false);
    setCurrentStep(4);
  };

  /**
   * Final Account Creation Submit
   */
  const handleCreateAccount = async () => {
    setError('');
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        targetRole
      });

      // If imported data is available, store in localStorage or sync
      if (importedData) {
        try {
          localStorage.setItem('career_copilot_imported_profile', JSON.stringify(importedData));
        } catch (e) {
          // ignore
        }
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-[520px] bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
        {/* Logo and Wizard Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-3 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Create your account
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Join thousands of job seekers speeding up their career preparation
          </p>

          {/* 4-Step Progress Indicator Bar */}
          <div className="flex items-center justify-between w-full mt-6 px-2">
            {[1, 2, 3, 4].map((stepNum) => {
              const isPast = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <div key={stepNum} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-2xs ring-4 ring-indigo-50'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 rounded transition-all ${
                        isPast ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full flex justify-between text-[11px] font-semibold text-slate-400 mt-1.5 px-1">
            <span className={currentStep === 1 ? 'text-indigo-600 font-bold' : ''}>Basic Info</span>
            <span className={currentStep === 2 ? 'text-indigo-600 font-bold' : ''}>Personal</span>
            <span className={currentStep === 3 ? 'text-indigo-600 font-bold' : ''}>Import</span>
            <span className={currentStep === 4 ? 'text-indigo-600 font-bold' : ''}>Review</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* =========================================================================
            STEP 1: BASIC CREDENTIALS
           ========================================================================= */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-semibold ${strength.textColor}`}>{strength.text}</span>
                    <span className="text-slate-400">Min. 8 characters</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600">
                I agree to the{' '}
                <span className="text-indigo-600 font-semibold hover:underline">Terms of Service</span>{' '}
                and{' '}
                <span className="text-indigo-600 font-semibold hover:underline">Privacy Policy</span>.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Continue to Personal Info</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">
                Or
              </span>
            </div>

            <GoogleAuthButton mode="signup" />

            <div className="text-center text-xs text-slate-500 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 2: PERSONAL INFO
           ========================================================================= */}
        {currentStep === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Role Track
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
              >
                <option value="Full Stack Developer">Full Stack Developer (MERN / Next.js)</option>
                <option value="SDE-1 (Java & Spring Boot)">SDE-1 (Java & Spring Boot)</option>
                <option value="Backend Engineer">Backend Engineer (Node.js / Python / Go)</option>
                <option value="Frontend Engineer">Frontend Engineer (React / TypeScript)</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer (AWS / K8s)</option>
                <option value="Machine Learning Engineer">Machine Learning / AI Engineer</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                We'll personalize algorithmic tracks and mock interviews around this role.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue to Quick Setup</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 3: QUICK SETUP (FEATURE 3: LINKEDIN / GITHUB INTEGRATION)
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Speed up your profile setup
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Save 10 minutes of manual typing by importing your work history, education, and repositories.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {/* Import from LinkedIn Button */}
              <button
                type="button"
                onClick={() => {
                  setModalProvider('linkedin');
                  setIsImportModalOpen(true);
                }}
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-[#0A66C2] bg-white hover:bg-blue-50/20 transition-all flex items-center justify-between shadow-2xs group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <LinkedInIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0A66C2] transition-colors">
                      Import from LinkedIn
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Work history, education, skills, and endorsements
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Import from GitHub Button */}
              <button
                type="button"
                onClick={() => {
                  setModalProvider('github');
                  setIsImportModalOpen(true);
                }}
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 transition-all flex items-center justify-between shadow-2xs group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#24292F] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <GitHubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                      Import from GitHub
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Public repos, top languages, and commit stats
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>You can review and edit all fields before saving.</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Skip for now →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: REVIEW & ACCOUNT CREATION
           ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Review your profile details
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Everything looks ready! Confirm below to launch your Career Copilot workspace.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Account Details
                </span>
                <span className="text-[11px] text-indigo-600 font-bold">
                  {targetRole}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900 text-sm">{name}</p>
                <p className="text-slate-500">{email}</p>
              </div>

              {/* Imported Data Summary Pill */}
              {importedData ? (
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Imported from {importedData.provider === 'linkedin' ? 'LinkedIn' : 'GitHub'}</span>
                  </span>
                  {importedData.workExperience?.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {importedData.workExperience.length} experiences
                    </span>
                  )}
                  {importedData.repositories?.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {importedData.repositories.length} repositories
                    </span>
                  )}
                  {importedData.skills?.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {importedData.skills.length} skills
                    </span>
                  )}
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 italic">
                  Manual setup (you can connect LinkedIn/GitHub anytime in settings).
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleCreateAccount}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating your account...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Complete & Create Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reusable Import Data Modal */}
      <ImportDataModal
        isOpen={isImportModalOpen}
        preferredProvider={modalProvider}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default Signup;
