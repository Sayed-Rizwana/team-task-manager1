import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { execute, loading } = useAsync(login);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await execute(formData);
    navigate(location.state?.from?.pathname || "/", { replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-slate-950 p-10 lg:flex">
        <div className="panel relative flex flex-1 flex-col justify-between overflow-hidden p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_32%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.45em] text-brand-300">MERN Productivity Suite</p>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-tight text-white">
              Keep teams aligned from kickoff to delivery.
            </h1>
            <p className="mt-6 max-w-lg text-base text-slate-300">
              Manage projects, assign work, track deadlines, and surface momentum with a calm, clear dashboard.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-4">
            {[
              ["Projects", "Create structured workspaces"],
              ["Tasks", "Assign and track ownership"],
              ["Insights", "Watch throughput and risk"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="panel w-full max-w-md p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Welcome back</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Log in to your workspace</h2>
          <p className="mt-2 text-sm text-slate-400">Use your account credentials to continue.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-200">Email</span>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-200">Password</span>
              <input
                type="password"
                required
                className="input"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
              />
            </label>
          </div>

          <button disabled={loading} className="btn-primary mt-8 w-full">
            {loading ? "Signing in..." : "Log in"}
          </button>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{" "}
            <Link to="/signup" className="font-medium text-brand-300">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};
