import { FaCalendarAlt, FaProjectDiagram, FaUser, FaClock, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const statusClasses = {
  Todo: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-sky-100 text-sky-700',
  Done: 'bg-emerald-100 text-emerald-700',
};

const priorityClasses = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
};

const TaskCard = ({ task, onDelete, onEdit, onView }) => {
  return (
    <article className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{task.project?.title || 'Project'}</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900 truncate">{task.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{task.description || 'No description provided.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[task.status]}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className="mt-6 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3">
          <FaProjectDiagram className="text-slate-400" />
          <span>{task.project?.title || 'No project'}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3">
          <FaUser className="text-slate-400" />
          <span>{task.assignedTo?.name || 'Unassigned'}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3">
          <FaClock className="text-slate-400" />
          <span>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3">
          <FaCalendarAlt className="text-slate-400" />
          <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        {onView && (
          <button
            type="button"
            onClick={onView}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaEye className="mr-2 inline-block" /> View
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaEdit className="mr-2 inline-block" /> Edit
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <FaTrash className="mr-2 inline-block" /> Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
