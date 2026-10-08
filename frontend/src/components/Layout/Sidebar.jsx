// frontend/src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../UI/Avatar';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  CalendarCheck,
  Code2,
  Mic,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Building2,
  Trophy,
  BookOpen,
  BarChart3,
  Zap,
  X
} from 'lucide-react';
import SubscriptionBadge from '../Subscription/SubscriptionBadge';

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analyzer', path: '/resume', icon: FileText },
  { name: 'Job Tracker', path: '/jobs', icon: Briefcase },
  { name: 'Skill Gap Matrix', path: '/skills', icon: Target },
  { name: 'Study Planner', path: '/study-plan', icon: CalendarCheck },
  { name: 'Coding Practice', path: '/coding', icon: Code2 },
  { name: 'Mock Interview', path: '/mock-interview', icon: Mic },
  { name: 'Company Prep', path: '/company-prep', icon: Building2 },
  { name: 'Success Stories', path: '/stories', icon: BookOpen },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Pricing & Plans', path: '/pricing', icon: Zap }
];

export const Sidebar = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const displayName = user?.name || user?.fullName || 'User';
  const targetRole = user?.targetRole || 'Software Engineer';

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-[260px] h-full flex flex-col justify-between bg-white border-r border-[#E5E7EB] select-none">
      {/* Top Section */}
      <div className="p-4 flex flex-col">
        {/* Logo Header */}
        <div className="flex items-center justify-between pb-8">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-[#3B82F6] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold text-[#3B82F6] tracking-[-0.5px] leading-tight">
                Career Copilot
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium tracking-wide uppercase">
                AI Career Acceleration
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#6B7280] hover:text-[#374151] rounded-lg hover:bg-[#F3F4F6]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-[8px] flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-[16px] py-[12px] h-[44px] rounded-[8px] text-[14px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#EBF5FF] text-[#3B82F6]'
                      : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`
                }
              >
                <Icon className="w-[20px] h-[20px] flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t border-[#E5E7EB] bg-white relative">
        {/* User Card Trigger */}
        <button
          type="button"
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[#F3F4F6] transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={displayName} size="sidebar" />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#374151] truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-[#6B7280] truncate leading-tight mt-0.5">
                {targetRole}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#6B7280] flex-shrink-0 transition-transform ${
              userDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* User Quick Actions Menu */}
        {userDropdownOpen && (
          <div className="mt-2 pt-2 border-t border-[#E5E7EB] space-y-1 animate-fade-in">
            <div className="px-3 py-1.5 flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280] font-semibold">Tier</span>
              <SubscriptionBadge tier={user?.subscriptionTier} showUpgradeLink={true} />
            </div>
            <button
              type="button"
              onClick={() => {
                setUserDropdownOpen(false);
                navigate('/pricing');
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-[6px] transition-colors"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Upgrade / Manage Plan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserDropdownOpen(false);
                navigate('/dashboard');
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[6px] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#6B7280]" />
              <span>Profile Settings</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] rounded-[6px] transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#EF4444]" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
