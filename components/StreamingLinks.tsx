"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  HiFilm, 
  HiPlay, 
  HiOutlinePlay, 
  HiSearch,
  HiOutlineExternalLink 
} from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import type { Movie, MovieDetails } from "@/types/tmdb";
import type { StreamingLink } from "@/types/tmdb";

interface StreamingLinksProps {
  movie: Movie | MovieDetails;
}

export default function StreamingLinks({ movie }: StreamingLinksProps) {
  const [links, setLinks] = useState<StreamingLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const searchQuery = encodeURIComponent(
          `${movie.title} ${new Date(movie.release_date).getFullYear()}`
        );

        // Llamar a nuestra API route (que hace la llamada desde el servidor sin CORS)
        try {
          const apiUrl = `/api/streaming?title=${encodeURIComponent(movie.title)}${movie.id ? `&tmdbId=${movie.id}` : ""}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.links && data.links.length > 0) {
              setLinks(data.links);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.log("Error al obtener links de streaming:", error);
        }

        // Generar slug del título para búsquedas
        const movieSlug = movie.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
          .replace(/[^a-z0-9]+/g, "+") // Reemplaza espacios y caracteres especiales con +
          .replace(/^\++|\++$/g, ""); // Elimina + al inicio y final
        
        const movieSlugDash = movie.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        
        // Título normalizado para PelisPlus (sin convertir espacios a +)
        const pelisPlusTitle = movie.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
          .trim();
        
        // Slug para la.movie (título con guiones + año)
        const laMovieYear = new Date(movie.release_date).getFullYear();
        const laMovieSlug = `${movieSlugDash}-${laMovieYear}`;
        
        // Enlaces de búsqueda en sitios de streaming populares
        const fallbackLinks: StreamingLink[] = [
          {
            name: "Cinecalidad",
            url: `https://www.cinecalidad.ec/?s=${movieSlug}`,
            icon: "cinecalidad",
          },
          {
            name: "PelisPlus",
            url: `https://ww3.pelisplus.to/search/${encodeURIComponent(pelisPlusTitle)}`,
            icon: "pelisplus",
          },
          {
            name: "PeliCineHD",
            url: `https://pelicinehd.com/?s=${movieSlug}`,
            icon: "pelicinehd",
          },
          {
            name: "GnulaHD",
            url: `https://ww3.gnulahd.nu/?s=${movieSlug}`,
            icon: "gnulahd",
          },
          {
            name: "La.Movie",
            url: `https://la.movie/peliculas/${laMovieSlug}`,
            icon: "la-movie",
          },
          {
            name: "Buscar en Google",
            url: `https://www.google.com/search?q=${encodeURIComponent(movie.title + " ver online español latino")}`,
            icon: "google",
          },
        ];

        setLinks(fallbackLinks);
      } catch (error) {
        console.error("Error obteniendo links de streaming:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, [movie]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "cinecalidad":
        return <HiFilm className="w-5 h-5" />;
      case "pelisplus":
        return <HiPlay className="w-5 h-5" />;
      case "pelicinehd":
        return <HiOutlinePlay className="w-5 h-5" />;
      case "gnulahd":
        return <HiFilm className="w-5 h-5" />;
      case "la-movie":
        return <HiFilm className="w-5 h-5" />;
      case "google":
        return <HiSearch className="w-5 h-5" />;
      default:
        return <FiSearch className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray">
        <div className="w-4 h-4 border-2 border-sunset border-t-transparent rounded-full animate-spin" />
        <span>Cargando opciones de streaming...</span>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <p className="text-gray text-sm">
        No se encontraron enlaces de streaming disponibles en este momento.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/50 border border-flame/20 rounded-lg text-lavenderBlush hover:border-sunset hover:text-sunset transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
          >
            {typeof link.icon === "string" && link.icon.startsWith("http") ? (
              <span>{link.icon}</span>
            ) : typeof link.icon === "string" ? (
              getIcon(link.icon)
            ) : (
              <span>{link.icon}</span>
            )}
            <span className="font-medium">{link.name}</span>
            <HiOutlineExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 flex-shrink-0" />
          </motion.a>
        ))}
      </div>
      <p className="text-gray text-xs sm:text-sm mt-3 sm:mt-4">
        Enlaces de búsqueda en diferentes plataformas de streaming. Los resultados pueden variar según la disponibilidad del contenido.
      </p>
    </>
  );
}

