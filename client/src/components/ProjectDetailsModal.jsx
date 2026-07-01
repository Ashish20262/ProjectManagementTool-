import { useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaUsers, FaChartLine, FaClipboardList, FaFlag, FaCheckCircle, FaClock } from 'react-icons/fa';

const formatDate = (value) => {
  if (!value) return 'TBD';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ProjectDetailsModal = ({ open, project, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !project) return null;

  const completionValue = project.completion != null ? Number(project.completion) : 0;
  const completionLabel = project.completion != null ? `${completionValue}%` : 'N/A';
  const taskCount = project.taskCount != null ? project.taskCount : 'N/A';
  const completedTasks = project.completedTaskCount != null ? project.completedTaskCount : 'N/A';
  const pendingTasks = project.pendingTaskCount != null ? project.pendingTaskCount : 'N/A';
  const assignedMembers = project.assignedMemberCount != null ? project.assignedMemberCount : null;
  const members = project.teamMembers || project.members || [];
  const hasMemberList = Array.isArray(members) && members.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 px-4 py-6 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl transition duration-300 ease-out"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-500/15 to-transparent" />
          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Project details</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{project.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200/70 bg-white/90 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
              >
                <FaTimes className="mr-2 text-slate-600" /> Close
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="glass-badge inline-flex items-center gap-2 bg-cyan-50/90 text-cyan-700">
                <FaClipboardList /> {project.status || 'Unknown'}
              </span>
              <span className="glass-badge inline-flex items-center gap-2 bg-amber-50/90 text-amber-700">
                <FaFlag /> {project.priority || 'Medium'}
              </span>
              <span className="glass-badge inline-flex items-center gap-2 bg-slate-100/90 text-slate-700">
                <FaChartLine /> Progress {completionLabel}
              </span>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Project progress</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{completionLabel}</p>
                </div>
                <div className="rounded-full bg-slate-200/70 px-4 py-2 text-sm font-semibold text-slate-700">
                  {taskCount !== 'N/A' ? `${taskCount} total tasks` : 'No task summary'}
                </div>
              </div>
              <div className="mt-4 rounded-full bg-slate-200/70 p-1">
                <div
                  className="progress-fill h-3 rounded-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(completionValue, 0), 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="glass-panel">
                <div className="panel-icon bg-cyan-500/10 text-cyan-700">
                  <FaClipboardList />
                </div>
                <p className="text-sm text-slate-500">Total tasks</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{taskCount}</p>
              </div>
              <div className="glass-panel">
                <div className="panel-icon bg-emerald-500/10 text-emerald-700">
                  <FaCheckCircle />
                </div>
                <p className="text-sm text-slate-500">Completed tasks</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{completedTasks}</p>
              </div>
              <div className="glass-panel">
                <div className="panel-icon bg-amber-500/10 text-amber-700">
                  <FaClock />
                </div>
                <p className="text-sm text-slate-500">Pending tasks</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{pendingTasks}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="glass-panel p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Timeline</p>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50/90 px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-slate-500"><FaCalendarAlt /> Created</span>
                    <strong>{formatDate(project.createdAt)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50/90 px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-slate-500"><FaCalendarAlt /> Updated</span>
                    <strong>{formatDate(project.updatedAt)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50/90 px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-slate-500"><FaClock /> Deadline</span>
                    <strong>{formatDate(project.endDate)}</strong>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Team members</p>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
                    {hasMemberList ? members.length : assignedMembers ?? 'N/A'}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {hasMemberList ? (
                    members.slice(0, 4).map((member, index) => (
                      <div key={index} className="rounded-3xl bg-slate-50/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
                        {member.name || member.email || member}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-slate-600">Member list unavailable, showing assigned count.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
