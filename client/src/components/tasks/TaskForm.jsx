import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import projectService from '../../services/projectService';
import api from '../../services/api';

const statusOptions = ['Todo', 'In Progress', 'Done'];
const priorityOptions = ['Low', 'Medium', 'High'];

const TaskForm = ({ onSubmit, loading, projects: propProjects = null, users: propUsers = null }) => {
  const [localProjects, setLocalProjects] = useState([]);
  const [localUsers, setLocalUsers] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    status: 'Todo',
    priority: 'Low',
    dueDate: '',
  });

  const projects = propProjects && propProjects.length ? propProjects : localProjects;
  const users = propUsers && propUsers.length ? propUsers : localUsers;

  useEffect(() => {
    // Only load projects/users when parent didn't provide them or when the parent state is empty
    const loadProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setLocalProjects(response.data.data || []);
      } catch (error) {
        console.error('Unable to load projects', error);
      }
    };

    const loadUsers = async () => {
      try {
        const response = await api.get('/users');
        setLocalUsers(response.data.data || []);
      } catch (error) {
        console.error('Unable to load users', error);
      }
    };

    if (!propProjects || propProjects.length === 0) loadProjects();
    if (!propUsers || propUsers.length === 0) loadUsers();
  }, [propProjects, propUsers]);

  const filteredUsers = useMemo(() => {
    const query = memberSearch.toLowerCase().trim();
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(query)
    );
  }, [memberSearch, users]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(form);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Validation error');
      throw error;
    }
    setForm({ title: '', description: '', project: '', assignedTo: '', status: 'Todo', priority: 'Low', dueDate: '' });
  };

  return (
    <div className="card-surface p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Create task</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">New task</h2>
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
            required
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
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Project</label>
          <select
            name="project"
            value={form.project}
            onChange={handleChange}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Assign member</label>
          <input
            type="text"
            value={memberSearch}
            onChange={(event) => setMemberSearch(event.target.value)}
            placeholder="Search member by name or email"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          />
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          >
            <option value="">Select member</option>
            {filteredUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} — {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
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
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Create task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
