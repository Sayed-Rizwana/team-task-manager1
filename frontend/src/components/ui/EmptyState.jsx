export const EmptyState = ({ title, description }) => (
  <div className="panel flex min-h-64 flex-col items-center justify-center p-8 text-center">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-3 max-w-md text-sm text-slate-400">{description}</p>
  </div>
);
