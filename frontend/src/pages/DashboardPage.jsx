import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock3, FolderOpen } from "lucide-react";
import { api } from "../services/axios";
import { PriorityBarChart } from "../components/charts/PriorityBarChart";
import { StatusPieChart } from "../components/charts/StatusPieChart";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAsync } from "../hooks/useAsync";
import { formatRelative } from "../utils/format";

const icons = {
  totalProjects: FolderOpen,
  totalTasks: Activity,
  completedTasks: CheckCircle2,
  pendingTasks: Clock3,
  overdueTasks: AlertTriangle,
};

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const { execute, loading } = useAsync(async () => {
    const { data } = await api.get("/dashboard/stats");
    setStats(data);
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const summary = stats?.summary || {};

  return (
    <div>
      <SectionHeader
        eyebrow="Overview"
        title="Team performance at a glance"
        description="Track project health, completion trends, and tasks that need attention."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["totalProjects", "Total Projects", "Live workspaces"],
          ["totalTasks", "Total Tasks", "Across all projects"],
          ["completedTasks", "Completed Tasks", "Closed and shipped"],
          ["pendingTasks", "Pending Tasks", "Still in motion"],
          ["overdueTasks", "Overdue Tasks", "Needs follow-up"],
        ].map(([key, label, hint]) => {
          const Icon = icons[key];
          return (
            <div key={key} className="panel p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{summary[key] ?? 0}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-brand-200">{hint}</p>
                </div>
                <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-200">
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <StatusPieChart data={stats?.charts?.tasksByStatus || []} />
        <PriorityBarChart data={stats?.charts?.tasksByPriority || []} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <p className="mt-1 text-sm text-slate-400">Latest task changes across your workspace.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {!loading && stats?.recentActivity?.length ? (
              stats.recentActivity.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.projectTitle} | Assigned to {item.assignedTo}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge value={item.status} />
                      <span className="text-xs text-slate-500">{formatRelative(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No recent activity yet"
                description="Once your team starts creating and updating tasks, the latest changes will appear here."
              />
            )}
          </div>
        </section>

        <section className="space-y-4">
          <StatCard label="Momentum Check" value={`${summary.completedTasks ?? 0}/${summary.totalTasks ?? 0}`} hint="Completed vs total tasks" />
          <StatCard label="Risk Watch" value={summary.overdueTasks ?? 0} hint="Open overdue items" />
          <StatCard label="Project Load" value={summary.totalProjects ?? 0} hint="Active project spaces" />
        </section>
      </div>
    </div>
  );
};
