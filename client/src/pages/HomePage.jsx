import { useEffect, useMemo, useState } from 'react';
import { FaCalendarAlt, FaClipboardList, FaUsers, FaChartLine, FaArrowRight, FaTasks, FaChartPie, FaRocket, FaPlus, FaClock } from 'react-icons/fa';
import PageState from '../components/ui/PageState';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dashboardService from '../services/dashboardService';

const metrics = [
  { key: 'totalProjects', label: 'Projects', valueLabel: 'Projects', icon: <FaClipboardList size={20} /> },
  { key: 'totalTasks', label: 'Tasks', valueLabel: 'Tasks', icon: <FaTasks size={20} /> },
  { key: 'completedTasks', label: 'Completed', valueLabel: 'Done', icon: <FaChartLine size={20} /> },
  { key: 'overdueTasks', label: 'Overdue', valueLabel: 'Late', icon: <FaArrowRight size={20} /> },
];

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

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsResponse, chartsResponse] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCharts(),
        ]);

        setStats(statsResponse.data.data);
        setCharts(chartsResponse.data.data);
      } catch (err) {
        setError('Unable to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalVelocity = useMemo(() => {
    if (!stats) return 0;
    return Math.round(((stats.completedTasks || 0) / Math.max(1, stats.totalTasks || 0)) * 100);
  }, [stats]);

  const projectStatus = charts?.projectStatusChart ?? [];
  const taskStatus = charts?.taskStatusChart ?? [];
  const priorityStatus = charts?.priorityChart ?? [];
  const pendingTasks = Math.max(0, (stats?.totalTasks || 0) - (stats?.completedTasks || 0));
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const userName = 'User';

  if (loading && !stats) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <PageState variant="loading" count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="card-surface overflow-hidden bg-slate-950 text-white shadow-2xl sm:px-10">
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.16),_transparent_25%)]" />
          <div className="relative space-y-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Welcome back, {userName}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Today’s summary</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  The latest insights for your projects and tasks are displayed here in one place.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-slate-100 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Today</p>
                <p className="mt-3 text-3xl font-semibold text-white">{todayLabel}</p>
                <p className="mt-1 text-sm text-slate-400">Live updates across your teams and timelines.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="card-surface p-5 hover:-translate-y-1 hover:shadow-xl transition duration-200 ease-out">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Projects</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '—' : stats?.totalProjects ?? 0}</p>
                <p className="mt-3 text-sm text-slate-500">Active projects in your workspace.</p>
              </div>
              <div className="card-surface p-5 hover:-translate-y-1 hover:shadow-xl transition duration-200 ease-out">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tasks</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '—' : stats?.totalTasks ?? 0}</p>
                <p className="mt-3 text-sm text-slate-500">Total tasks being tracked.</p>
              </div>
              <div className="card-surface p-5 hover:-translate-y-1 hover:shadow-xl transition duration-200 ease-out">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Completed</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '—' : stats?.completedTasks ?? 0}</p>
                <p className="mt-3 text-sm text-slate-500">Tasks finished in this cycle.</p>
              </div>
              <div className="card-surface p-5 hover:-translate-y-1 hover:shadow-xl transition duration-200 ease-out">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Pending</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '—' : pendingTasks}</p>
                <p className="mt-3 text-sm text-slate-500">Tasks still needing attention.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Activity timeline</h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn-secondary px-3 py-2 text-sm">Filter</button>
                <button className="btn-primary px-3 py-2 text-sm">Export</button>
              </div>
            </div>
            <div className="mt-6">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="h-3 w-3 rounded-full bg-slate-100 animate-pulse mt-2" />
                      <div className="w-full">
                        <div className="h-3 w-3/4 rounded bg-slate-100 animate-pulse" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ol className="divide-y divide-slate-100">
                  {[
                    ...(stats?.recentTasks || []).map((t) => ({ type: 'task', id: t._id, title: t.title, date: t.createdAt })),
                    ...(stats?.recentProjects || []).map((p) => ({ type: 'project', id: p._id, title: p.title, date: p.createdAt })),
                  ]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 8)
                    .map((item) => (
                      <li key={item.id} className="py-4">
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 h-3 w-3 rounded-full ${item.type === 'task' ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{new Date(item.date).toLocaleString()}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ol>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Today's tasks</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Due today</h3>
              <div className="mt-4">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {(stats?.recentTasks || []).filter((t) => {
                      if (!t.dueDate) return false;
                      const d = new Date(t.dueDate);
                      const today = new Date();
                      return d.toDateString() === today.toDateString();
                    }).slice(0, 5).map((task) => (
                      <li key={task._id} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.project?.title || 'No project'}</p>
                        </div>
                        <span className="badge badge-warning inline-flex items-center gap-2"><FaClock /> Due</span>
                      </li>
                    ))}
                    {!(stats?.recentTasks || []).some((t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()) && (
                      <p className="text-sm text-slate-500">No tasks due today.</p>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Upcoming deadlines</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Next deadlines</h3>
              <div className="mt-4">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {(stats?.recentTasks || [])
                      .filter((t) => t.dueDate && new Date(t.dueDate) > new Date())
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .slice(0, 5)
                      .map((task) => (
                        <li key={task._id} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                            <p className="text-xs text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                          <span className="badge badge-danger inline-flex items-center gap-2">Deadline</span>
                        </li>
                      ))}
                    {!(stats?.recentTasks || []).some((t) => t.dueDate && new Date(t.dueDate) > new Date()) && (
                      <p className="text-sm text-slate-500">No upcoming deadlines.</p>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80 hover:-translate-y-1 hover:shadow-lg transition-transform duration-200">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
            <div className="mt-4 flex flex-col gap-3">
              <a href="/projects" className="inline-flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"> <FaPlus /> New project</a>
              <a href="/tasks" className="inline-flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"> <FaPlus /> New task</a>
              <button onClick={() => window.location.reload()} className="inline-flex items-center gap-3 rounded-3xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700">Refresh</button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Latest projects</p>
            <div className="mt-4 space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded bg-slate-100 animate-pulse" />)
              ) : (
                (stats?.recentProjects || []).slice(0, 3).map((p) => (
                  <div key={p._id} className="card-surface p-3">
                    <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.status}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Latest tasks</p>
            <div className="mt-4 space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded bg-slate-100 animate-pulse" />)
              ) : (
                (stats?.recentTasks || []).slice(0, 3).map((t) => (
                  <div key={t._id} className="card-surface p-3">
                    <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.project?.title || 'No project'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </section>

      {error ? (
        <PageState
          variant="error"
          title="Dashboard unavailable"
          description="We could not load the latest workspace metrics. Refresh to try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      ) : null}

      <section className="grid gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.key} className="card-surface animate-fade-up p-6 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-900">
                {metric.icon}
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                {metric.valueLabel}
              </span>
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">
              {loading ? '—' : stats?.[metric.key] ?? '0'}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Project status</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status distribution</h2>
            </div>
            <p className="text-sm text-slate-500">Updated now</p>
          </div>
          <div className="mt-6 h-72">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading chart…</div>
            ) : projectStatus.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={projectStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4}>
                    {projectStatus.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={entry.status === 'Active' ? colors.active : entry.status === 'Completed' ? colors.completed : colors.archived}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Projects']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No project data available.</div>
            )}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {projectStatus.map((entry) => (
              <div key={entry.status} className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{entry.status}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{entry.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Task status</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Completion flow</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Live</span>
            </div>
            <div className="mt-6 h-64">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-400">Loading chart…</div>
              ) : taskStatus.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskStatus} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                    <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip formatter={(value) => [value, 'Tasks']} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="count" radius={[12, 12, 0, 0]} fill={colors.done}>
                      {taskStatus.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={entry.status === 'Todo' ? colors.todo : entry.status === 'In Progress' ? colors.inProgress : colors.done}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No task data available.</div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Priority</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Task urgency</h2>
              </div>
              <p className="text-sm text-slate-500">Focus areas</p>
            </div>
            <div className="mt-6 h-64">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-400">Loading chart…</div>
              ) : priorityStatus.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityStatus} dataKey="count" nameKey="priority" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                      {priorityStatus.map((entry) => (
                        <Cell
                          key={entry.priority}
                          fill={entry.priority === 'High' ? colors.high : entry.priority === 'Medium' ? colors.medium : colors.low}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Tasks']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No priority data available.</div>
              )}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {priorityStatus.map((entry) => (
                <div key={entry.priority} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{entry.priority}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{entry.count}</p>
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
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent projects</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest activity</h2>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              {loading ? 'Loading' : stats?.recentProjects?.length ?? 0} items
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-[1.5rem] bg-slate-100" />
              ))
            ) : stats?.recentProjects?.length ? (
              stats.recentProjects.map((project) => (
                <div key={project._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{project.status}</p>
                    </div>
                    <p className="text-sm text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                <FaRocket className="mx-auto text-3xl text-cyan-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No recent projects yet</h3>
                <p className="mt-2 text-sm">Create a project to start tracking progress.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent tasks</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest assignments</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              {loading ? 'Loading' : stats?.recentTasks?.length ?? 0} items
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-[1.5rem] bg-slate-100" />
              ))
            ) : stats?.recentTasks?.length ? (
              stats.recentTasks.map((task) => (
                <div key={task._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{task.project?.title ?? 'Unassigned project'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{task.priority}</p>
                      <p className="mt-1 text-xs text-slate-400">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.75rem] bg-slate-50 p-8 text-center text-slate-500">
                No recent tasks found. Add a task to see it here.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl ring-1 ring-white/10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Progress</p>
          <p className="mt-4 text-5xl font-semibold">{loading ? '—' : `${totalVelocity}%`}</p>
          <p className="mt-2 max-w-xs text-slate-300">Completed task velocity based on current project workload.</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Overview</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Projects active</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{loading ? '—' : stats?.activeProjects ?? '0'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Tasks in progress</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{loading ? '—' : stats?.inProgressTasks ?? '0'}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Alerts</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-3xl bg-rose-50 p-5">
              <p className="text-sm text-rose-700">Overdue tasks</p>
              <p className="mt-2 text-3xl font-semibold text-rose-900">{loading ? '—' : stats?.overdueTasks ?? '0'}</p>
            </div>
            <div className="rounded-3xl bg-amber-50 p-5">
              <p className="text-sm text-amber-700">Archived projects</p>
              <p className="mt-2 text-3xl font-semibold text-amber-900">{loading ? '—' : stats?.archivedProjects ?? '0'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
