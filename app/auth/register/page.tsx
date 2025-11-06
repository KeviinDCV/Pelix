"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || "Error al registrar";
        toast.error(errorMessage);
        return;
      }

      toast.success("¡Cuenta creada exitosamente!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-black pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-12 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 border border-flame/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-sm"
        >
          <div className="mb-4 sm:mb-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2 sm:mb-3 text-center">
              Crear Cuenta
            </h1>
            <p className="text-gray text-center text-sm sm:text-base">
              Únete a Pelix y guarda tus películas favoritas
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/50 border border-flame/20 rounded-lg text-lavenderBlush placeholder-gray focus:outline-none focus:border-sunset focus:ring-2 focus:ring-sunset/20 transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-lavenderBlush mb-2 text-xs sm:text-sm font-medium">
                Nombre de usuario
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                  autoComplete="username"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/50 border border-flame/20 rounded-lg text-lavenderBlush placeholder-gray focus:outline-none focus:border-sunset focus:ring-2 focus:ring-sunset/20 transition-all"
                  placeholder="usuario123"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/50 border border-flame/20 rounded-lg text-lavenderBlush placeholder-gray focus:outline-none focus:border-sunset focus:ring-2 focus:ring-sunset/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lavenderBlush mb-2 text-xs sm:text-sm font-medium">
                Confirmar contraseña
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
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
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="text-gray text-center mt-5 sm:mt-6 text-xs sm:text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-sunset hover:text-flame transition-colors font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

