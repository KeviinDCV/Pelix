"use client";

import { motion } from "framer-motion";
import type { Movie } from "@/types/tmdb";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  title: string;
}

export default function MovieGrid({ movies, title }: MovieGridProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 sm:mb-16">
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-flame to-sunset rounded-full flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-lavenderBlush flex-shrink-0">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-flame/30 to-transparent min-w-0" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
      >
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} priority={index < 5} />
        ))}
      </motion.div>
    </section>
  );
}

