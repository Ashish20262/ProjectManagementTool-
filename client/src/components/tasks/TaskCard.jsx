const statusClasses = {
  Todo: 'bg-sky-100 text-sky-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Done: 'bg-emerald-100 text-emerald-700',
};

const priorityClasses = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
};

const TaskCard = ({ task }) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{task.project?.title || 'Project'}</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{task.description || 'No description provided.'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[task.status]}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm text-slate-500">
        <div>Assigned to: {task.assignedTo?.name || 'Unassigned'}</div>
        <div>Created by: {task.createdBy?.name || 'Unknown'}</div>
        <div>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
      </div>
    </article>
  );
};

export default TaskCard;
