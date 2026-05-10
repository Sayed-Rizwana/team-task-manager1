import { ShieldCheck, User2 } from "lucide-react";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <SectionHeader
        eyebrow="Profile"
        title="Your account details"
        description="Review the account information and access level attached to your workspace."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-brand-500/15 p-4 text-brand-200">
              <User2 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">{user?.name}</h3>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-500/15 p-4 text-emerald-200">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white capitalize">{user?.role}</h3>
              <p className="text-slate-400">Role-based access is active for this account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
