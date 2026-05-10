export const StatCard = ({ label, value, hint }) => (
  <div className="panel p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-brand-200">{hint}</p>
  </div>
);
