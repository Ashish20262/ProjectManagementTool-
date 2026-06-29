import { FaCalendarAlt, FaClipboardList, FaUsers, FaChartLine } from 'react-icons/fa';

const cards = [
  { label: 'Active Projects', value: '12', icon: <FaClipboardList size={20} /> },
  { label: 'Team Members', value: '24', icon: <FaUsers size={20} /> },
  { label: 'Upcoming Milestones', value: '5', icon: <FaCalendarAlt size={20} /> },
  { label: 'Progress Rate', value: '82%', icon: <FaChartLine size={20} /> },
];

const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Project dashboard</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Monitor your internship project progress, manage tasks, and coordinate your team in one place.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-6 py-4 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Today</p>
            <p className="mt-2 text-3xl font-semibold">June 29, 2026</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-950">
              {card.icon}
            </div>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="col-span-2 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Overview</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Project sprint status</h3>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
              View report
            </button>
          </div>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between text-slate-700">
                <p className="font-medium">Sprint progress</p>
                <p className="text-sm text-slate-500">74%</p>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500"></div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Tasks completed</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">32</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Issues pending</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">8</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Team velocity</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">85%</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Announcements</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">Design review at 4:00 PM</p>
              <p className="mt-2 text-sm text-slate-600">Prepare the sprint summary and user flow deliverables.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">Backend health check</p>
              <p className="mt-2 text-sm text-slate-600">Server and database connectivity will be validated during deployment testing.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default HomePage;
