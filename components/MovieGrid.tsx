"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import type { Movie } from "@/types/tmdb";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  title: string;
  showViewAll?: boolean;
}

export default function MovieGrid({ movies, title, showViewAll = false }: MovieGridProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">{title}</h2>
          <p className="text-muted-foreground">Descubre las mejores películas.</p>
        </div>
        {showViewAll && (
          <Link
            href="/genres"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
          >
            VER TODO <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {movies.slice(0, 8).map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <MovieCard movie={movie} priority={index < 4} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

