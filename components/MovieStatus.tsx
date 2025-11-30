"use client";

import { HiPlay, HiFilm, HiClock } from "react-icons/hi";

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
  
  if (daysDiff > 30) {
    status = {
      text: "Próximamente",
      icon: <HiClock className="w-4 h-4" />,
    };
  } else if (daysDiff > 0 && daysDiff <= 30) {
    status = {
      text: "En cines",
      icon: <HiFilm className="w-4 h-4" />,
    };
  } else if (daysDiff <= 0 && daysDiff >= -90) {
    status = {
      text: "En cines",
      icon: <HiFilm className="w-4 h-4" />,
    };
  } else {
    status = {
      text: "Disponible",
      icon: <HiPlay className="w-4 h-4" />,
    };
  }

  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 text-sm font-medium">
      <span className="flex-shrink-0">{status.icon}</span>
      <span className="whitespace-nowrap uppercase tracking-wide">{status.text}</span>
    </span>
  );
}

