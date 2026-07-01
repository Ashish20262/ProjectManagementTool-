import { useEffect, useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const statusOptions = ['Todo', 'In Progress', 'Done'];
const priorityOptions = ['Low', 'Medium', 'High'];

const formatDateInput = (value) => {
  if (!value) return '';
  return value.slice(0, 10);
};

const TaskEditModal = ({ open, task, projects, users, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    status: 'Todo',
    priority: 'Low',
    dueDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!task) return;
    setForm({
      title: task.title || '',
      description: task.description || '',
      project: task.project?._id || '',
      assignedTo: task.assignedTo?._id || '',
      status: task.status || 'Todo',
      priority: task.priority || 'Low',
      dueDate: formatDateInput(task.dueDate || ''),
    });
    setError('');
  }, [task]);

  if (!open || !task) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      const message = 'Task title is required.';
      setError(message);
      toast.error(message);
      return;
    }
    if (!form.project) {
      const message = 'Please select a project.';
      setError(message);
      toast.error(message);
      return;
    }
    if (!form.status) {
      setError('Task status is required.');
      return;
    }
    if (!form.priority) {
      setError('Task priority is required.');
      return;
    }

    try {
      setError('');
      await onSave(task._id, {
        title: form.title.trim(),
        description: form.description,
        project: form.project,
        assignedTo: form.assignedTo || null,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      });
      onClose();
    } catch (saveError) {
      const message = saveError?.response?.data?.message || saveError?.message || 'Unable to update task.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm">
      <div className="modal-surface w-full max-w-3xl p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Edit task</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Update task details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaTimes className="mr-2" /> Close
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Task title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              placeholder="Task name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              placeholder="Task details"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Project</label>
              <select
                name="project"
                value={form.project}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Assigned member</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name} — {user.email}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Due date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-3 rounded-3xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {saving ? (
                <>
                  <FaSpinner className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
