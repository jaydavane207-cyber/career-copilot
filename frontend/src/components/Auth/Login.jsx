// frontend/src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ErrorMessage } from '../Common/ErrorMessage';
import { validateEmail } from '../../utils/validators';
import GoogleAuthButton from './GoogleAuthButton';

/**
 * Login Component
 * Provides user sign-in functionality:
 * - Google Sign-in Mockup CTA
 * - Email & Password credentials authentication
 * - One-click demo credentials filling for rapid evaluation
 * - JWT storage and redirect to protected dashboard
 */
export const Login = () => {
  const [email, setEmail] = useState('demo@careercopilot.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  /**
   * Quick fill for demo account
   */
  const handleUseDemo = () => {
    setEmail('demo@careercopilot.io');
    setPassword('password123');
  };

  /**
   * Handle user login submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      // Redirect to the originally requested route or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
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

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Sign in to access your dashboard, ATS resume score, and tech job tracker.
        </p>

        {/* Google Sign-in Mockup CTA */}
        <div className="mb-5">
          <GoogleAuthButton mode="login" onUseDemo={handleUseDemo} />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
            Or sign in with email
          </span>
        </div>

        {/* Error Alert */}
        <ErrorMessage message={error} />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Helper Card */}
          <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-xl p-3 text-xs text-indigo-900 flex justify-between items-center">
            <div>
              <p className="font-semibold text-indigo-950">Pre-loaded Demo Account:</p>
              <p className="text-[11px] text-indigo-700">demo@careercopilot.io / password123</p>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-[11px] rounded-lg border border-indigo-200 transition-colors shadow-2xs"
            >
              Fill Demo
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all text-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Create free account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
