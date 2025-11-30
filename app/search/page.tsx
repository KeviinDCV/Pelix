"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { HiOutlineSearch, HiAdjustments, HiX } from "react-icons/hi";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import type { Movie } from "@/types/tmdb";

type SortOption = "relevance" | "rating_desc" | "rating_asc" | "date_desc" | "date_asc" | "title_asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "rating_desc", label: "Mayor puntuación" },
  { value: "rating_asc", label: "Menor puntuación" },
  { value: "date_desc", label: "Más recientes" },
  { value: "date_asc", label: "Más antiguas" },
  { value: "title_asc", label: "Título A-Z" },
];

export default function SearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

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

  // Ordenar resultados
  const sortedResults = useMemo(() => {
    if (sortBy === "relevance") return results;
    
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case "rating_desc":
          return b.vote_average - a.vote_average;
        case "rating_asc":
          return a.vote_average - b.vote_average;
        case "date_desc":
          return new Date(b.release_date || "0").getTime() - new Date(a.release_date || "0").getTime();
        case "date_asc":
          return new Date(a.release_date || "0").getTime() - new Date(b.release_date || "0").getTime();
        case "title_asc":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [results, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
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
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 border transition-colors ${
                showFilters 
                  ? "border-white bg-white text-black" 
                  : "border-white/10 hover:bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              <HiAdjustments className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel de Filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-secondary/10 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white uppercase tracking-wide">Ordenar por</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-white/40 hover:text-white transition-colors"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? "bg-white text-black"
                          : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
        {!loading && sortedResults.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-display font-bold text-white">
                Resultados
              </h2>
              <span className="text-sm text-white/40">({sortedResults.length})</span>
              {sortBy !== "relevance" && (
                <span className="text-xs text-white/30 ml-2">
                  • {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 pb-20">
              {sortedResults.map((movie, index) => (
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
