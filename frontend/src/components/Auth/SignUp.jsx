// frontend/src/components/Auth/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/validators';
import GoogleAuthButton from './GoogleAuthButton';
import { Button } from '../UI/Button';
import { Checkbox } from '../UI/FormControls';
import { ErrorMessage } from '../Common/ErrorMessage';

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

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

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
      setError('You must agree to the Terms of Service to create an account.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        targetRole: 'Software Engineer'
      });
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
      {/* Centered container, max width 400px */}
      <div className="w-full max-w-[400px] bg-white rounded-[12px] border border-[#E5E7EB] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Logo centered at top */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#3B82F6] flex items-center justify-center text-white mb-3 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
            Create your account
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Join thousands of job seekers preparing for success
          </p>
        </div>

        {/* Error Alert */}
        <ErrorMessage message={error} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2">
              Full Name <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="input-field pl-11"
              />
            </div>
          </div>

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
                placeholder="alex@example.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          {/* Password with Strength Indicator */}
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
                placeholder="At least 8 characters"
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

            {/* Visual Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="w-full bg-[#F3F4F6] h-[6px] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className={`font-semibold ${strength.textColor}`}>
                    {strength.text}
                  </span>
                  <span className="text-[#6B7280]">Min. 8 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2">
              Confirm Password <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="input-field pl-11"
              />
            </div>
          </div>

          {/* I agree to terms checkbox */}
          <div>
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              label={
                <span className="text-[13px] text-[#374151]">
                  I agree to the{' '}
                  <span className="text-[#3B82F6] hover:underline cursor-pointer">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-[#3B82F6] hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                </span>
              }
            />
          </div>

          {/* Primary Button: "Create account" */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-2"
          >
            Create account
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#E5E7EB] w-full" />
          <span className="bg-white px-3 text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider relative">
            Or sign up with
          </span>
        </div>

        {/* Google sign-up button */}
        <div className="mb-6">
          <GoogleAuthButton mode="signup" />
        </div>

        {/* Footer: "Already have account? Sign in" */}
        <div className="text-center text-[14px] text-[#6B7280]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
