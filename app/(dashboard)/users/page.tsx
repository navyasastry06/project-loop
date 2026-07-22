"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Trash2, 
  Mail, 
  Lock, 
  ShieldCheck, 
  User, 
  Sparkles,
  ArrowRight
} from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ANALYST" | "VIEWER";
  createdAt: string;
};

type InviteForm = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "ANALYST" | "VIEWER";
};

export default function UsersPage() {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm<InviteForm>();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = session?.user?.role === "ADMIN";

  async function loadUsers() {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (result.success) {
        setUsers(result.users);
      } else {
        setError(result.message || "Failed to load users.");
      }
    } catch (err) {
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  }

  async function onInvite(data: InviteForm) {
    setInviting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("User invited successfully!");
        reset();
        await loadUsers();
      } else {
        setError(result.message || "Failed to invite user.");
      }
    } catch (err) {
      setError("An error occurred while inviting the user.");
    } finally {
      setInviting(false);
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("User role updated successfully.");
        await loadUsers();
      } else {
        setError(result.message || "Failed to update role.");
      }
    } catch (err) {
      setError("An error occurred while updating the role.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("User deleted successfully.");
        await loadUsers();
      } else {
        setError(result.message || "Failed to delete user.");
      }
    } catch (err) {
      setError("An error occurred while deleting the user.");
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#4C74D9] border-t-transparent animate-spin"></div>
          <p className="text-sm font-extrabold text-[#2B4DA2]/60 uppercase tracking-widest font-sans">
            Loading Users Directory...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl text-center py-16 space-y-6 bg-[#F8B4D9] rounded-[32px] border border-[#2B4DA2]/10 p-8 shadow-xs text-left"
      >
        <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto border border-[#2B4DA2]/10 shadow-3xs">
          <Lock className="h-6 w-6 text-[#2B4DA2]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-[#2B4DA2] font-heading text-center">Presentation Lockout</h2>
          <p className="text-xs text-[#2B4DA2]/85 leading-relaxed font-sans font-semibold text-center max-w-sm mx-auto">
            Only workspace Administrators are allowed to view, modify, or delete team slide privileges. Contact your admin dashboard manager for access.
          </p>
        </div>
        <img 
          src="/7.png" 
          alt="Access denied flat illustration" 
          className="max-h-[160px] mx-auto animate-float object-contain"
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pb-16 text-left max-w-5xl"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4DA2]/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] mt-2.5 font-heading">
            Team Workspace Directory
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Configure permission policies, update presenter accounts, and invite teammates.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-semibold text-emerald-700">
          ✨ {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        {/* Invite User Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-[24px] border border-[#2B4DA2]/10 bg-[#D8C4FF] p-6 md:p-8 shadow-xs relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A98AE5]/35 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-xl font-black text-[#2B4DA2] font-heading flex items-center gap-2 mb-6 relative z-10">
            <UserPlus className="h-5 w-5 bg-white rounded-full p-0.5 text-[#A98AE5]" />
            <span>Invite Presenter</span>
          </h2>

          <form onSubmit={handleSubmit(onInvite)} className="space-y-4 relative z-10">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Full Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-2.5 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
                {...register("name")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Email Address</label>
              <input
                type="email"
                required
                placeholder="jane@loopai.com"
                className="w-full rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-2.5 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
                {...register("email")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Password Code</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-2.5 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
                {...register("password")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Access Level</label>
              <select
                required
                className="w-full rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-2.5 outline-none text-xs font-bold text-[#2B4DA2] cursor-pointer"
                {...register("role")}
              >
                <option value="VIEWER">Viewer</option>
                <option value="ANALYST">Analyst</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={inviting}
              className="w-full mt-4 rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] py-3.5 font-bold text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-xs"
            >
              {inviting ? "Sending Request..." : "✉️ Send Slide Invitation"}
            </button>
          </form>
        </motion.div>

        {/* Directory Table Grid */}
        <div className="lg:col-span-2 rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-black text-[#2B4DA2] mb-6 font-heading flex items-center gap-2">
            <ShieldCheck className="h-5.5 w-5.5 text-[#4C74D9]" />
            <span>Workspace Presenters</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2B4DA2]/10 text-[#2B4DA2]/55 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">Presenter Account</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Role Policy</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B4DA2]/5">
                {users.map((u) => {
                  const isSelf = u.id === session?.user?.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#FFF6D6]/35 transition-colors">
                      <td className="py-4 px-3 font-semibold text-[#374151]">
                        <span className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-[#FFF6D6] border border-[#2B4DA2]/10 flex items-center justify-center text-[10px] font-black text-[#2B4DA2]">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                          <span>
                            {u.name} {isSelf && <span className="text-[10px] text-[#4C74D9] font-black ml-1 uppercase">(You)</span>}
                          </span>
                        </span>
                      </td>
                      
                      <td className="py-4 px-3 text-[#374151]/70 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#2B4DA2]/40" />
                          <span>{u.email}</span>
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        {isSelf ? (
                          <span className="inline-flex items-center rounded-full bg-[#D8C4FF] px-2.5 py-0.5 text-[9px] font-black text-[#2B4DA2] border border-[#2B4DA2]/10">
                            {u.role}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="rounded-xl border border-[#2B4DA2]/10 bg-[#FAFAFC] px-2 py-1 text-[11px] font-extrabold text-[#2B4DA2] cursor-pointer outline-none focus:border-[#4C74D9]"
                          >
                            <option value="VIEWER">Viewer</option>
                            <option value="ANALYST">Analyst</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2B4DA2]/50 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
