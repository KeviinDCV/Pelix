"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiHeart, HiX } from "react-icons/hi";
import { getPosterUrl } from "@/lib/tmdb";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Favorite {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  created_at: Date;
}

interface FavoritesClientProps {
  initialFavorites: Favorite[];
}

export default function FavoritesClient({ initialFavorites }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = async (e: React.MouseEvent, movieId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (removingId !== null) return;

    setRemovingId(movieId);

    try {
      const response = await fetch(`/api/favorites?movieId=${movieId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar favorito");
      }

      setFavorites((prev) => prev.filter((fav) => fav.movie_id !== movieId));
      toast.success("Eliminado de favoritos");
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      toast.error("Error al eliminar favorito");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <HiHeart className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Favoritos
            </h1>
          </div>
          <p className="text-white/60">
            {favorites.length} {favorites.length === 1 ? "película guardada" : "películas guardadas"}
          </p>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <HiHeart className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <p className="text-white/60 text-lg mb-2">No tienes películas favoritas</p>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Usa el botón de corazón en cualquier película para agregar a favoritos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/movie/${favorite.movie_id}`} className="block">
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="group relative aspect-[2/3] overflow-hidden bg-secondary/20 cursor-pointer"
                    >
                      <Image
                        src={getPosterUrl(favorite.movie_poster)}
                        alt={favorite.movie_title}
                        fill
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-50"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Remove button */}
                      <button
                        onClick={(e) => handleRemove(e, favorite.movie_id)}
                        disabled={removingId === favorite.movie_id}
                        className="absolute top-3 right-3 z-10 p-2 bg-black/60 backdrop-blur-sm hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Eliminar de favoritos"
                      >
                        <HiX className="w-4 h-4 text-white" />
                      </button>

                      {/* Content on hover */}
                      <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <h3 className="text-xl font-display font-bold text-white leading-tight">
                          {favorite.movie_title}
                        </h3>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

