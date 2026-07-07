import { getCurrentSession } from "@/lib/session";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-xl bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Welcome to LOOP AI
        </h1>

        <div className="mt-6 space-y-3">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {session?.user?.name}
          </p>

          <p>
            <span className="font-semibold">Email:</span>{" "}
            {session?.user?.email}
          </p>

          <p>
            <span className="font-semibold">Role:</span>{" "}
            {session?.user?.role}
          </p>

          <p>
            <span className="font-semibold">Workspace ID:</span>{" "}
            {session?.user?.workspaceId}
          </p>
        </div>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}