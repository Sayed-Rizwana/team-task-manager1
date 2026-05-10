import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { api } from "../services/axios";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { formatDate, isOverdue } from "../utils/format";

const initialTaskForm = {
  title: "",
  description: "",
  assignedTo: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
};

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [taskForm, setTaskForm] = useState(initialTaskForm);

  const loadProject = async () => {
    const { data } = await api.get(`/projects/${projectId}`);
    setProject(data);
    setSelectedMembers(data.members.map((member) => member.user._id));
    setTaskForm((current) => ({
      ...current,
      assignedTo: data.members[0]?.user?._id || "",
    }));
  };

  const loadUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const { execute: fetchProject, loading } = useAsync(loadProject);
  const { execute: updateProject, loading: updating } = useAsync(async () => {
    const creatorId = project.createdBy._id || project.createdBy;
    const members = Array.from(new Set([...selectedMembers, creatorId])).map((memberId) => ({
      user: memberId,
      role: memberId === creatorId ? "admin" : "member",
    }));

    await api.put(`/projects/${projectId}`, {
      title: project.title,
      description: project.description,
      status: project.status,
      members,
    });
    toast.success("Project updated.");
    await loadProject();
  });

  const { execute: createTask, loading: creatingTask } = useAsync(async () => {
    await api.post("/tasks", {
      ...taskForm,
      project: projectId,
    });
    toast.success("Task created.");
    setTaskForm({
      ...initialTaskForm,
      assignedTo: project.members[0]?.user?._id || "",
    });
    await loadProject();
  });

  useEffect(() => {
    fetchProject();
    loadUsers();
  }, [fetchProject, projectId]);

  if (!loading && !project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been removed or you may not have access anymore."
      />
    );
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Project Details"
        title={project?.title || "Loading project..."}
        description={project?.description || "Manage members, update project status, and add new tasks."}
      />

      {project ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-6">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Project Settings</h3>
                  <p className="mt-2 text-sm text-slate-400">Keep the project summary and member access up to date.</p>
                </div>
                <StatusBadge value={project.status} />
              </div>

              <div className="mt-6 space-y-4">
                <FormField label="Project title">
                  <input
                    className="input"
                    value={project.title}
                    onChange={(event) => setProject((current) => ({ ...current, title: event.target.value }))}
                  />
                </FormField>
                <FormField label="Description">
                  <textarea
                    className="input min-h-28"
                    value={project.description}
                    onChange={(event) =>
                      setProject((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    className="input"
                    value={project.status}
                    onChange={(event) => setProject((current) => ({ ...current, status: event.target.value }))}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </FormField>
                <FormField label="Project members">
                  <select
                    multiple
                    className="input min-h-40"
                    value={selectedMembers}
                    onChange={(event) =>
                      setSelectedMembers(
                        Array.from(event.target.selectedOptions).map((option) => option.value)
                      )
                    }
                  >
                    {users.map((candidate) => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.name} ({candidate.email})
                      </option>
                    ))}
                  </select>
                </FormField>
                <button disabled={updating || !isAdmin} onClick={updateProject} className="btn-primary gap-2">
                  <Save size={16} />
                  {updating ? "Saving..." : "Save project"}
                </button>
                {!isAdmin ? <p className="text-sm text-slate-500">Only admins can save project changes.</p> : null}
              </div>
            </div>

            <div className="panel p-6">
              <h3 className="text-xl font-semibold text-white">Team Members</h3>
              <div className="mt-6 grid gap-4">
                {project.members.map((member) => (
                  <div key={member.user._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{member.user.name}</p>
                        <p className="text-sm text-slate-400">{member.user.email}</p>
                      </div>
                      <StatusBadge value={member.role} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="panel p-6">
              <h3 className="text-xl font-semibold text-white">Add Task</h3>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  createTask();
                }}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                <FormField label="Task title">
                  <input
                    className="input"
                    required
                    value={taskForm.title}
                    onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
                  />
                </FormField>
                <FormField label="Assignee">
                  <select
                    className="input"
                    value={taskForm.assignedTo}
                    onChange={(event) => setTaskForm((current) => ({ ...current, assignedTo: event.target.value }))}
                  >
                    {project.members.map((member) => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Priority">
                  <select
                    className="input"
                    value={taskForm.priority}
                    onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </FormField>
                <FormField label="Status">
                  <select
                    className="input"
                    value={taskForm.status}
                    onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </FormField>
                <FormField label="Due date">
                  <input
                    className="input"
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm((current) => ({ ...current, dueDate: event.target.value }))}
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Description">
                    <textarea
                      className="input min-h-28"
                      value={taskForm.description}
                      onChange={(event) =>
                        setTaskForm((current) => ({ ...current, description: event.target.value }))
                      }
                    />
                  </FormField>
                </div>
                <button disabled={creatingTask} className="btn-primary md:col-span-2">
                  {creatingTask ? "Creating task..." : "Create task"}
                </button>
              </form>
            </div>

            <div className="panel p-6">
              <h3 className="text-xl font-semibold text-white">Project Tasks</h3>
              <div className="mt-6 space-y-4">
                {project.tasks.length ? (
                  project.tasks.map((task) => (
                    <div key={task._id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{task.title}</h4>
                          <p className="mt-2 text-sm text-slate-400">{task.description || "No description provided."}</p>
                          <p className="mt-3 text-sm text-slate-500">
                            Assigned to {task.assignedTo?.name} | Due {formatDate(task.dueDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge value={task.status} />
                          <StatusBadge value={task.priority} />
                          {isOverdue(task) ? (
                            <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-200">
                              Overdue
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No tasks yet"
                    description="Create the first task for this project to start tracking work."
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};
