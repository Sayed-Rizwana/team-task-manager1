export const LoaderScreen = ({ label = "Loading..." }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
    <div className="panel flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-400" />
      <div>
        <h2 className="text-xl font-semibold text-white">Preparing your workspace</h2>
        <p className="mt-2 text-sm text-slate-400">{label}</p>
      </div>
    </div>
  </div>
);
