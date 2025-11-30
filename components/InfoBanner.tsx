"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiInformationCircle } from "react-icons/hi";

export default function InfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-0 right-0 z-40 mx-6 md:mx-12"
      >
        <div className="bg-secondary/80 backdrop-blur-md border border-white/10 p-4">
          <div className="flex items-start gap-4">
            <HiInformationCircle className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-white/80 leading-relaxed">
                <span className="font-medium text-white">Aviso:</span> Esta página{" "}
                no almacena películas. Solo te ayudamos a encontrar enlaces externos.{" "}
                <span className="text-white/60">Ten cuidado con los anuncios en esos sitios.</span>
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/40 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-white/10"
              aria-label="Cerrar aviso"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

