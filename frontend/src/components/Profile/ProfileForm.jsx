// frontend/src/components/Profile/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Target,
  FileText,
  Briefcase,
  Code2,
  GraduationCap,
  Sparkles,
  Check,
  RefreshCw,
  Trash2,
  Plus,
  ShieldCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { oauthService } from '../../services/oauthService';
import ExperiencePreview, { LinkedInIcon } from './ExperiencePreview';
import RepositoriesDisplay, { GitHubIcon } from './RepositoriesDisplay';
import ImportDataModal from '../Auth/ImportDataModal';

/**
 * ProfileForm Component
 * Comprehensive profile management page integrating manual editing with automated
 * LinkedIn and GitHub imports, work experience preview, and OAuth connection management.
 */
export const ProfileForm = () => {
  const { user, updateUser } = useAuth();

  // Basic Info Form State
  const [name, setName] = useState(user?.name || user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Career Section Arrays
  const [experiences, setExperiences] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);

  // UI Status States
  const [oauthStatus, setOauthStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProvider, setModalProvider] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(null);
  const [bannerMessage, setBannerMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New Skill Input state
  const [newSkillName, setNewSkillName] = useState('');

  // Sync state when user context changes
  useEffect(() => {
    if (user) {
      setName(user.name || user.fullName || '');
      setEmail(user.email || '');
      setTargetRole(user.targetRole || 'Full Stack Developer');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  // Load OAuth account status & stored profiles on mount
  const loadStatus = async () => {
    try {
      const res = await oauthService.getOAuthStatus();
      if (res.success) {
        setOauthStatus(res);
      }
    } catch (e) {
      // Ignore initial status errors
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  /**
   * Handle incoming data confirmed from ImportDataModal
   */
  const handleImportSuccess = (imported) => {
    if (imported.profile) {
      if (imported.profile.name) setName(imported.profile.name);
      if (imported.profile.firstName && !imported.profile.name) {
        setName(`${imported.profile.firstName} ${imported.profile.lastName || ''}`.trim());
      }
      if (imported.profile.headline && targetRole === 'Full Stack Developer') {
        setTargetRole(imported.profile.headline.split('|')[0].trim());
      }
      if (imported.profile.summary || imported.profile.bio) {
        setBio(imported.profile.summary || imported.profile.bio);
      }
      if (imported.profile.profilePicture || imported.profile.avatarUrl) {
        setAvatarUrl(imported.profile.profilePicture || imported.profile.avatarUrl);
      }
    }

    if (imported.workExperience && imported.workExperience.length > 0) {
      setExperiences((prev) => [...imported.workExperience, ...prev]);
    }

    if (imported.repositories && imported.repositories.length > 0) {
      setRepositories((prev) => [...imported.repositories, ...prev]);
    }

    if (imported.education && imported.education.length > 0) {
      setEducation((prev) => [...imported.education, ...prev]);
    }

    if (imported.skills && imported.skills.length > 0) {
      const newSkills = imported.skills.map((s) => (typeof s === 'string' ? s : s.name));
      setSkills((prev) => Array.from(new Set([...prev, ...newSkills])));
    }

    const providerTitle = imported.provider === 'linkedin' ? 'LinkedIn' : 'GitHub';
    setBannerMessage(`Imported from ${providerTitle} on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    loadStatus();
  };

  /**
   * Add a custom skill to tag list
   */
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const clean = newSkillName.trim();
    if (!skills.includes(clean)) {
      setSkills([...skills, clean]);
    }
    setNewSkillName('');
  };

  /**
   * Remove a skill tag
   */
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  /**
   * Remove work experience card
   */
  const handleDeleteExperience = (idx) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  /**
   * Remove repository card
   */
  const handleDeleteRepository = (idx) => {
    setRepositories(repositories.filter((_, i) => i !== idx));
  };

  /**
   * Refresh provider credentials
   */
  const handleRefresh = async (provider) => {
    setRefreshing(provider);
    setErrorMsg('');
    try {
      const res = await oauthService.refreshImportedData(provider);
      if (res.success && res.updatedData) {
        handleImportSuccess({
          provider,
          ...res.updatedData
        });
        setSuccessMsg(`Refreshed data from ${provider === 'linkedin' ? 'LinkedIn' : 'GitHub'}!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      setErrorMsg(`Failed to refresh ${provider}: ${e.message}`);
    } finally {
      setRefreshing(null);
    }
  };

  /**
   * Disconnect an OAuth account
   */
  const handleDisconnect = async (provider) => {
    if (!window.confirm(`Are you sure you want to disconnect ${provider}?`)) return;
    try {
      await oauthService.disconnectOAuth(provider);
      loadStatus();
      setSuccessMsg(`Disconnected ${provider} account.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErrorMsg(`Failed to disconnect: ${e.message}`);
    }
  };

  /**
   * Save whole profile to backend
   */
  const handleSaveProfile = async (e) => {
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
        targetRole,
        bio,
        avatarUrl
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setSuccessMsg('Profile updated and saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Title & Import Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Professional Profile & Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal bio, target engineering track, verified experience, and linked accounts.
          </p>
        </div>

        {/* Quick Import Modal Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setModalProvider(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Import from LinkedIn / GitHub</span>
        </button>
      </div>

      {/* Imported Banner Alert */}
      {bannerMessage && (
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-indigo-600" />
            <span>✓ {bannerMessage}</span>
          </div>
          <button
            onClick={() => setBannerMessage('')}
            className="text-indigo-400 hover:text-indigo-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Success / Error Notifications */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Connected Accounts Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* LinkedIn Connection Card */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <LinkedInIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">LinkedIn</span>
                {oauthStatus?.linkedIn?.connected ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.2 rounded-full">
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                    Not connected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                {oauthStatus?.linkedIn?.connected
                  ? `Refreshed ${new Date(oauthStatus.linkedIn.lastRefreshed).toLocaleDateString()}`
                  : 'Import work experience & skills'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {oauthStatus?.linkedIn?.connected ? (
              <>
                <button
                  type="button"
                  disabled={refreshing === 'linkedin'}
                  onClick={() => handleRefresh('linkedin')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Refresh LinkedIn data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing === 'linkedin' ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDisconnect('linkedin')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Disconnect LinkedIn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setModalProvider('linkedin');
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0A66C2] hover:bg-blue-100 text-xs font-bold transition-colors"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* GitHub Connection Card */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24292F] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <GitHubIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">GitHub</span>
                {oauthStatus?.gitHub?.connected ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.2 rounded-full">
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                    Not connected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                {oauthStatus?.gitHub?.connected
                  ? `Refreshed ${new Date(oauthStatus.gitHub.lastRefreshed).toLocaleDateString()}`
                  : 'Import open-source repos & stats'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {oauthStatus?.gitHub?.connected ? (
              <>
                <button
                  type="button"
                  disabled={refreshing === 'github'}
                  onClick={() => handleRefresh('github')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Refresh GitHub data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing === 'github' ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDisconnect('github')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Disconnect GitHub"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setModalProvider('github');
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Tech Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
              >
                <option value="Full Stack Developer">Full Stack Developer (MERN / Next.js)</option>
                <option value="SDE-1 (Java & Spring Boot)">SDE-1 (Java & Spring Boot)</option>
                <option value="Backend Engineer">Backend Engineer (Node.js / Python / Go)</option>
                <option value="Frontend Engineer">Frontend Engineer (React / TypeScript)</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer (AWS / K8s)</option>
                <option value="Machine Learning Engineer">Machine Learning / AI Engineer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Summary / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your professional background, focus areas, and aspirations..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs resize-none"
            />
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Work Experience ({experiences.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalProvider('linkedin');
                setIsModalOpen(true);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import from LinkedIn</span>
            </button>
          </div>

          <ExperiencePreview
            experiences={experiences}
            onDelete={handleDeleteExperience}
          />
        </div>

        {/* GitHub Repositories Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Showcase Repositories ({repositories.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalProvider('github');
                setIsModalOpen(true);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import from GitHub</span>
            </button>
          </div>

          <RepositoriesDisplay
            repositories={repositories}
            onDelete={handleDeleteRepository}
          />
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Skills & Technologies ({skills.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Click × to remove</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-indigo-400 hover:text-indigo-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Quick Add Skill Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add skill (e.g., Docker, GraphQL)..."
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs flex-1 max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Form Submission Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Import Data Modal */}
      <ImportDataModal
        isOpen={isModalOpen}
        preferredProvider={modalProvider}
        onClose={() => setIsModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default ProfileForm;
