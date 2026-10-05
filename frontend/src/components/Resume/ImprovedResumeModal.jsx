// frontend/src/components/Resume/ImprovedResumeModal.jsx
import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  FileText
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';

/**
 * ImprovedResumeModal Component
 * Shows AI-generated improved resume version with Copy & Download actions
 */
export const ImprovedResumeModal = ({
  isOpen,
  onClose,
  improvedResume = '',
  resumeId
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && improvedResume) {
        await navigator.clipboard.writeText(improvedResume);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      if (resumeId) {
        await resumeService.downloadImprovedResume(resumeId);
      } else {
        // Fallback client-side file download
        const blob = new Blob([improvedResume], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'improved-resume.txt');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download resume text:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Your Improved Resume
              </h2>
              <p className="text-xs text-gray-500">
                Rewritten with power verbs, quantified metrics, and optimized executive phrasing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/40">
          {improvedResume ? (
            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-xs">
              <pre className="font-mono text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed select-text font-normal font-sans">
                {improvedResume}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-base font-semibold text-gray-700">No improved resume generated yet</p>
              <p className="text-sm mt-1">Click "Get Improved Resume" in the AI feedback panel to generate one.</p>
            </div>
          )}
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 hidden sm:block">
            {copied ? (
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Copied to clipboard!
              </span>
            ) : (
              'Ready to paste into Word, Google Docs, or markdown editor'
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!improvedResume}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold border flex items-center gap-2 transition-all ${
                copied
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!improvedResume || downloading}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download as Text'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedResumeModal;
