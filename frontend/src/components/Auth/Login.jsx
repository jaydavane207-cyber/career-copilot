// frontend/src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { validateEmail } from '../../utils/validators';
import GoogleAuthButton from './GoogleAuthButton';
import { Button } from '../UI/Button';
import { Input, Checkbox } from '../UI/FormControls';
import { ErrorMessage } from '../Common/ErrorMessage';

export const Login = () => {
  const [email, setEmail] = useState('demo@careercopilot.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleUseDemo = () => {
    setEmail('demo@careercopilot.io');
    setPassword('password123');
  };

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
      navigate(from, { replace: true });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-4 py-12">
      {/* Centered container, max width 400px */}
      <div className="w-full max-w-[400px] bg-white rounded-[12px] border border-[#E5E7EB] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Logo centered at top */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#3B82F6] flex items-center justify-center text-white mb-3 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
            Welcome back
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Sign in to continue to Career Copilot
          </p>
        </div>

        {/* Error Alert */}
        <ErrorMessage message={error} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2">
              Email Address <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2">
              Password <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#9CA3AF] hover:text-[#374151] focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-[14px]">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
            />
            <button
              type="button"
              onClick={() => alert('Password reset link sent to registered email.')}
              className="text-[#3B82F6] hover:underline font-medium text-[13px]"
            >
              Forgot password?
            </button>
          </div>

          {/* Demo account helper button */}
          <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-[8px] p-3 flex items-center justify-between text-[12px]">
            <div>
              <p className="font-semibold text-[#1E40AF]">Demo Credentials:</p>
              <p className="text-[#3B82F6]">demo@careercopilot.io / password123</p>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-[#3B82F6] font-semibold rounded-[6px] border border-[#BFDBFE] transition-colors"
            >
              Fill Demo
            </button>
          </div>

          {/* Primary Submit Button: "Sign in" */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-2"
          >
            Sign in
          </Button>
        </form>

        {/* Divider: "Or continue with" */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#E5E7EB] w-full" />
          <span className="bg-white px-3 text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider relative">
            Or continue with
          </span>
        </div>

        {/* Google sign-in button (gray) */}
        <div className="mb-6">
          <GoogleAuthButton mode="login" onUseDemo={handleUseDemo} />
        </div>

        {/* Footer: "Don't have account? Sign up" */}
        <div className="text-center text-[14px] text-[#6B7280]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#3B82F6] font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
