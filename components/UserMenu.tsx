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
      <div className="w-8 h-8 bg-secondary animate-pulse" />
    );
  }

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="px-6 py-2 bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm"
      >
        ENTRAR
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-white/70 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-bold text-sm">
          {session.user.name?.[0].toUpperCase() || session.user.email?.[0].toUpperCase()}
        </div>
        <HiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
              className="absolute right-0 mt-2 w-48 bg-popover backdrop-blur-md border border-white/10 shadow-xl z-50 overflow-hidden"
            >
              <div className="py-2">
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <HiHeart className="w-4 h-4" />
                  <span>Mis favoritos</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-sm"
                >
                  <HiLogout className="w-4 h-4" />
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

