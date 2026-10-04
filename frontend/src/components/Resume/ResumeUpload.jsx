// frontend/src/components/Resume/ResumeUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { Button } from '../UI/Button';

export const ResumeUpload = ({ onUploadSuccess, currentUploadedResume, onResetResume, onContinue }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (file) => {
    setError('');
    if (!file) {
      setError('Please select a resume file to upload.');
      return false;
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Invalid file format. Only PDF documents (.pdf) are supported.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${sizeMb} MB) exceeds maximum allowed limit of 5MB.`);
      return false;
    }
    return true;
  };

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

  const handleUploadAndContinue = async () => {
    if (!selectedFile && !currentUploadedResume) {
      setError('Please select or drag a PDF resume first.');
      return;
    }

    // If already uploaded and no new file selected, just continue
    if (!selectedFile && currentUploadedResume) {
      if (onContinue) onContinue();
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
            id: response.resume?.id || response.resumeId,
            fileName: response.resume?.fileName || response.fileName || selectedFile.name,
            fileSize: selectedFile.size,
            extractedText: response.extractedText || response.resume?.extractedText,
            createdAt: new Date().toISOString()
          });
        }
        if (onContinue) onContinue();
      } else {
        setError(response.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.message || 'Error occurred while processing your PDF file.');
    } finally {
      setUploading(false);
    }
  };

  const activeResume = selectedFile
    ? {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024).toFixed(1)} KB`
      }
    : currentUploadedResume
    ? {
        name: currentUploadedResume.fileName || 'Uploaded_Resume.pdf',
        size: currentUploadedResume.fileSize ? `${(currentUploadedResume.fileSize / 1024).toFixed(1)} KB` : 'Verified PDF'
      }
    : null;

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="p-3.5 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-[8px] flex items-center gap-2.5 text-[#7F1D1D] text-[14px]">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!activeResume ? (
        /* Drag-drop area: Border: 2px dashed #3B82F6, Bg: #EBF5FF, Padding: 48px 32px */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-[12px] p-[48px_32px] text-center cursor-pointer transition-all duration-200
            flex flex-col items-center justify-center
            ${
              dragActive
                ? 'border-[#2563EB] bg-[#DBEAFE]'
                : 'border-[#3B82F6] bg-[#EBF5FF] hover:bg-[#DBEAFE]/60'
            }
          `}
        >
          {/* Document upload icon: 64px */}
          <div className="w-[64px] h-[64px] text-[#3B82F6] mb-4 flex items-center justify-center">
            <Upload className="w-[64px] h-[64px]" strokeWidth={1.75} />
          </div>
          <p className="text-[16px] font-semibold text-[#1E40AF]">
            Drag your resume here or click to select
          </p>
          <p className="text-[13px] text-[#6B7280] mt-1.5">
            Accepts PDF documents up to 5MB
          </p>
        </div>
      ) : (
        /* File preview (after upload/selection): Icon document, filename, file size, remove button */
        <div className="p-5 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#EBF5FF] text-[#3B82F6] flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-[#374151] truncate">
                {activeResume.name}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                {activeResume.size}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (onResetResume) onResetResume();
            }}
            className="p-2 text-[#6B7280] hover:text-[#EF4444] rounded-[8px] hover:bg-white transition-colors"
            title="Remove resume"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Submit button: "Continue" */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          onClick={handleUploadAndContinue}
          disabled={!activeResume || uploading}
          loading={uploading}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
