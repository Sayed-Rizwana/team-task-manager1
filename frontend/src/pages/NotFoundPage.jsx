import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <div className="panel max-w-xl p-10 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-brand-300">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 text-sm text-slate-400">
        The page you were looking for does not exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Return to dashboard
      </Link>
    </div>
  </div>
);
