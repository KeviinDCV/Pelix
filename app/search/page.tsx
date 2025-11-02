"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import type { Movie } from "@/types/tmdb";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error buscando películas:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <main className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 gradient-text">
            Buscar en Pelix
          </h1>
          <p className="text-gray text-base sm:text-lg px-4">
            Encuentra tu próxima película favorita
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
        >
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por nombre de película..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/50 border-2 border-flame/20 rounded-xl text-lavenderBlush placeholder-gray focus:outline-none focus:border-sunset focus:ring-2 focus:ring-sunset/20 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm"
              autoFocus
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-sunset border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </motion.div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4">
            <p className="text-gray text-lg sm:text-xl mb-2">No se encontraron películas</p>
            <p className="text-gray/70 text-sm sm:text-base">Intenta con otro término de búsqueda</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-0">
              <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-flame to-sunset rounded-full flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-lavenderBlush flex-shrink-0">
                Resultados ({results.length})
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-flame/30 to-transparent min-w-0" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
            >
              {results.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  priority={index < 5}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

