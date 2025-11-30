"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed } from "react-icons/hi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciales incorrectas");
      } else {
        toast.success("¡Bienvenido!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/10 border border-white/10 p-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              INICIAR SESIÓN
            </h1>
            <p className="text-white/60 text-sm">
              Ingresa a tu cuenta de PELIX
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white/80 mb-2 text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white/80 mb-2 text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "INICIANDO..." : "ENTRAR"}
            </button>
          </form>

          <p className="text-white/60 text-center mt-6 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className="text-white hover:text-white/80 transition-colors font-medium">
              Regístrate aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

