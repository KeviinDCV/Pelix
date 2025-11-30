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
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

  return (
    <Link href={`/movie/${movie.id}`} className="block" onContextMenu={handleContextMenu}>
      <motion.div
        whileHover={{ y: -10 }}
        className="group relative aspect-[2/3] overflow-hidden bg-secondary/20 cursor-pointer"
      >
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-50"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          priority={priority}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Botón de favoritos */}
        {session?.user?.id && (
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 p-2 bg-black/60 backdrop-blur-sm hover:bg-white/20 transition-all"
            aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
          >
            <HiHeart
              className={`w-4 h-4 transition-all ${
                isFavorite
                  ? "text-white fill-current"
                  : "text-white/60 group-hover:text-white"
              }`}
            />
          </button>
        )}

        {/* Content on hover */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1 block">
            {status}
          </span>
          <h3 className="text-xl font-display font-bold text-white leading-tight mb-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span>{releaseYear}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

