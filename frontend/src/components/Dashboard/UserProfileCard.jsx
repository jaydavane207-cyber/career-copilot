// frontend/src/components/Dashboard/UserProfileCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import {
  User,
  Target,
  Mail,
  Calendar,
  Edit2,
  Check,
  X,
  Sparkles,
  Award
} from 'lucide-react';

/**
 * UserProfileCard Component
 * Displays user identity on the dashboard and integrates directly with
 * the backend GET/POST /api/user endpoints to allow in-place profile updates.
 */
export const UserProfileCard = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || user?.fullName || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) return null;

  const displayName = user.name || user.fullName || 'Career Aspirant';
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Recently';

  /**
   * Save updated profile via POST /api/user
   */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await userService.updateUserProfile({
        name: name.trim(),
        targetRole
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || user?.fullName || '');
    setTargetRole(user?.targetRole || 'Full Stack Developer');
    setIsEditing(false);
    setErrorMsg('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden">
      {/* Accent Background Gradient */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-indigo-50 via-white to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        {/* User Identity Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl uppercase shadow-md shadow-indigo-100 flex-shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Active Aspirant
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50/70 px-2 py-0.5 rounded-md">
                <Target className="w-3.5 h-3.5" />
                {user.targetRole || 'Software Engineer'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Joined: {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all self-start sm:self-center"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Success notification banner */}
      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Inline Profile Editor Form (POST /api/user) */}
      {isEditing && (
        <form onSubmit={handleSave} className="mt-6 pt-5 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white cursor-pointer"
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
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating...' : 'Save Profile (POST /api/user)'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileCard;
