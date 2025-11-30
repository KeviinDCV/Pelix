"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { HiOutlineSearch, HiAdjustments } from "react-icons/hi";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import type { Movie } from "@/types/tmdb";

export default function SearchPage() {
  const { data: session } = useSession();
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
          
          if (session?.user?.id && query.trim()) {
            try {
              await fetch("/api/search-history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: query.trim() }),
              });
            } catch (error) {
              console.error("Error al guardar historial:", error);
            }
          }
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error buscando películas:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, session]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Buscar</h1>
            <p className="text-white/60">Encuentra tu próxima película favorita.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar películas..." 
                className="w-full bg-secondary/10 border border-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                autoFocus
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button className="p-3 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors">
              <HiAdjustments className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/60 text-lg mb-2">No se encontraron películas</p>
            <p className="text-white/40 text-sm">Intenta con otro término de búsqueda</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-display font-bold text-white">
                Resultados
              </h2>
              <span className="text-sm text-white/40">({results.length})</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 pb-20">
              {results.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} priority={index < 4} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasSearched && (
          <div className="text-center py-24">
            <HiOutlineSearch className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <p className="text-white/40 text-lg">Escribe para buscar películas</p>
          </div>
        )}
      </div>
    </div>
  );
}
