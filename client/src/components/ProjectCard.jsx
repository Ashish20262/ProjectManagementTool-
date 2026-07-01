import { FaTrash, FaCalendarAlt, FaSyncAlt, FaEdit, FaEye } from 'react-icons/fa';

const statusClasses = {
  Active: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-sky-100 text-sky-700',
  Archived: 'bg-slate-100 text-slate-700',
};

const ProjectCard = ({ project, onDelete, onEdit, onView }) => {
  return (
    <article className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-[70%]">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{project.title}</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{project.description || 'No description provided.'}</p>
        </div>
        <div className="flex flex-col items-end gap-3 text-right">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[project.status]}`}>
            {project.status}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-100"
            >
              <FaEye size={12} /> View
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-100"
            >
              <FaEdit size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <FaTrash size={12} /> Delete
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-3 py-2">
          <FaCalendarAlt className="text-slate-400" />
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-3 py-2">
          <FaSyncAlt className="text-slate-400" />
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
