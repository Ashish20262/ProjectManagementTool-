const statusClasses = {
  Active: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-sky-100 text-sky-700',
  Archived: 'bg-slate-100 text-slate-700',
};

const priorityClasses = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
};

const ProjectCard = ({ project }) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{project.owner?.name || 'Owner'}</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{project.description || 'No description provided.'}</p>
        </div>
        <div className="space-y-2 text-right">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[project.status]}`}>
            {project.status}
          </span>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[project.priority]}`}>
            {project.priority}
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <div>{new Date(project.createdAt).toLocaleDateString()}</div>
        <div className="rounded-full bg-slate-100 px-3 py-1">{project.members?.length || 0} members</div>
      </div>
    </article>
  );
};

export default ProjectCard;
