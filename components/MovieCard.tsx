"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { HiHeart } from "react-icons/hi";
import toast from "react-hot-toast";
import type { Movie } from "@/types/tmdb";
import { getPosterUrl, getMovieStatus } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      checkFavorite();
    } else {
      setIsChecking(false);
    }
  }, [session, movie.id]);

  const checkFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites/check?movieId=${movie.id}`);
      const data = await response.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Error al verificar favorito:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.id) {
      toast.error("Debes iniciar sesión para agregar favoritos");
      return;
    }

    try {
      if (isFavorite) {
        await fetch(`/api/favorites?movieId=${movie.id}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
        toast.success("Eliminado de favoritos");
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId: movie.id,
            movieTitle: movie.title,
            moviePoster: movie.poster_path,
          }),
        });
        setIsFavorite(true);
        toast.success("Agregado a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session?.user?.id) {
      handleFavorite(e);
    }
  };

  const posterUrl = getPosterUrl(movie.poster_path);
  const status = getMovieStatus(movie);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="relative"
    >
      <Link
        href={`/movie/${movie.id}`}
        className="group block bg-black/50 border border-flame/10 rounded-xl overflow-hidden card-hover"
        onContextMenu={handleContextMenu}
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
          
          {/* Botón de favoritos (móvil y desktop) */}
          {session?.user?.id && (
            <button
              onClick={handleFavorite}
              className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 p-1.5 sm:p-2 bg-black/80 backdrop-blur-md rounded-full border border-sunset/30 hover:bg-flame/20 transition-all group/fav"
              aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
            >
              <HiHeart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                  isFavorite
                    ? "text-flame fill-current"
                    : "text-gray group-hover/fav:text-flame"
                }`}
              />
            </button>
          )}

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
      
      {/* Tooltip para clic derecho (solo en desktop) */}
      {session?.user?.id && (
        <div className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-lavenderBlush text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
          Clic derecho para {isFavorite ? "eliminar" : "agregar"} favorito
        </div>
      )}
    </motion.div>
  );
}

