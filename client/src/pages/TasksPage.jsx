import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import taskService from '../services/taskService';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';

const statusOptions = ['All', 'Todo', 'In Progress', 'Done'];
const priorityOptions = ['All', 'Low', 'Medium', 'High'];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      await taskService.createTask(payload);
      toast.success('Task created successfully');
      setSearch('');
      setStatusFilter('All');
      setPriorityFilter('All');
      await loadTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create task');
    } finally {
      setSaving(false);
    }
  };

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch) ||
        task.project?.title.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tasks</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Task management</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              />
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
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
                No tasks found. Use the form to create a task for a project.
              </div>
            ) : (
              filteredTasks.map((task) => <TaskCard key={task._id} task={task} />)
            )}
          </div>
        </div>
        <TaskForm onSubmit={handleCreate} loading={saving} />
      </section>
    </div>
  );
};

export default TasksPage;
