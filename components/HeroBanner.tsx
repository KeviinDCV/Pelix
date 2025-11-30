"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlay, HiInformationCircle } from "react-icons/hi";
import { getBackdropUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";

interface HeroBannerProps {
  movies: Movie[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const featuredMovies = movies
    .filter((movie) => movie.backdrop_path && movie.overview)
    .slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  const backdropUrl = getBackdropUrl(currentMovie.backdrop_path);
  const releaseYear = currentMovie.release_date
    ? new Date(currentMovie.release_date).getFullYear()
    : null;

  const formatDuration = () => {
    // Asumiendo duración promedio si no está disponible
    return "2h";
  };

  return (
    <header className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={backdropUrl}
            alt={currentMovie.title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <span className="inline-block py-1 px-3 border border-white/20 text-xs font-medium tracking-widest uppercase text-white/80 mb-6 backdrop-blur-sm">
              En Cartelera
            </span>

            {/* Título */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-6 uppercase">
              {currentMovie.title}
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-8 max-w-xl line-clamp-3">
              {currentMovie.overview}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href={`/movie/${currentMovie.id}`}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 font-medium hover:bg-white/90 transition-colors"
              >
                <HiPlay className="w-5 h-5 fill-current" />
                VER AHORA
              </Link>
              <Link
                href={`/movie/${currentMovie.id}`}
                className="flex items-center gap-3 px-8 py-4 font-medium text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <HiInformationCircle className="w-5 h-5" />
                MÁS INFO
              </Link>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-white/60">
              {releaseYear && <span>{releaseYear}</span>}
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{formatDuration()}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-1">
                <span className="text-white font-bold">{currentMovie.vote_average.toFixed(1)}</span>
                <span>/10</span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicadores minimalistas en la parte inferior */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className={`h-1 transition-all duration-500 ${
              index === currentIndex
                ? "w-12 bg-white"
                : "w-6 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Ir a película ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
}

