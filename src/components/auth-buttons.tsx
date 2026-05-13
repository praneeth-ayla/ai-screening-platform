"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
  const { data: session } = useSession();

  const loginAsUser = async () => {
    document.cookie = "login_role=USER; path=/";

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  const loginAsAdmin = async () => {
    document.cookie = "login_role=ADMIN; path=/";

    await signIn("google", {
      callbackUrl: "/admin",
    });
  };

  // logged in
  if (session) {
    return (
      <div className="space-y-4">
        <div>
          <p>{session.user.name}</p>
          <p>{session.user.email}</p>
          <p>Role: {session.user.role}</p>
        </div>

        <div className="flex gap-4">
          {session.user.role === "ADMIN" && (
            <Link href="/admin" className="border px-4 py-2 rounded">
              Admin Page
            </Link>
          )}

          {session.user.role === "USER" && (
            <Link href="/dashboard" className="border px-4 py-2 rounded">
              Dashboard
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="border px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // not logged in
  return (
    <div className="flex gap-4">
      <button onClick={loginAsUser} className="border px-4 py-2 rounded">
        Sign In As User
      </button>

      <button onClick={loginAsAdmin} className="border px-4 py-2 rounded">
        Sign In As Admin
      </button>
    </div>
  );
}
