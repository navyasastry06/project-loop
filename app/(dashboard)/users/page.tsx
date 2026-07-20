"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";

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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading user settings...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg text-center py-16 space-y-4">
        <span className="text-5xl">🔒</span>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">
          Only administrators are allowed to view and manage workspace users. Contact your workspace admin for support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage member access permissions and invite new team members to the workspace.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Invite User Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h2>
          <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
            <Input label="Name" required {...register("name")} />
            <Input label="Email Address" type="email" required {...register("email")} />
            <Input label="Temporary Password" type="password" required {...register("password")} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                required
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
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
              className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {inviting ? "Inviting..." : "✉️ Send Invitation"}
            </button>
          </form>
        </div>

        {/* User Directory */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workspace Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium pb-3">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const isSelf = user.id === session?.user?.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        {user.name} {isSelf && <span className="text-xs text-blue-600 font-normal ml-1">(You)</span>}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3.5 px-4">
                        {isSelf ? (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
                          >
                            <option value="VIEWER">Viewer</option>
                            <option value="ANALYST">Analyst</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all text-xs font-medium"
                          >
                            🗑️ Delete
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
    </div>
  );
}
