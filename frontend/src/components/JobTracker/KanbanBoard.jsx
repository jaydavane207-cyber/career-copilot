// frontend/src/components/JobTracker/KanbanBoard.jsx
import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import AddJobModal from './AddJobModal';
import JobStats from './JobStats';
import { jobService } from '../../services/jobService';
import { KANBAN_COLUMNS } from '../../utils/constants';
import { Plus } from 'lucide-react';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const KanbanBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobsAndStats = async () => {
    try {
      setLoading(true);
      const [jobsRes, statsRes] = await Promise.all([
        jobService.getJobs(),
        jobService.getStats()
      ]);
      if (jobsRes.success) setJobs(jobsRes.jobs || []);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndStats();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const res = await jobService.updateStatus(jobId, newStatus);
      if (res.success) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
        const updatedStats = await jobService.getStats();
        if (updatedStats.success) setStats(updatedStats.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      const updatedStats = await jobService.getStats();
      if (updatedStats.success) setStats(updatedStats.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJobCreated = (newJob) => {
    setJobs([newJob, ...jobs]);
    jobService.getStats().then(res => res.success && setStats(res.stats));
  };

  if (loading) {
    return <LoadingSpinner message="Loading job applications pipeline..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Job Application Pipeline</h2>
          <p className="text-xs text-slate-500">Track and advance active job opportunities across Kanban stages.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      <JobStats stats={stats} />

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {KANBAN_COLUMNS.map((column) => {
          const colJobs = jobs.filter((j) => j.status === column.id);
          return (
            <div key={column.id} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 min-h-[480px] flex flex-col">
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${column.id === 'Offer' ? 'bg-emerald-500' : column.id === 'Interviewing' ? 'bg-amber-500' : column.id === 'Applied' ? 'bg-blue-500' : column.id === 'Rejected' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{column.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {colJobs.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
                {colJobs.length === 0 && (
                  <div className="h-28 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-[11px] text-slate-400">
                    Empty column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default KanbanBoard;
