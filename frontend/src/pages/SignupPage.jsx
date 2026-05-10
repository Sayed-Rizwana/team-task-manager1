import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { execute, loading } = useAsync(signup);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await execute(formData);
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="panel w-full max-w-xl p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Get started</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Create your account</h2>
        <p className="mt-2 text-sm text-slate-400">Set up your team workspace in a minute.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-200">Full name</span>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            />
          </label>

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
            <span className="mb-2 block text-sm text-slate-200">Role</span>
            <select
              className="input"
              value={formData.role}
              onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-200">Password</span>
            <input
              type="password"
              minLength={6}
              required
              className="input"
              value={formData.password}
              onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            />
          </label>
        </div>

        <button disabled={loading} className="btn-primary mt-8 w-full">
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-300">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};
