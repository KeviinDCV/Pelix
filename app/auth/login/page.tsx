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
    <main className="min-h-screen bg-black py-6 sm:py-8 md:py-12 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 border border-flame/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-sm"
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2 sm:mb-3 text-center">
              Iniciar Sesión
            </h1>
            <p className="text-gray text-center text-sm sm:text-base">
              Ingresa a tu cuenta de Pelix
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="email" className="block text-lavenderBlush mb-2 text-xs sm:text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/50 border border-flame/20 rounded-lg text-lavenderBlush placeholder-gray focus:outline-none focus:border-sunset focus:ring-2 focus:ring-sunset/20 transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-lavenderBlush mb-2 text-xs sm:text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/50 border border-flame/20 rounded-lg text-lavenderBlush placeholder-gray focus:outline-none focus:border-sunset focus:ring-2 focus:ring-sunset/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-flame to-sunset text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6 sm:mt-8"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-gray text-center mt-5 sm:mt-6 text-xs sm:text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className="text-sunset hover:text-flame transition-colors font-medium">
              Regístrate aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

