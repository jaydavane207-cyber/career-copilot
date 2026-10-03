// frontend/src/components/JobTracker/KanbanBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import JobCard from './JobCard';
import JobStats from './JobStats';
import JobModal from './JobModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { jobService } from '../../services/jobService';
import { KANBAN_COLUMNS } from '../../utils/constants';
import { Plus, Search, Filter, RefreshCw, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import Toast from '../Common/Toast';

export const KanbanBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialStageForNew, setInitialStageForNew] = useState('applied');

  // Toast notifications
  const { toast, showToast, hideToast } = useToast();

  const fetchJobsAndStats = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [jobsRes, statsRes] = await Promise.all([
        jobService.getJobs(),
        jobService.getStats()
      ]);

      if (jobsRes.success) {
        setJobs(jobsRes.jobs || []);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load Kanban data:', err);
      showToast(err.response?.data?.message || 'Failed to load job applications.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchJobsAndStats();
  }, [fetchJobsAndStats]);

  // Handle Drag & Drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    // Find the moved job
    const movedJob = jobs.find((j) => String(j.id) === String(draggableId));
    if (!movedJob) return;

    // Previous jobs state for rollback
    const previousJobs = [...jobs];

    // Optimistically update local state
    if (sourceStage !== destStage) {
      const updatedJobs = jobs.map((j) =>
        String(j.id) === String(draggableId) ? { ...j, stage: destStage } : j
      );
      setJobs(updatedJobs);

      try {
        const stageName = destStage.charAt(0).toUpperCase() + destStage.slice(1);
        const res = await jobService.updateStage(draggableId, destStage);
        if (res.success) {
          showToast(`Moved ${movedJob.companyName} to ${stageName}!`, 'success');
          // Refresh stats
          const statsRes = await jobService.getStats();
          if (statsRes.success) setStats(statsRes.stats);
        } else {
          throw new Error(res.message || 'Stage update failed');
        }
      } catch (err) {
        // Rollback state on error
        setJobs(previousJobs);
        showToast(err.response?.data?.message || `Failed to move ${movedJob.companyName}.`, 'error');
      }
    }
  };

  // Open modal for Adding new Job
  const handleOpenAddModal = (stage = 'applied') => {
    setJobToEdit(null);
    setInitialStageForNew(stage);
    setIsModalOpen(true);
  };

  // Open modal for Editing Job
  const handleEditJob = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  // Callback when job is created or updated
  const handleJobSaved = (savedJob, isEdit) => {
    if (isEdit) {
      setJobs((prev) => prev.map((j) => (j.id === savedJob.id ? savedJob : j)));
      showToast(`Updated application for ${savedJob.companyName}!`, 'success');
    } else {
      setJobs((prev) => [savedJob, ...prev]);
      showToast(`Added application for ${savedJob.companyName}!`, 'success');
    }
    // Refresh stats
    jobService.getStats().then((res) => {
      if (res.success) setStats(res.stats);
    });
  };

  // Open Delete Confirmation Modal
  const handleDeleteClick = (job) => {
    setJobToDelete(job);
  };

  // Execute Deletion
  const handleConfirmDelete = async (jobId) => {
    try {
      setDeleteLoading(true);
      const res = await jobService.deleteJob(jobId);
      if (res.success) {
        const targetJob = jobs.find((j) => j.id === jobId);
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setJobToDelete(null);
        showToast(`Deleted application for ${targetJob?.companyName || 'job'}.`, 'success');
        // Refresh stats
        const statsRes = await jobService.getStats();
        if (statsRes.success) setStats(statsRes.stats);
      } else {
        throw new Error(res.message || 'Failed to delete');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete job application.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter jobs by search
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const company = (job.companyName || '').toLowerCase();
    const title = (job.jobTitle || job.positionTitle || '').toLowerCase();
    const notes = (job.notes || '').toLowerCase();
    return company.includes(query) || title.includes(query) || notes.includes(query);
  });

  if (loading) {
    return <LoadingSpinner message="Loading your Job Application Kanban Board..." />;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Job Application Tracker
              </h2>
              <p className="text-xs text-slate-500">
                Kanban pipeline with automated stage advancement, drag-and-drop, and interview analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => fetchJobsAndStats(true)}
            disabled={refreshing}
            title="Refresh pipeline"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenAddModal('applied')}
            className="btn-primary text-xs flex items-center gap-1.5 shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Application</span>
          </button>
        </div>
      </div>

      {/* Stats Panel (Total applied, In interview, Offers, Conversion rate) */}
      <JobStats stats={stats} />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
          <span>
            Showing <strong className="text-slate-800">{filteredJobs.length}</strong> of{' '}
            <strong className="text-slate-800">{jobs.length}</strong> applications
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-indigo-600 hover:underline font-semibold ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Kanban Board (Applied → Interview → Offer) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {KANBAN_COLUMNS.map((column) => {
            const columnJobs = filteredJobs.filter(
              (j) => (j.stage || 'applied').toLowerCase() === column.id
            );

            return (
              <div
                key={column.id}
                className={`bg-slate-50/70 rounded-2xl border ${column.columnBorder} p-3.5 flex flex-col min-h-[580px] transition-colors`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight uppercase">
                      {column.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${column.badgeColor}`}
                  >
                    {columnJobs.length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 rounded-xl transition-all duration-150 p-1 ${
                        snapshot.isDraggingOver
                          ? 'bg-indigo-50/50 ring-2 ring-indigo-300 ring-dashed'
                          : ''
                      }`}
                    >
                      {columnJobs.map((job, idx) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          index={idx}
                          onEdit={handleEditJob}
                          onDelete={handleDeleteClick}
                        />
                      ))}

                      {provided.placeholder}

                      {/* Empty Column Placeholder */}
                      {columnJobs.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-44 rounded-xl border-2 border-dashed border-slate-200/80 flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-xs font-semibold text-slate-400">
                            No applications in {column.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Drag a card here or add a new role
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenAddModal(column.id)}
                            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add {column.title}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {/* Quick Add Button at bottom of column */}
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(column.id)}
                  className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-white text-xs font-medium text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-1.5 group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Add to {column.title}</span>
                </button>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Add / Edit Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setJobToEdit(null);
        }}
        jobToEdit={jobToEdit ? { ...jobToEdit, stage: jobToEdit.stage || initialStageForNew } : { stage: initialStageForNew }}
        onJobSaved={handleJobSaved}
        onError={(errMsg) => showToast(errMsg, 'error')}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(jobToDelete)}
        onClose={() => setJobToDelete(null)}
        job={jobToDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default KanbanBoard;
