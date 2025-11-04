"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { HiUser, HiLogout, HiHeart, HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-black/50 border border-flame/20 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 bg-gradient-to-r from-flame to-sunset text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
      >
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-flame/20 rounded-lg hover:border-sunset transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-flame to-sunset flex items-center justify-center text-black font-bold text-sm">
          {session.user.name?.[0].toUpperCase() || session.user.email?.[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline text-lavenderBlush text-sm font-medium">
          {session.user.name || session.user.email}
        </span>
        <HiChevronDown className={`w-4 h-4 text-gray transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-flame/20 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="py-2">
                <Link
                  href="/favorites"
                  className="flex items-center gap-2 px-4 py-2 text-lavenderBlush hover:bg-flame/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <HiHeart className="w-5 h-5" />
                  <span>Mis favoritos</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-lavenderBlush hover:bg-flame/20 transition-colors"
                >
                  <HiLogout className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

