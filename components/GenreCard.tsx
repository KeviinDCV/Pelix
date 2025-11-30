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
    >
      <Link
        href={`/genres/${genre.id}`}
        className="group aspect-video border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="font-display font-bold text-lg md:text-xl tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">
          {genre.name}
        </span>
      </Link>
    </motion.div>
  );
}

