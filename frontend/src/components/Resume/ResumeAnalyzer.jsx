// frontend/src/components/Resume/ResumeAnalyzer.jsx
import React, { useState, useEffect } from 'react';
import ResumeUpload from './ResumeUpload';
import AnalysisResults from './AnalysisResults';
import ResumeHistory from './ResumeHistory';
import { resumeService } from '../../services/resumeService';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const ResumeAnalyzer = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getHistory();
      if (res.success) {
        setResumes(res.resumes || []);
        if (res.resumes && res.resumes.length > 0 && !selectedResume) {
          // fetch details of latest
          const latest = await resumeService.getById(res.resumes[0].id);
          setSelectedResume(latest.resume);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUploadSuccess = (newResume) => {
    setResumes([newResume, ...resumes]);
    setSelectedResume(newResume);
  };

  const handleSelectResume = async (resumeSummary) => {
    try {
      const res = await resumeService.getById(resumeSummary.id);
      setSelectedResume(res.resume);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      await resumeService.delete(id);
      const filtered = resumes.filter(r => r.id !== id);
      setResumes(filtered);
      if (selectedResume?.id === id) {
        setSelectedResume(filtered.length > 0 ? filtered[0] : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          {loading ? (
            <LoadingSpinner size="sm" message="Loading history..." />
          ) : (
            <ResumeHistory
              resumes={resumes}
              selectedId={selectedResume?.id}
              onSelect={handleSelectResume}
              onDelete={handleDeleteResume}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedResume ? (
            <AnalysisResults resume={selectedResume} />
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <p className="font-medium text-sm">No resume selected for analysis.</p>
              <p className="text-xs mt-1">Upload a PDF resume on the left or select an earlier version.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
