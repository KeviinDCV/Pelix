"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Genre } from "@/types/tmdb";

interface GenreCardProps {
  genre: Genre;
  index: number;
}

export default function GenreCard({ genre, index }: GenreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/genres/${genre.id}`}
        className="group relative bg-black/50 border-2 border-flame/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-sunset transition-all duration-300 card-hover overflow-hidden block"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-flame/10 via-transparent to-sunset/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-lavenderBlush group-hover:text-sunset transition-colors duration-300 text-center sm:text-left">
            {genre.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

