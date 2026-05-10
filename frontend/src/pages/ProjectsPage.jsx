import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { api } from "../services/axios";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";

const initialProjectForm = {
  title: "",
  description: "",
  status: "Active",
};

export const ProjectsPage = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const loadProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  const loadUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const { execute: fetchProjects, loading } = useAsync(loadProjects);
  const { execute: saveProject, loading: saving } = useAsync(async () => {
    const payload = {
      ...projectForm,
      members: Array.from(new Set([user._id, ...selectedMemberIds])).map((memberId) => ({
        user: memberId,
        role: memberId === user._id ? "admin" : "member",
      })),
    };
    await api.post("/projects", payload);
    toast.success("Project created.");
    setProjectForm(initialProjectForm);
    setSelectedMemberIds([]);
    await loadProjects();
  });

  const { execute: removeProject } = useAsync(async (projectId) => {
    await api.delete(`/projects/${projectId}`);
    toast.success("Project deleted.");
    await loadProjects();
  });

  useEffect(() => {
    fetchProjects();
    loadUsers();
  }, [fetchProjects]);

  return (
    <div>
      <SectionHeader
        eyebrow="Projects"
        title="Organize work by team and outcome"
        description="Create project spaces, add members, and keep delivery details together."
        action={
          isAdmin ? (
            <button className="btn-primary gap-2">
              <Plus size={16} />
              New project
            </button>
          ) : null
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="panel p-6">
          <h3 className="text-xl font-semibold text-white">Create Project</h3>
          <p className="mt-2 text-sm text-slate-400">Admins can start a new workspace and invite collaborators later.</p>

          {isAdmin ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveProject();
              }}
              className="mt-6 space-y-4"
            >
              <FormField label="Project title">
                <input
                  className="input"
                  required
                  value={projectForm.title}
                  onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  className="input min-h-28"
                  value={projectForm.description}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </FormField>

              <FormField label="Status">
                <select
                  className="input"
                  value={projectForm.status}
                  onChange={(event) => setProjectForm((current) => ({ ...current, status: event.target.value }))}
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </FormField>

              <FormField label="Team members">
                <select
                  multiple
                  className="input min-h-40"
                  value={selectedMemberIds}
                  onChange={(event) =>
                    setSelectedMemberIds(
                      Array.from(event.target.selectedOptions).map((option) => option.value)
                    )
                  }
                >
                  {users
                    .filter((candidate) => candidate._id !== user._id)
                    .map((candidate) => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.name} ({candidate.email})
                      </option>
                    ))}
                </select>
              </FormField>

              <button disabled={saving} className="btn-primary w-full">
                {saving ? "Creating..." : "Create project"}
              </button>
            </form>
          ) : (
            <EmptyState
              title="Admin access required"
              description="Members can collaborate inside projects, but only admins can create new project workspaces."
            />
          )}
        </section>

        <section className="panel p-6">
          <h3 className="text-xl font-semibold text-white">Project List</h3>
          <p className="mt-2 text-sm text-slate-400">Open a project to manage members, tasks, and delivery status.</p>

          <div className="mt-6 space-y-4">
            {!loading && projects.length ? (
              projects.map((project) => (
                <div key={project._id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <Link to={`/projects/${project._id}`} className="text-xl font-semibold text-white">
                          {project.title}
                        </Link>
                        <StatusBadge value={project.status} />
                      </div>
                      <p className="mt-3 max-w-2xl text-sm text-slate-400">{project.description || "No description added yet."}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-brand-200">
                        {project.members.length} team members
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.members.map((member) => (
                          <span
                            key={member.user._id}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                          >
                            {member.user.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={() => removeProject(project._id)}
                        className="btn-secondary gap-2 text-rose-200 hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No projects yet"
                description="Create your first project to start assigning work and tracking progress."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
