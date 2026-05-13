import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/lib/prisma";

import { Role } from "@/generated/prisma/client";

import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [Google],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account && token.email) {
        // check existing user
        const existingUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });

        // user already has role
        if (existingUser?.role) {
          token.role = existingUser.role;

          return token;
        }

        // first time login
        const cookieStore = await cookies();

        const loginRole = cookieStore.get("login_role")?.value;

        const role = loginRole === "ADMIN" ? Role.ADMIN : Role.USER;

        token.role = role;

        await prisma.user.update({
          where: {
            email: token.email,
          },
          data: {
            role,
          },
        });
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;

        session.user.role = token.role as Role;
      }

      return session;
    },

    async authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      // admin routes
      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }

      // user routes
      if (pathname.startsWith("/dashboard")) {
        return auth?.user?.role === "USER";
      }

      return true;
    },
  },
});
