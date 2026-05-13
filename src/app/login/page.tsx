"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/dashboard",
          })
        }
      >
        User Login
      </button>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/admin?role=ADMIN",
          })
        }
      >
        Admin Login
      </button>
    </div>
  );
}
