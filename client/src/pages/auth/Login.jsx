import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(form);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl bg-slate-900 p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Welcome Back</p>
        <h2 className="mt-4 text-4xl font-semibold text-white">Login to your account</h2>
        <p className="mt-4 text-slate-400">Enter your credentials to continue to the internship project management portal.</p>
        <div className="mt-10 grid gap-6">
          <div className="rounded-3xl bg-slate-800 p-6">
            <p className="text-sm text-slate-400">Secure and easy access with HTTP-only cookies.</p>
          </div>
          <div className="rounded-3xl bg-slate-800 p-6">
            <p className="text-sm text-slate-400">Designed for responsive use across desktop and mobile.</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-10 text-slate-900 shadow-xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-3xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link className="font-semibold text-cyan-600 hover:text-cyan-700" to="/auth/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
