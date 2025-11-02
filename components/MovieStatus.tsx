"use client";

import { HiPlay, HiFilm, HiClock } from "react-icons/hi";
import { motion } from "framer-motion";

interface MovieStatusProps {
  releaseDate: string;
}

export default function MovieStatus({ releaseDate }: MovieStatusProps) {
  const releaseDateObj = new Date(releaseDate);
  const today = new Date();
  const daysDiff = Math.floor(
    (releaseDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let status: { text: string; icon: JSX.Element };
  
  // Si la película se estrena en el futuro
  if (daysDiff > 30) {
    status = {
      text: "Próximamente",
      icon: <HiClock className="w-4 h-4 sm:w-5 sm:h-5" />,
    };
  } else if (daysDiff > 0 && daysDiff <= 30) {
    // Se estrena en los próximos 30 días
    status = {
      text: "En cines",
      icon: <HiFilm className="w-4 h-4 sm:w-5 sm:h-5" />,
    };
  } else if (daysDiff <= 0 && daysDiff >= -90) {
    // Se estrenó hace menos de 90 días (probablemente aún en cines)
    status = {
      text: "En cines",
      icon: <HiFilm className="w-4 h-4 sm:w-5 sm:h-5" />,
    };
  } else {
    // Se estrenó hace más de 90 días (ya disponible en streaming)
    status = {
      text: "Disponible",
      icon: <HiPlay className="w-4 h-4 sm:w-5 sm:h-5" />,
    };
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 sm:gap-2 text-flame font-medium text-sm sm:text-base md:text-lg"
    >
      <span className="flex-shrink-0">{status.icon}</span>
      <span className="whitespace-nowrap">{status.text}</span>
    </motion.span>
  );
}

