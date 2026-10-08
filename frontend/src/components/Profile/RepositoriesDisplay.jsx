// frontend/src/components/Profile/RepositoriesDisplay.jsx
import React from 'react';
import { Star, GitFork, ExternalLink, Trash2, Edit3, CheckCircle2, Code } from 'lucide-react';

/**
 * GitHub Brand SVG Icon
 */
export const GitHubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LANGUAGE_COLORS = {
  JavaScript: 'bg-yellow-400 text-yellow-900',
  TypeScript: 'bg-blue-500 text-white',
  Python: 'bg-emerald-500 text-white',
  Java: 'bg-orange-500 text-white',
  'C++': 'bg-pink-500 text-white',
  Go: 'bg-cyan-500 text-white',
  Rust: 'bg-amber-600 text-white',
  Ruby: 'bg-red-500 text-white',
  HTML: 'bg-orange-600 text-white',
  CSS: 'bg-indigo-500 text-white'
};

/**
 * RepositoriesDisplay Component
 * Displays imported or selected GitHub public repositories
 */
export const RepositoriesDisplay = ({ repositories = [], onEdit, onDelete }) => {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <Code className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-600">No repositories added yet</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Import from GitHub to showcase your top open-source projects and code samples.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {repositories.map((repo, idx) => {
        const langBadgeClass = LANGUAGE_COLORS[repo.language] || 'bg-slate-200 text-slate-700';

        return (
          <div
            key={repo.id || idx}
            className="p-4 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between group relative"
          >
            <div>
              {/* Header: Title and external link */}
              <div className="flex items-start justify-between gap-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 group-hover:underline transition-colors truncate"
                >
                  <GitHubIcon className="w-4 h-4 text-slate-800 flex-shrink-0" />
                  <span className="truncate">{repo.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </a>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(repo, idx)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit repo summary"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(idx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Remove repo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {repo.description || 'Public repository on GitHub.'}
              </p>

              {/* Topics Pills */}
              {Array.isArray(repo.topics) && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {repo.topics.slice(0, 4).map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      #{topic}
                    </span>
                  ))}
                  {repo.topics.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{repo.topics.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer Stats and Import Badge */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                {repo.language && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${langBadgeClass}`}>
                    {repo.language}
                  </span>
                )}
                {typeof repo.stars === 'number' && (
                  <span className="flex items-center gap-1 text-slate-600 font-medium text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{repo.stars}</span>
                  </span>
                )}
                {typeof repo.forks === 'number' && repo.forks > 0 && (
                  <span className="flex items-center gap-1 text-slate-400 text-xs">
                    <GitFork className="w-3 h-3" />
                    <span>{repo.forks}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <span>Imported</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RepositoriesDisplay;
