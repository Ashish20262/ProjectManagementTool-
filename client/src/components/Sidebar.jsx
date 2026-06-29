import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaUsers, FaChartPie } from 'react-icons/fa';

const navItems = [
  { label: 'Home', to: '/', icon: <FaHome size={16} /> },
  { label: 'Projects', to: '/projects', icon: <FaTasks size={16} /> },
  { label: 'Tasks', to: '/tasks', icon: <FaTasks size={16} /> },
  { label: 'Teams', to: '/teams', icon: <FaUsers size={16} /> },
  { label: 'Reports', to: '/reports', icon: <FaChartPie size={16} /> },
];

const Sidebar = () => {
  return (
    <aside className="w-72 shrink-0 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
        <h2 className="mt-3 text-2xl font-semibold">PM Tool</h2>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
