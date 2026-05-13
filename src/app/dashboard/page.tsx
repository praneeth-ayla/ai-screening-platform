import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "USER") {
    redirect("/");
  }

  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">User Dashboard</h1>

      <div>
        <p>{session.user.name}</p>
        <p>{session.user.email}</p>
        <p>Role: {session.user.role}</p>
      </div>

      <form
        action={async () => {
          "use server";

          await signOut({
            redirectTo: "/",
          });
        }}
      >
        <button className="border px-4 py-2 rounded">Logout</button>
      </form>
    </main>
  );
}
