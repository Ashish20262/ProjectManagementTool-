import { FaBell, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Project Management</h1>
        <p className="text-sm text-slate-500">Internship dashboard overview</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
          <FaBell size={18} />
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
          <FaSignOutAlt size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
