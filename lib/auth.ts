import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        // Si no hay POSTGRES_URL configurado, retornar null silenciosamente
        if (!process.env.POSTGRES_URL) {
          console.warn("POSTGRES_URL no configurado. La autenticación no funcionará.");
          return null;
        }

        try {
          const user = await getUserByEmail(email);
          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback-secret-for-development-only",
  debug: process.env.NODE_ENV === "development",
};

// Validar que el secret esté configurado
if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  console.warn("⚠️ NEXTAUTH_SECRET no está configurado. La autenticación puede no funcionar correctamente.");
  console.warn("Genera un secreto y agrégalo a .env.local:");
  console.warn("NEXTAUTH_SECRET=tu_secreto_generado");
}

// Crear instancia única de NextAuth
const nextAuthInstance = NextAuth(authOptions);

// Exportar auth() para uso en server components
export const { auth } = nextAuthInstance;

// Exportar handlers para uso en route handlers
export const { handlers } = nextAuthInstance;
