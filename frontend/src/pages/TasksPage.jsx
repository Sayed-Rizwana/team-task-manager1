import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/axios";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAsync } from "../hooks/useAsync";
import { formatDate, isOverdue } from "../utils/format";

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    const { data } = await api.get("/tasks", {
      params: statusFilter ? { status: statusFilter } : {},
    });
    setTasks(data);
  };

  const { execute: fetchTasks, loading } = useAsync(loadTasks);
  const { execute: saveTask, loading: saving } = useAsync(async () => {
    await api.put(`/tasks/${editingTask._id}`, {
      title: editingTask.title,
      description: editingTask.description,
      status: editingTask.status,
      priority: editingTask.priority,
      dueDate: editingTask.dueDate,
      assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo,
    });
    toast.success("Task updated.");
    setEditingTask(null);
    await loadTasks();
  });
  const { execute: removeTask } = useAsync(async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    toast.success("Task removed.");
    await loadTasks();
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, statusFilter]);

  const groupedCounts = useMemo(
    () => ({
      Todo: tasks.filter((task) => task.status === "Todo").length,
      "In Progress": tasks.filter((task) => task.status === "In Progress").length,
      Completed: tasks.filter((task) => task.status === "Completed").length,
    }),
    [tasks]
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Task Board"
        title="Own the details without losing the bigger picture"
        description="Filter, update, and monitor every assigned task across your active projects."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {Object.entries(groupedCounts).map(([label, value]) => (
          <div key={label} className="panel p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          </div>
        ))}
        <div className="panel p-5">
          <FormField label="Filter by status">
            <select className="input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </FormField>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-6">
          <h3 className="text-xl font-semibold text-white">All Tasks</h3>
          <div className="mt-6 space-y-4">
            {!loading && tasks.length ? (
              tasks.map((task) => (
                <div key={task._id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-brand-300">{task.project?.title}</p>
                      <h4 className="mt-2 text-lg font-semibold text-white">{task.title}</h4>
                      <p className="mt-2 text-sm text-slate-400">{task.description || "No description yet."}</p>
                      <p className="mt-4 text-sm text-slate-500">
                        {task.assignedTo?.name} | Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge value={task.status} />
                      <StatusBadge value={task.priority} />
                      {isOverdue(task) ? (
                        <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-200">
                          Overdue
                        </span>
                      ) : null}
                      <button onClick={() => setEditingTask(task)} className="btn-secondary gap-2">
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => removeTask(task._id)}
                        className="btn-secondary gap-2 text-rose-200 hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No tasks available"
                description="Tasks created inside your projects will show up here for quick updates."
              />
            )}
          </div>
        </section>

        <section className="panel p-6">
          <h3 className="text-xl font-semibold text-white">Quick Edit</h3>
          {editingTask ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveTask();
              }}
              className="mt-6 space-y-4"
            >
              <FormField label="Task title">
                <input
                  className="input"
                  value={editingTask.title}
                  onChange={(event) => setEditingTask((current) => ({ ...current, title: event.target.value }))}
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  className="input min-h-28"
                  value={editingTask.description}
                  onChange={(event) =>
                    setEditingTask((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </FormField>
              <FormField label="Status">
                <select
                  className="input"
                  value={editingTask.status}
                  onChange={(event) => setEditingTask((current) => ({ ...current, status: event.target.value }))}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </FormField>
              <FormField label="Priority">
                <select
                  className="input"
                  value={editingTask.priority}
                  onChange={(event) => setEditingTask((current) => ({ ...current, priority: event.target.value }))}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </FormField>
              <FormField label="Due date">
                <input
                  type="date"
                  className="input"
                  value={editingTask.dueDate?.slice(0, 10)}
                  onChange={(event) => setEditingTask((current) => ({ ...current, dueDate: event.target.value }))}
                />
              </FormField>
              <button disabled={saving} className="btn-primary w-full">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          ) : (
            <EmptyState
              title="Select a task to edit"
              description="Choose any task from the list to update its status, priority, or due date."
            />
          )}
        </section>
      </div>
    </div>
  );
};
