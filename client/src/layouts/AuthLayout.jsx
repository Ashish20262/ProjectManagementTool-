import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl bg-slate-950/95 p-10 shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-semibold">Project Management Tool</h1>
              <p className="mt-2 text-slate-400">Secure access for your internship project workspace.</p>
            </div>
            <div className="text-sm text-slate-500">
              <Link className="hover:text-white" to="/">Back to Dashboard</Link>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
