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
        className="relative z-30 bg-gradient-to-r from-flame/20 to-sunset/20 border-b border-flame/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <HiInformationCircle className="w-5 h-5 sm:w-6 sm:h-6 text-sunset flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-lavenderBlush text-sm sm:text-base leading-relaxed">
                <span className="font-semibold text-sunset">Importante:</span> Esta página{" "}
                <span className="font-medium">no almacena películas</span>. Solo te ayudamos a{" "}
                encontrar enlaces a otras páginas donde puedes verlas. Ten cuidado con los anuncios y{" "}
                <span className="font-medium">no descargues archivos</span> ni{" "}
                <span className="font-medium">compartas información personal</span> en esos sitios.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray hover:text-lavenderBlush transition-colors flex-shrink-0 p-1 hover:bg-flame/20 rounded"
              aria-label="Cerrar aviso"
            >
              <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

