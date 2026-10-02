// frontend/src/components/Navbar/Navbar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProfileDropdown from './ProfileDropdown';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  CalendarCheck,
  Code2,
  Mic,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Job Tracker', path: '/jobs', icon: Briefcase },
    { name: 'Skill Gap', path: '/skills', icon: Target },
    { name: 'Study Plan', path: '/study-plan', icon: CalendarCheck },
    { name: 'Coding', path: '/coding', icon: Code2 },
    { name: 'Mock Interview', path: '/mock-interview', icon: Mic }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">Career Copilot</span>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">AI Preparation</span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* Auth Action */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
