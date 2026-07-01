import { useEffect, useMemo, useState } from 'react';
import PageState from '../components/ui/PageState';
import {
  FaCalendarAlt,
  FaChartBar,
  FaChartPie,
  FaCheckCircle,
  FaClock,
  FaFileCsv,
  FaFilePdf,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
} from 'react-icons/fa';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import toast from 'react-hot-toast';
import projectService from '../services/projectService';
import taskService from '../services/taskService';

const dateRanges = ['This Week', 'This Month', 'This Year'];
const colors = {
  active: '#38bdf8',
  completed: '#22c55e',
  archived: '#64748b',
  todo: '#0ea5e9',
  inProgress: '#f59e0b',
  done: '#14b8a6',
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
};

const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getRangeStart = (range) => {
  const now = new Date();
  if (range === 'This Week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  }
  if (range === 'This Month') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return new Date(now.getFullYear(), 0, 1);
};

const isInRange = (value, range) => {
  const date = value ? new Date(value) : null;
  if (!date) return false;
  const start = getRangeStart(range);
  const end = new Date();
  return date >= start && date <= end;
};

const downloadCsv = (filename, rows) => {
  const csv = rows.map((row) => Object.values(row).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('This Month');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, tasksResponse] = await Promise.all([
          projectService.getProjects(),
          taskService.getTasks(),
        ]);
        setProjects(projectsResponse.data.data || []);
        setTasks(tasksResponse.data.data || []);
      } catch (error) {
        toast.error('Unable to load report data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => isInRange(project.createdAt, range)),
    [projects, range]
  );

  const filteredTasks = useMemo(
    () => tasks.filter((task) => isInRange(task.createdAt, range)),
    [tasks, range]
  );

  const metrics = useMemo(() => {
    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter((project) => project.status === 'Active').length;
    const completedProjects = filteredProjects.filter((project) => project.status === 'Completed').length;
    const totalTasks = filteredTasks.length;
    const todoTasks = filteredTasks.filter((task) => task.status === 'Todo').length;
    const inProgressTasks = filteredTasks.filter((task) => task.status === 'In Progress').length;
    const doneTasks = filteredTasks.filter((task) => task.status === 'Done').length;
    const highPriorityTasks = filteredTasks.filter((task) => task.priority === 'High').length;
    const mediumPriorityTasks = filteredTasks.filter((task) => task.priority === 'Medium').length;
    const lowPriorityTasks = filteredTasks.filter((task) => task.priority === 'Low').length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
    };
  }, [filteredProjects, filteredTasks]);

  const projectStatusData = useMemo(
    () => [
      { name: 'Active', value: filteredProjects.filter((project) => project.status === 'Active').length },
      { name: 'Completed', value: filteredProjects.filter((project) => project.status === 'Completed').length },
      { name: 'Archived', value: filteredProjects.filter((project) => project.status === 'Archived').length },
    ],
    [filteredProjects]
  );

  const taskStatusData = useMemo(
    () => [
      { status: 'Todo', count: filteredTasks.filter((task) => task.status === 'Todo').length },
      { status: 'In Progress', count: filteredTasks.filter((task) => task.status === 'In Progress').length },
      { status: 'Done', count: filteredTasks.filter((task) => task.status === 'Done').length },
    ],
    [filteredTasks]
  );

  const priorityData = useMemo(
    () => [
      { priority: 'High', count: filteredTasks.filter((task) => task.priority === 'High').length },
      { priority: 'Medium', count: filteredTasks.filter((task) => task.priority === 'Medium').length },
      { priority: 'Low', count: filteredTasks.filter((task) => task.priority === 'Low').length },
    ],
    [filteredTasks]
  );

  const projectsThisMonth = useMemo(
    () => projects.filter((project) => isInRange(project.createdAt, 'This Month')).length,
    [projects]
  );

  const tasksThisMonth = useMemo(
    () => tasks.filter((task) => isInRange(task.createdAt, 'This Month')).length,
    [tasks]
  );

  const tasksCompletedThisMonth = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === 'Done' &&
          isInRange(task.updatedAt || task.createdAt, 'This Month')
      ).length,
    [tasks]
  );

  const latestProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [projects]
  );

  const latestTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [tasks]
  );

  const exportCsv = () => {
    const rows = [
      { Metric: 'Total Projects', Value: metrics.totalProjects },
      { Metric: 'Active Projects', Value: metrics.activeProjects },
      { Metric: 'Completed Projects', Value: metrics.completedProjects },
      { Metric: 'Total Tasks', Value: metrics.totalTasks },
      { Metric: 'Todo Tasks', Value: metrics.todoTasks },
      { Metric: 'In Progress Tasks', Value: metrics.inProgressTasks },
      { Metric: 'Done Tasks', Value: metrics.doneTasks },
      { Metric: 'High Priority Tasks', Value: metrics.highPriorityTasks },
      { Metric: 'Medium Priority Tasks', Value: metrics.mediumPriorityTasks },
      { Metric: 'Low Priority Tasks', Value: metrics.lowPriorityTasks },
    ];
    downloadCsv('reports-overview.csv', rows);
    toast.success('Report CSV generated');
  };

  const exportPdf = () => {
    toast('PDF export is available in the next release.', { icon: '📄' });
  };

  const summaryCards = [
    { label: 'Total Projects', value: metrics.totalProjects, icon: <FaProjectDiagram size={18} />, color: 'bg-sky-100 text-sky-700' },
    { label: 'Active Projects', value: metrics.activeProjects, icon: <FaChartPie size={18} />, color: 'bg-cyan-100 text-cyan-700' },
    { label: 'Completed Projects', value: metrics.completedProjects, icon: <FaCheckCircle size={18} />, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Total Tasks', value: metrics.totalTasks, icon: <FaTasks size={18} />, color: 'bg-slate-100 text-slate-700' },
    { label: 'Todo Tasks', value: metrics.todoTasks, icon: <FaClock size={18} />, color: 'bg-sky-100 text-sky-700' },
    { label: 'In Progress', value: metrics.inProgressTasks, icon: <FaUsers size={18} />, color: 'bg-amber-100 text-amber-700' },
    { label: 'Done Tasks', value: metrics.doneTasks, icon: <FaChartBar size={18} />, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'High Priority', value: metrics.highPriorityTasks, icon: <FaFilePdf size={18} />, color: 'bg-rose-100 text-rose-700' },
    { label: 'Medium Priority', value: metrics.mediumPriorityTasks, icon: <FaFileCsv size={18} />, color: 'bg-orange-100 text-orange-700' },
    { label: 'Low Priority', value: metrics.lowPriorityTasks, icon: <FaChartPie size={18} />, color: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-8 py-8 text-white shadow-xl sm:px-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/70">Reports</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Workspace performance</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Analyze project and task health with actionable charts, completion trends, and recent activity.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <button
              type="button"
              onClick={exportPdf}
              className="btn-secondary inline-flex items-center justify-center gap-2 border-white/10 bg-white/10 px-5 py-3 text-white hover:bg-white/15"
            >
              <FaFilePdf /> Export PDF
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="btn-primary inline-flex items-center justify-center gap-2 bg-sky-500 px-5 py-3 hover:bg-sky-600"
            >
              <FaFileCsv /> Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Filter</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Date range</h2>
            </div>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="w-full max-w-xs rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
            >
              {dateRanges.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.slice(0, 5).map((card) => (
              <div key={card.label} className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}>{card.icon}</span>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{card.label}</p>
                </div>
                <p className="mt-6 text-4xl font-semibold text-slate-900">{loading ? '—' : card.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Monthly overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Current month</h2>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
              Updated today
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Projects created this month</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : projectsThisMonth}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Tasks created this month</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : tasksThisMonth}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Tasks completed this month</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : tasksCompletedThisMonth}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Project status</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status distribution</h2>
            </div>
            <div className="text-sm text-slate-500">{range}</div>
          </div>
          <div className="mt-6 h-80">
            {loading ? (
              <PageState variant="loading" count={2} />
            ) : projects.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 text-slate-500">No project data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {projectStatusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.name === 'Active' ? colors.active : entry.name === 'Completed' ? colors.completed : colors.archived}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Projects']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Task status</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status flow</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                {filteredTasks.length} items
              </span>
            </div>
            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-400">Loading chart…</div>
              ) : tasks.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">No task data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskStatusData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip formatter={(value) => [`${value}`, 'Tasks']} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                      {taskStatusData.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={entry.status === 'Todo' ? colors.todo : entry.status === 'In Progress' ? colors.inProgress : colors.done}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Priority</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Urgency split</h2>
              </div>
              <div className="text-sm text-slate-500">{range}</div>
            </div>
            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-400">Loading chart…</div>
              ) : tasks.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400">No task data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {priorityData.map((entry) => (
                        <Cell
                          key={entry.priority}
                          fill={entry.priority === 'High' ? colors.high : entry.priority === 'Medium' ? colors.medium : colors.low}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Tasks']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {priorityData.map((entry) => (
                <div key={entry.priority} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{entry.priority}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{loading ? '—' : entry.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest projects</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
              {latestProjects.length} items
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-[1.75rem] bg-slate-100" />
              ))
            ) : latestProjects.length === 0 ? (
              <div className="rounded-[1.75rem] bg-slate-50 p-8 text-center text-slate-500">No recent projects found.</div>
            ) : (
              latestProjects.map((project) => (
                <div key={project._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{project.title}</p>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{project.description || 'No description available.'}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-700">
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                    <FaCalendarAlt /> <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest tasks</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
              {latestTasks.length} items
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-[1.75rem] bg-slate-100" />
              ))
            ) : latestTasks.length === 0 ? (
              <div className="rounded-[1.75rem] bg-slate-50 p-8 text-center text-slate-500">No recent tasks found.</div>
            ) : (
              latestTasks.map((task) => (
                <div key={task._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{task.description || 'No description available.'}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-700">
                      {task.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <FaUsers /> <span>{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <FaCalendarAlt /> <span>{formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {!loading && projects.length === 0 && tasks.length === 0 && (
        <section className="rounded-[2rem] bg-slate-50 p-10 text-center shadow-sm ring-1 ring-slate-200/80">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Report empty</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">No project or task data yet</h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-6 text-slate-500">
            Create projects and tasks in the workspace to populate the reports dashboard with live metrics and charts.
          </p>
        </section>
      )}
    </div>
  );
};

export default ReportsPage;
