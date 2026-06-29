import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';

const statusOptions = ['All', 'Active', 'Completed', 'Archived'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      await projectService.createProject(payload);
      toast.success('Project created successfully');
      setSearch('');
      setStatusFilter('All');
      await loadProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create project');
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Projects</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Project portfolio</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 sm:w-72"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 sm:w-56"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
                No projects found. Use the form to create your first project.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            )}
          </div>
        </div>
        <ProjectForm onSubmit={handleCreate} loading={saving} />
      </section>
    </div>
  );
};

export default ProjectsPage;
