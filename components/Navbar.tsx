"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiMenu, HiX } from "react-icons/hi";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <Link 
          href="/" 
          className="text-2xl font-display font-bold tracking-tighter text-white hover:opacity-80 transition-opacity"
        >
          PELIX
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/search"
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Buscar"
          >
            <HiOutlineSearch className="w-5 h-5" />
          </Link>
          <Link
            href="/genres"
            className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wide"
          >
            Películas
          </Link>
          <Link
            href="/genres"
            className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wide"
          >
            Géneros
          </Link>
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background border-l border-white/10 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <span className="text-lg font-display font-bold text-white">Menú</span>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex-1 py-6">
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Inicio</span>
                  </Link>
                  <Link
                    href="/genres"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Películas</span>
                  </Link>
                  <Link
                    href="/genres"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Géneros</span>
                  </Link>
                </div>

                {/* User Menu at bottom */}
                <div className="p-6 border-t border-white/10">
                  <UserMenu />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
