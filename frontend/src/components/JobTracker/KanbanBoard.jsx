// frontend/src/components/JobTracker/KanbanBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import JobCard from './JobCard';
import JobStats from './JobStats';
import JobModal from './JobModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { jobService } from '../../services/jobService';
import { KANBAN_COLUMNS } from '../../utils/constants';
import { Plus, Search, RefreshCw, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import Toast from '../Common/Toast';
import { Button } from '../UI/Button';

export const KanbanBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile active column tab ('applied' | 'interview' | 'offer')
  const [mobileTab, setMobileTab] = useState('applied');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialStageForNew, setInitialStageForNew] = useState('applied');

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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    const movedJob = jobs.find((j) => String(j.id) === String(draggableId));
    if (!movedJob) return;

    const previousJobs = [...jobs];

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
          const statsRes = await jobService.getStats();
          if (statsRes.success) setStats(statsRes.stats);
        } else {
          throw new Error(res.message || 'Stage update failed');
        }
      } catch (err) {
        setJobs(previousJobs);
        showToast('Failed to update stage. Rolled back.', 'error');
      }
    }
  };

  const handleOpenAddModal = (stage = 'applied') => {
    setInitialStageForNew(stage);
    setJobToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  const handleJobSaved = (savedJob, isEdit) => {
    if (isEdit) {
      setJobs(jobs.map((j) => (j.id === savedJob.id ? savedJob : j)));
      showToast('Job application updated successfully!', 'success');
    } else {
      setJobs([savedJob, ...jobs]);
      showToast('New job application added to pipeline!', 'success');
    }
    fetchJobsAndStats(true);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
  };

  const handleConfirmDelete = async (jobId) => {
    try {
      setDeleteLoading(true);
      const res = await jobService.deleteJob(jobId);
      if (res.success) {
        setJobs(jobs.filter((j) => j.id !== jobId));
        setJobToDelete(null);
        showToast('Application deleted successfully.', 'info');
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

  // Column definitions with specific color accents
  const columns = [
    {
      id: 'applied',
      title: 'Applied',
      headerBadge: 'bg-[#EBF5FF] text-[#3B82F6] border border-[#BFDBFE]',
      dotColor: 'bg-[#3B82F6]',
      buttonColor: 'text-[#3B82F6]'
    },
    {
      id: 'interview',
      title: 'Interview',
      headerBadge: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]',
      dotColor: 'bg-[#F59E0B]',
      buttonColor: 'text-[#F59E0B]'
    },
    {
      id: 'offer',
      title: 'Offer',
      headerBadge: 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]',
      dotColor: 'bg-[#10B981]',
      buttonColor: 'text-[#10B981]'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          {/* H1: "My Job Applications" */}
          <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
            My Job Applications
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Track applications from submission to technical interviews and offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => fetchJobsAndStats(true)}
            disabled={refreshing}
            icon={RefreshCw}
          >
            {refreshing ? 'Updating...' : 'Sync'}
          </Button>

          <Button
            variant="primary"
            onClick={() => handleOpenAddModal('applied')}
            icon={Plus}
          >
            Add Job
          </Button>
        </div>
      </div>

      {/* Stats Bar (4 columns: Total Applied | Interviews | Offers | Conversion %) */}
      <JobStats stats={stats} />

      {/* Search and Filters */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[14px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:border-[#3B82F6] focus:bg-white transition-all"
          />
        </div>
        <div className="text-[12px] text-[#6B7280]">
          Showing <span className="font-bold text-[#374151]">{filteredJobs.length}</span> of{' '}
          <span className="font-bold text-[#374151]">{jobs.length}</span> applications
        </div>
      </div>

      {/* Mobile Column Tabs (Visible on small screens) */}
      <div className="md:hidden flex items-center justify-between bg-white rounded-[12px] border border-[#E5E7EB] p-1.5 shadow-xs">
        {columns.map((col) => {
          const count = filteredJobs.filter((j) => (j.stage || 'applied').toLowerCase() === col.id).length;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setMobileTab(col.id)}
              className={`flex-1 py-2 rounded-[8px] text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === col.id
                  ? 'bg-[#3B82F6] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#374151]'
              }`}
            >
              <span>{col.title}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${mobileTab === col.id ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Three Columns Below (Desktop 3 columns, Mobile 1 column based on tab) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] items-start">
          {columns.map((col) => {
            const columnJobs = filteredJobs.filter(
              (j) => (j.stage || 'applied').toLowerCase() === col.id
            );

            // On mobile, show only active tab column
            const isVisibleOnMobile = mobileTab === col.id;

            return (
              <div
                key={col.id}
                className={`
                  bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB] p-4 flex flex-col min-h-[500px]
                  ${isVisibleOnMobile ? 'block' : 'hidden md:flex'}
                `}
              >
                {/* Header: Title + count badge */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    <h3 className="font-bold text-[#111827] text-[15px] tracking-tight">
                      {col.title}
                    </h3>
                  </div>
                  <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${col.headerBadge}`}>
                    {columnJobs.length}
                  </span>
                </div>

                {/* Droppable cards container with 12px spacing */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-[12px] transition-colors rounded-[8px] p-1 ${
                        snapshot.isDraggingOver ? 'bg-[#EBF5FF]/50 ring-2 ring-[#3B82F6]/30' : ''
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

                      {columnJobs.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-36 border-2 border-dashed border-[#E5E7EB] rounded-[8px] flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-[13px] text-[#9CA3AF]">
                            No {col.title.toLowerCase()} applications
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {/* Add button at bottom: "Add Job" with + icon */}
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(col.id)}
                  className="mt-3 w-full py-2.5 px-3 rounded-[8px] border border-dashed border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-white text-[13px] font-semibold text-[#6B7280] hover:text-[#3B82F6] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Job</span>
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
