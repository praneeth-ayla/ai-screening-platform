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
    async signIn() {
      return true;
    },

    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      // get user from DB
      let dbUser = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      // no user found
      if (!dbUser) {
        return token;
      }

      // First login: role is still null
      if (!dbUser.role) {
        const cookieStore = await cookies();

        const loginRole = cookieStore.get("login_role")?.value;

        const role = loginRole === "ADMIN" ? Role.ADMIN : Role.USER;

        // update role safely here
        dbUser = await prisma.user.update({
          where: {
            email: token.email,
          },

          data: {
            role,
          },
        });
      }

      // attach role to token
      token.role = dbUser.role;

      return token;
    },

    // Expose session to frontend
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;

        session.user.role = token.role as Role | null;
      }

      return session;
    },

    //Route protection
    async authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      // admin routes
      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }

      // dashboard routes
      if (pathname.startsWith("/dashboard")) {
        return auth?.user?.role === "USER" || auth?.user?.role === "ADMIN";
      }

      return true;
    },
  },
});
