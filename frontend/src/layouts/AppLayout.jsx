import { Bell, FolderKanban, LayoutDashboard, ListTodo, LogOut, Menu, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-grid bg-[size:38px_38px]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-80 border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Team Task Manager</p>
              <h1 className="mt-3 text-2xl font-semibold text-white">Build momentum together</h1>
            </div>
          </div>

          <div className="panel mt-8 p-4">
            <p className="text-sm text-slate-400">Signed in as</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200">
              {user?.role}
            </span>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-500 text-slate-950"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button onClick={logout} className="btn-secondary mt-8 w-full gap-2">
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur xl:px-10">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setSidebarOpen((current) => !current)}
                className="btn-secondary lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div>
                <p className="text-sm text-slate-400">Stay on top of every sprint and follow-through.</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-secondary px-3">
                  <Bell size={16} />
                </button>
                <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right md:block">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
