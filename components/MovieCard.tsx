"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Movie } from "@/types/tmdb";
import { getPosterUrl, getMovieStatus } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const status = getMovieStatus(movie);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/movie/${movie.id}`}
        className="group block bg-black/50 border border-flame/10 rounded-xl overflow-hidden card-hover"
      >
      <div className="relative aspect-[2/3] bg-black/50 overflow-hidden">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-sunset/30">
          <span className="text-sunset font-bold text-xs sm:text-sm">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
        <h3 className="font-semibold text-lavenderBlush line-clamp-2 group-hover:text-sunset transition-colors duration-300 text-sm sm:text-base leading-tight">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray flex-shrink-0">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
          </p>
          <p className="text-[10px] sm:text-xs text-flame font-medium truncate">{status}</p>
        </div>
      </div>
    </Link>
    </motion.div>
  );
}

