import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ProjectForm from '../components/ProjectForm';
import PageState from '../components/ui/PageState';
import { FaFolderOpen, FaPlus } from 'react-icons/fa';

const statusOptions = ['All', 'Active', 'Completed', 'Archived'];
const editStatusOptions = ['Active', 'Completed', 'Archived'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
];

const formatInputDate = (value) => (value ? value.slice(0, 10) : '');

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'Active', startDate: '', endDate: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      await projectService.createProject(payload);
      toast.success('Project created successfully');
      setSearch('');
      setStatusFilter('All');
      setSortOption('newest');
      await loadProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create project');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setEditForm({
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'Active',
      startDate: formatInputDate(project.startDate || ''),
      endDate: formatInputDate(project.endDate || ''),
    });
    setEditError('');
  };

  const closeEditModal = () => {
    setEditingProject(null);
    setEditError('');
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editForm.title.trim()) {
      const message = 'Title is required.';
      setEditError(message);
      toast.error(message);
      return;
    }

    try {
      setEditSaving(true);
      const updatedPayload = {
        title: editForm.title.trim(),
        description: editForm.description,
        status: editForm.status,
      };
      if (editForm.startDate) updatedPayload.startDate = editForm.startDate;
      if (editForm.endDate) updatedPayload.endDate = editForm.endDate;

      await projectService.updateProject(editingProject._id, updatedPayload);
      toast.success('Project updated successfully');
      closeEditModal();
      await loadProjects();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update project';
      setEditError(message);
      toast.error(message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = (project) => {
    setDeletingProject(project);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;

    try {
      setDeleteLoading(true);
      await projectService.deleteProject(deletingProject._id);
      toast.success('Project deleted successfully');
      setDeletingProject(null);
      await loadProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const normalizedSearch = debouncedSearch;
    return projects
      .filter((project) => {
        const title = String(project.title || '').toLowerCase();
        const desc = String(project.description || '').toLowerCase();
        const matchesSearch = !normalizedSearch || title.includes(normalizedSearch) || desc.includes(normalizedSearch);
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortOption === 'az') return a.title.localeCompare(b.title);
        if (sortOption === 'za') return b.title.localeCompare(a.title);
        return 0;
      });
  }, [projects, debouncedSearch, statusFilter, sortOption]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((project) => project.status === 'Active').length,
    completed: projects.filter((project) => project.status === 'Completed').length,
    archived: projects.filter((project) => project.status === 'Archived').length,
  }), [projects]);

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-6 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Projects</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Project portfolio</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Manage active work with modern filters, sorting, and quick actions.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-800 px-5 py-4 shadow-inner ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total projects</p>
              <p className="mt-2 text-3xl font-semibold text-white">{loading ? '—' : stats.total}</p>
            </div>
            <div className="rounded-3xl bg-slate-800 px-5 py-4 shadow-inner ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active</p>
              <p className="mt-2 text-3xl font-semibold text-white">{loading ? '—' : stats.active}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-surface animate-fade-up p-6">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Projects</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Project portfolio</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative">
                  <input
                    aria-label="Search projects"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title or description"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                  />
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
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
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200/70">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : stats.total}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200/70">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : stats.active}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200/70">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Completed</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : stats.completed}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200/70">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Archived</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : stats.archived}</p>
              </div>
            </div>
          </div>

          <ProjectForm onSubmit={handleCreate} loading={saving} />
        </div>
      </section>

      <section className="grid gap-6">
        {loading ? (
          <PageState variant="loading" count={6} />
        ) : filteredProjects.length === 0 ? (
          <PageState
            variant="empty"
            title="No projects yet"
            description="Create your first project and keep your delivery plan organized from day one."
            actionLabel="Create project"
            onAction={() => document.querySelector('input[name="title"]')?.focus()}
            icon={() => (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7a2 2 0 0 1 2-2h3l2 2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12h8" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 animate-fade-up">
            {filteredProjects.map((project) => (
              <div key={project._id} className="transition-all duration-300 hover:scale-[1.01]">
                <ProjectCard
                  project={project}
                  onView={() => setViewProject(project)}
                  onEdit={() => handleEdit(project)}
                  onDelete={() => handleDelete(project)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 transition duration-300 ease-out">
            <h3 className="text-xl font-semibold text-slate-900">Are you sure?</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Are you sure you want to delete this project?
            </p>
            <p className="mt-3 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
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

      <ProjectDetailsModal
        open={Boolean(viewProject)}
        project={viewProject}
        onClose={() => setViewProject(null)}
      />

      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 transition duration-300 ease-out">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Edit project</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">Update project details</h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="btn-secondary rounded-full px-4 py-2"
              >
                Close
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleEditSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                  placeholder="Project description"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                  >
                    {editStatusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Start date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editForm.startDate}
                      onChange={handleEditChange}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">End date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={editForm.endDate}
                      onChange={handleEditChange}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {editError && (
                <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{editError}</div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="btn-primary w-full rounded-3xl px-5 py-3 sm:w-auto"
                >
                  {editSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
