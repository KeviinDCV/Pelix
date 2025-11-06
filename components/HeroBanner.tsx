"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiPlay } from "react-icons/hi";
import { getBackdropUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";

interface HeroBannerProps {
  movies: Movie[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  // Filtrar solo películas con backdrop
  const featuredMovies = movies
    .filter((movie) => movie.backdrop_path && movie.overview)
    .slice(0, 5); // Limitar a 5 películas

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play cada 5 segundos
  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  const backdropUrl = getBackdropUrl(currentMovie.backdrop_path);
  const releaseYear = currentMovie.release_date
    ? new Date(currentMovie.release_date).getFullYear()
    : null;


  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 30,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -30,
    },
  };

  const [direction, setDirection] = useState(0);

  const goToSlide = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Actualizar dirección para auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      setDirection(1);
    }
  }, [currentIndex, isAutoPlaying]);

  return (
    <div className="relative z-20 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[65vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={backdropUrl}
            alt={currentMovie.title}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
          {/* Gradientes superpuestos */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-2xl lg:max-w-3xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  opacity: { duration: 0.4, delay: 0.1 },
                  y: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
                }}
              >
                {/* Botón Ver ahora */}
                <Link
                  href={`/movie/${currentMovie.id}`}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-flame to-sunset text-black font-bold rounded-lg hover:opacity-90 transition-opacity mb-4 sm:mb-6 text-sm sm:text-base"
                >
                  <HiPlay className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Ver ahora</span>
                </Link>

                {/* Título */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-lavenderBlush mb-3 sm:mb-4 md:mb-5 line-clamp-2">
                  {currentMovie.title}
                  {releaseYear && (
                    <span className="text-gray/70 font-normal ml-2 sm:ml-3">
                      ({releaseYear})
                    </span>
                  )}
                </h2>

                {/* Descripción */}
                <p className="text-gray text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 line-clamp-3 sm:line-clamp-4">
                  {currentMovie.overview}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-flame/30">
                    <span className="text-sunset font-bold text-sm sm:text-base">
                      TMDB {currentMovie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full border border-flame/30 hover:border-flame transition-all"
        aria-label="Película anterior"
      >
        <HiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-lavenderBlush" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full border border-flame/30 hover:border-flame transition-all"
        aria-label="Siguiente película"
      >
        <HiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-lavenderBlush" />
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 sm:w-10 h-2 sm:h-3 bg-gradient-to-r from-flame to-sunset"
                : "w-2 sm:w-3 h-2 sm:h-3 bg-gray/50 hover:bg-gray/70"
            }`}
            aria-label={`Ir a película ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

