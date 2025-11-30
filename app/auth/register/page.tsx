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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/10 border border-white/10 p-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              CREAR CUENTA
            </h1>
            <p className="text-white/60 text-sm">
              Únete a PELIX y guarda tus favoritas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-white/80 mb-2 text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-white/80 mb-2 text-sm font-medium">
                Nombre de usuario
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="usuario123"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white/80 mb-2 text-sm font-medium">
                Confirmar contraseña
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "CREANDO..." : "REGISTRARSE"}
            </button>
          </form>

          <p className="text-white/60 text-center mt-6 text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-white hover:text-white/80 transition-colors font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

