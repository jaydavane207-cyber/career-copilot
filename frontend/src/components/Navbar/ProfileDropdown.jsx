// frontend/src/components/Navbar/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, ChevronDown, Sparkles, Calendar, ShieldCheck } from 'lucide-react';

/**
 * ProfileDropdown Component
 * Displays user identity in the navbar, including:
 * - User avatar initials
 * - Name, email, and targetRole
 * - Account creation date
 * - Sign Out button that invalidates JWT session
 */
export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.name || user.fullName || 'Job Seeker';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CC';

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      })
    : null;

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight">{displayName}</span>
          <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">
            {user.targetRole || 'Tech Aspirant'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
          {/* User Profile Header */}
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
          </div>

          {/* Target Role Tag */}
          <div className="mx-3 my-2 px-3 py-2 bg-indigo-50/80 rounded-xl text-[11px] text-indigo-700 font-medium flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Target Role</span>
              <span className="font-semibold text-indigo-900">{user.targetRole || 'Software Engineer'}</span>
            </div>
          </div>

          {/* Member Info */}
          {formattedDate && (
            <div className="px-4 py-1.5 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Prep started: {formattedDate}</span>
            </div>
          )}

          {/* Profile & Integrations Link */}
          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>Profile & Integrations</span>
            </button>
          </div>

          {/* Sign Out CTA */}
          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
