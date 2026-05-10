import { cn } from "../../utils/cn";

const styles = {
  Todo: "bg-slate-700/70 text-slate-100",
  "In Progress": "bg-amber-500/20 text-amber-200",
  Completed: "bg-emerald-500/20 text-emerald-200",
  Low: "bg-sky-500/20 text-sky-200",
  Medium: "bg-orange-500/20 text-orange-200",
  High: "bg-rose-500/20 text-rose-200",
  Active: "bg-brand-500/20 text-brand-200",
  Planning: "bg-indigo-500/20 text-indigo-200",
  Archived: "bg-slate-600/50 text-slate-200",
  admin: "bg-fuchsia-500/20 text-fuchsia-200",
  member: "bg-cyan-500/20 text-cyan-200",
};

export const StatusBadge = ({ value }) => (
  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", styles[value] || "bg-white/10 text-white")}>
    {value}
  </span>
);
