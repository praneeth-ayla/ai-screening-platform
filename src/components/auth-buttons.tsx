"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
  const { data: session } = useSession();

  const loginAsCandidate = async () => {
    document.cookie = "login_role=CANDIDATE; path=/";

    await signIn("google", {
      callbackUrl: "/candidate/dashboard",
    });
  };

  const loginAsRecruiter = async () => {
    document.cookie = "login_role=ADMIN; path=/";

    await signIn("google", {
      callbackUrl: "/recruiter/dashboard",
    });
  };

  // Logged In
  if (session) {
    return (
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-14 w-14 rounded-full border border-white/10"
              />
            )}

            <div>
              <h3 className="text-lg font-semibold text-white">
                {session.user.name}
              </h3>

              <p className="text-sm text-zinc-400">{session.user.email}</p>

              <div className="mt-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {session.user.role}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={
                session.user.role === "ADMIN"
                  ? "/recruiter/dashboard"
                  : "/candidate/dashboard"
              }
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Logged In
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <button
        onClick={loginAsCandidate}
        className="group relative overflow-hidden rounded-2xl bg-white px-6 py-4 text-left text-black transition hover:scale-[1.02]"
      >
        <div className="relative z-10">
          <div className="text-sm text-black/60">Candidate Access</div>

          <div className="mt-1 text-lg font-semibold">
            Continue as Candidate
          </div>

          <p className="mt-2 max-w-xs text-sm text-black/70">
            Apply to openings and attend AI voice screening call
          </p>
        </div>
      </button>

      <button
        onClick={loginAsRecruiter}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-left text-white backdrop-blur transition hover:bg-white/10 hover:scale-[1.02]"
      >
        <div className="relative z-10">
          <div className="text-sm text-zinc-400">Recruiter Access</div>

          <div className="mt-1 text-lg font-semibold">
            Continue as Recruiter
          </div>

          <p className="mt-2 max-w-xs text-sm text-zinc-400">
            Post jobs, review interview scores, and manage screened candidates.
          </p>
        </div>
      </button>
    </div>
  );
}
