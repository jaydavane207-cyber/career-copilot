// frontend/src/components/Resume/ResumeUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { resumeService } from '../../services/resumeService';

export const ResumeUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Fullstack Developer');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const validateAndSet = (file) => {
    setError('');
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please select a PDF document.');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const response = await resumeService.upload(selectedFile, targetRole);
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess(response.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and analyze resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 text-lg mb-1">Upload Resume for ATS Screening</h3>
      <p className="text-xs text-slate-500 mb-5">
        Upload your existing PDF resume to analyze keyword densities, formatting, and ATS scoring.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role for Analysis</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
          </select>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Upload className="w-6 h-6" />
            </div>
            {selectedFile ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mt-2">
                <FileText className="w-4 h-4" />
                <span>{selectedFile.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-700">Click or drag & drop your resume PDF</p>
                <p className="text-xs text-slate-400">PDF documents up to 10MB</p>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          {uploading ? 'Analyzing Resume...' : 'Parse & Calculate ATS Score'}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;
