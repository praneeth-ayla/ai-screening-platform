"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();

  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN";

  const loginAsCandidate = async () => {
    document.cookie = "login_role=USER; path=/";

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

  const navItems = isAdmin
    ? [
        {
          label: "Dashboard",
          href: "/recruiter/dashboard",
        },
        {
          label: "Jobs",
          href: "/recruiter/dashboard/jobs",
        },
      ]
    : [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Dashboard",
          href: "/candidate/dashboard",
        },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-black">
            AI
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              HireFlow
            </div>

            <div className="text-xs text-zinc-500">AI Interview Platform</div>
          </div>
        </Link>

        {/* Nav Links */}
        {session && (
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-5 py-3 text-sm transition ${
                    active
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* User Card */}
              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 md:flex">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-10 w-10 rounded-full border border-white/10"
                  />
                )}

                <div>
                  <div className="text-sm font-medium text-white">
                    {session.user.name}
                  </div>

                  <div className="text-xs text-zinc-500">
                    {isAdmin ? "Recruiter" : "Candidate"}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              {/* Candidate Login */}
              <button
                onClick={loginAsCandidate}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
              >
                Candidate Login
              </button>

              {/* Recruiter Login */}
              <button
                onClick={loginAsRecruiter}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Recruiter Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
