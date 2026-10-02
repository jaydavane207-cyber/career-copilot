// frontend/src/components/Auth/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Target, Sparkles, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ErrorMessage } from '../Common/ErrorMessage';
import { validateEmail, validatePassword } from '../../utils/validators';
import GoogleAuthButton from './GoogleAuthButton';

/**
 * SignUp Component
 * Provides complete user registration interface for Career Copilot:
 * - Google Sign-up Mockup CTA
 * - Email & Password registration form
 * - Real-time password validation (min 8 chars)
 * - Email validation
 * - Target Tech Role selection (focused on Indian tech ecosystem)
 */
export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password validation checklist checks
  const isPasswordLengthValid = password.length >= 8;
  const isEmailValid = validateEmail(email);

  /**
   * Handle form submission and user registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please provide a valid email address (e.g. yourname@example.com).');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Call register with name, email, password, and targetRole
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        targetRole
      });
      // Navigate to protected dashboard upon successful sign-up
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-fill demo account details for fast testing
   */
  const handleUseDemo = () => {
    setName('Priya Patel');
    setEmail(`priya_${Date.now()}@careercopilot.in`);
    setPassword('Password123!');
    setTargetRole('SDE-1 (Java & Spring Boot)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900 block leading-tight">Career Copilot</span>
            <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">Free Indian Tech Prep</span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Start accelerating your tech job preparation for top Indian startups & MNCs.
        </p>

        {/* Google Sign-up Mockup CTA */}
        <div className="mb-5">
          <GoogleAuthButton mode="signup" onUseDemo={handleUseDemo} />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
            Or sign up with email
          </span>
        </div>

        {/* Error Alert */}
        <ErrorMessage message={error} />

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${
                  email && !isEmailValid ? 'border-amber-400 focus:ring-amber-500' : 'border-slate-300 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 text-sm transition-all`}
              />
            </div>
            {email && !isEmailValid && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please enter a valid email address format
              </p>
            )}
          </div>

          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Role (Indian Tech Focus)
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="SDE-1 (Java & Spring Boot)">SDE-1 (Java & Spring Boot)</option>
                <option value="Full Stack Developer">Full Stack Developer (MERN / Next.js)</option>
                <option value="Backend Engineer">Backend Engineer (Node.js / Go / Python)</option>
                <option value="Frontend Engineer">Frontend Engineer (React / TypeScript)</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer (AWS / K8s)</option>
                <option value="Data Engineer">Data Engineer (PySpark / SQL / Airflow)</option>
                <option value="Machine Learning Engineer">Machine Learning / AI Engineer</option>
                <option value="Android Developer">Android Developer (Kotlin / Jetpack)</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Customizes your ATS resume checks and coding recommendations.
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
                  password && !isPasswordLengthValid ? 'border-amber-400 focus:ring-amber-500' : 'border-slate-300 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 text-sm transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Validation Indicator */}
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                  isPasswordLengthValid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Check className="w-3 h-3" />
              </div>
              <span
                className={`text-[11px] transition-colors ${
                  isPasswordLengthValid ? 'text-emerald-600 font-semibold' : 'text-slate-500'
                }`}
              >
                Minimum 8 characters {password.length > 0 && `(${password.length}/8)`}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all text-sm disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Creating Your Account...</span>
            ) : (
              <span>Sign Up Free</span>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
