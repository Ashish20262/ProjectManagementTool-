import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import api from '../services/api';
import TaskCard from '../components/tasks/TaskCard';
import TaskDetailsModal from '../components/TaskDetailsModal';
import TaskEditModal from '../components/tasks/TaskEditModal';
import TaskForm from '../components/tasks/TaskForm';
import PageState from '../components/ui/PageState';
import { FaClipboardList, FaTasks } from 'react-icons/fa';

const statusOptions = ['All', 'Todo', 'In Progress', 'Done'];
const priorityOptions = ['All', 'High', 'Medium', 'Low'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'priorityHigh', label: 'Priority High → Low' },
  { value: 'priorityLow', label: 'Priority Low → High' },
  { value: 'dueDate', label: 'Due Date' },
];

const priorityWeight = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Unable to load projects', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Unable to load users', error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
    loadUsers();
  }, []);

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      await taskService.createTask(payload);
      toast.success('Task created successfully');
      setSearch('');
      setStatusFilter('All');
      setPriorityFilter('All');
      setProjectFilter('All');
      setAssignedFilter('All');
      setSortOption('newest');
      await loadTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create task');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
  };

  const startDelete = (task) => {
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setDeleteLoading(true);
      await taskService.deleteTask(deletingTask._id);
      toast.success('Task deleted successfully');
      setDeletingTask(null);
      await loadTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSave = async (taskId, payload) => {
    try {
      setEditSaving(true);
      await taskService.updateTask(taskId, payload);
      toast.success('Task updated successfully');
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      throw error;
    } finally {
      setEditSaving(false);
    }
  };

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title?.toLowerCase().includes(normalizedSearch) ||
          task.description?.toLowerCase().includes(normalizedSearch) ||
          task.project?.title?.toLowerCase().includes(normalizedSearch) ||
          task.assignedTo?.name?.toLowerCase().includes(normalizedSearch) ||
          task.assignedTo?.email?.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        const matchesProject = projectFilter === 'All' || task.project?._id === projectFilter;
        const matchesAssigned = assignedFilter === 'All' || task.assignedTo?._id === assignedFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssigned;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortOption === 'priorityHigh') return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        if (sortOption === 'priorityLow') return (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
        if (sortOption === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
      });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, assignedFilter, sortOption]);

  const activeCount = tasks.filter((task) => task.status === 'In Progress').length;
  const todoCount = tasks.filter((task) => task.status === 'Todo').length;
  const doneCount = tasks.filter((task) => task.status === 'Done').length;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-6 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Tasks</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Task manager</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Track priorities and keep every task aligned across projects.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900 px-5 py-4 shadow-inner ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total tasks</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : tasks.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 px-5 py-4 shadow-inner ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Todo</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : todoCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 px-5 py-4 shadow-inner ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Done</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : doneCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tasks</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Task pipeline</h2>
            </div>
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="All">All projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.title}</option>
                ))}
              </select>
              <select
                value={assignedFilter}
                onChange={(event) => setAssignedFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="All">All members</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name} — {user.email}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : activeCount}</p>
              <p className="mt-1 text-sm text-slate-500">In progress tasks</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Priority mix</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : priorityFilter === 'All' ? tasks.length : filteredTasks.length}</p>
              <p className="mt-1 text-sm text-slate-500">Filtered by priority</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, description, project, or member"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={assignedFilter}
                onChange={(event) => setAssignedFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="All">All members</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <TaskForm onSubmit={handleCreate} loading={saving} projects={projects} users={users} />
      </section>

      <section className="grid gap-6">
        {loading ? (
          <PageState variant="loading" count={6} />
        ) : filteredTasks.length === 0 ? (
          <PageState
            variant="empty"
            title="No tasks found"
            description="Add your first task to track progress, assign work, and keep deadlines visible."
            actionLabel="Create task"
            onAction={() => document.querySelector('input[name="title"]')?.focus()}
            icon={FaClipboardList}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onView={() => setViewTask(task)}
                onEdit={() => startEdit(task)}
                onDelete={() => startDelete(task)}
              />
            ))}
          </div>
        )}
      </section>

      {deletingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Are you sure?</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingTask(null)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="w-full rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <TaskDetailsModal
        open={Boolean(viewTask)}
        task={viewTask}
        onClose={() => setViewTask(null)}
      />
      <TaskEditModal
        open={Boolean(editingTask)}
        task={editingTask}
        projects={projects}
        users={users}
        onClose={() => setEditingTask(null)}
        onSave={handleEditSave}
        saving={editSaving}
      />
    </div>
  );
};

export default TasksPage;
