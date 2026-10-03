// frontend/src/components/Resume/ResumeUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp, FileCheck } from 'lucide-react';
import { resumeService } from '../../services/resumeService';

/**
 * ResumeUpload component:
 * Handles drag-and-drop / file selection, validates max 5MB and .pdf format,
 * uploads to server to extract text via pdfjs-dist, and displays extracted feedback.
 */
export const ResumeUpload = ({ onUploadSuccess, currentUploadedResume, onResetResume }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Maximum allowed file size: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  /**
   * Validates file size (max 5MB) and PDF format
   * @param {File} file
   * @returns {boolean}
   */
  const validateFile = (file) => {
    setError('');

    if (!file) {
      setError('Please select a resume file to upload.');
      return false;
    }

    // 1. PDF format check (.pdf extension and application/pdf mime type)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Invalid file format. Only PDF documents (.pdf) are supported.');
      return false;
    }

    // 2. File size validation (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${sizeMb} MB) exceeds maximum allowed limit of 5MB. Please choose a smaller PDF.`);
      return false;
    }

    return true;
  };

  // Drag-and-drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setSelectedFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const chosenFile = e.target.files[0];
      if (validateFile(chosenFile)) {
        setSelectedFile(chosenFile);
      }
    }
  };

  // Handle uploading PDF and parsing text
  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF resume file to upload.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const response = await resumeService.upload(selectedFile);
      if (response.success) {
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess({
            id: response.resumeId || response.resume?.id,
            fileName: response.fileName || selectedFile.name,
            extractedText: response.extractedText,
            resume: response.resume
          });
        }
      } else {
        setError(response.message || 'Failed to extract text from resume.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to upload and parse resume. Please ensure the file is a valid PDF.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            1. Upload Your Resume PDF
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Extracts keywords and structural sections automatically. Max 5MB PDF.
          </p>
        </div>
        {currentUploadedResume && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resume Ready
          </span>
        )}
      </div>

      {/* Error alert message */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Upload Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Already uploaded resume card */}
      {currentUploadedResume && !selectedFile && (
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                PDF
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 truncate max-w-xs">
                  {currentUploadedResume.fileName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Text extracted & ready for job analysis
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetResume}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-md hover:bg-white transition-colors"
            >
              Replace
            </button>
          </div>

          {/* Toggle extracted text preview */}
          {currentUploadedResume.extractedText && (
            <div className="pt-2 border-t border-indigo-100">
              <button
                type="button"
                onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
              >
                {showExtractedPreview ? (
                  <>Hide Extracted Text <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Preview Extracted Text ({currentUploadedResume.extractedText.length} chars) <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>

              {showExtractedPreview && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-indigo-100 text-[11px] text-slate-600 font-mono max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {currentUploadedResume.extractedText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {(!currentUploadedResume || selectedFile) && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50/70 bg-slate-50/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
              <Upload className="w-6 h-6" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="truncate max-w-xs">{selectedFile.name}</span>
                  <span className="text-[10px] text-indigo-500 font-normal">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-0.5 hover:bg-indigo-200 rounded text-indigo-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Click button below to parse resume</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">
                  Drag & drop your resume PDF here, or <span className="text-indigo-600 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400">
                  Only PDF documents (.pdf) up to 5MB supported
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action button if file is selected but not yet uploaded */}
      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Extracting PDF Text with pdfjs-dist...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload & Extract Resume Text</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ResumeUpload;
