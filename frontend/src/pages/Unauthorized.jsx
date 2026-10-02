// frontend/src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Access Restricted</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        You must be signed in to view this career dashboard.
      </p>
      <Link to="/login" className="btn-primary text-xs">
        <LogIn className="w-4 h-4" />
        Sign In
      </Link>
    </div>
  );
};

export default Unauthorized;
