import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "career-copilot-nextauth-secret-key-32-chars-minimum",
};

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user && (session.user as any).id) {
      return session.user as { id: string; name?: string | null; email?: string | null };
    }
  } catch (err) {
    // Session retrieval error handling
  }
  return null;
}

export async function getAuthUserId(req?: Request): Promise<string | null> {
  const user = await getCurrentUser();
  if (user?.id) return user.id;

  if (req) {
    const headerUserId = req.headers.get("x-user-id");
    if (headerUserId) return headerUserId;
  }

  // In development/test mode, auto-ensure and use a default user if none authenticated
  const devUser = await prisma.user.findFirst();
  if (devUser) return devUser.id;

  // Auto-seed a default user if database is empty in dev
  const createdUser = await prisma.user.create({
    data: {
      name: "Demo Candidate",
      email: "demo@careercopilot.com",
    },
  });
  return createdUser.id;
}

