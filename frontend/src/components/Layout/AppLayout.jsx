// frontend/src/components/Layout/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Sparkles } from 'lucide-react';
import Avatar from '../UI/Avatar';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const displayName = user?.name || user?.fullName || 'User';

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col lg:flex-row text-[#374151] font-sans antialiased">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-[260px] z-30">
        <Sidebar />
      </div>

      {/* Mobile / Tablet Top Header with Hamburger */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="w-[44px] h-[44px] flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded-[8px] transition-colors"
          >
            <Menu className="w-[30px] h-[30px]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[#3B82F6] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[18px] font-bold text-[#3B82F6] tracking-[-0.5px]">
              Career Copilot
            </span>
          </div>
        </div>

        <Avatar name={displayName} size="sm" />
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[280px] max-w-[85%] bg-white h-full shadow-2xl z-10 animate-slide-in">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area: Padding 32px desktop, 20px tablet, 16px mobile, max width 1400px */}
      <main className="flex-1 lg:pl-[260px] flex flex-col min-h-screen min-w-0">
        <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-5 lg:p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
