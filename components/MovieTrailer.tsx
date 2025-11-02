"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiPlay } from "react-icons/hi";
import Image from "next/image";
import type { Video } from "@/types/tmdb";

interface MovieTrailerProps {
  videos: Video[];
}

export default function MovieTrailer({ videos }: MovieTrailerProps) {
  // Filtrar trailers oficiales primero, luego cualquier trailer
  const trailers = videos.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // Ordenar: oficiales primero
  const sortedTrailers = trailers.sort((a, b) => {
    if (a.official && !b.official) return -1;
    if (!a.official && b.official) return 1;
    return 0;
  });

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    sortedTrailers[0] || null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  if (trailers.length === 0) {
    return null;
  }

  const getYouTubeEmbedUrl = (key: string) => {
    return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-lavenderBlush mb-3 sm:mb-4">
        Trailer{trailers.length > 1 ? "es" : ""}
      </h2>

      {/* Video principal */}
      {selectedVideo && (
        <div className="relative aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden border border-flame/20">
          {isPlaying ? (
            <iframe
              src={getYouTubeEmbedUrl(selectedVideo.key)}
              title={selectedVideo.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={`https://img.youtube.com/vi/${selectedVideo.key}/maxresdefault.jpg`}
                alt={selectedVideo.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group">
                <motion.button
                  onClick={() => setIsPlaying(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black/80 hover:bg-black/90 rounded-full p-3 sm:p-4 transition-all"
                  aria-label="Reproducir trailer"
                >
                  <HiPlay className="w-12 h-12 sm:w-16 sm:h-16 text-sunset" />
                </motion.button>
              </div>
              {selectedVideo.official && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-flame/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white">
                  Oficial
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lista de otros trailers */}
      {sortedTrailers.length > 1 && (
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium text-lavenderBlush">
            Otros trailers
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {sortedTrailers.slice(1).map((video) => (
              <motion.button
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedVideo?.id === video.id
                    ? "border-sunset"
                    : "border-flame/20 hover:border-flame/40"
                }`}
              >
                <Image
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  alt={video.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
                <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <HiPlay className="w-8 h-8 text-white" />
                </div>
                {video.official && (
                  <div className="absolute top-1 right-1 bg-flame/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-xs font-semibold text-white">
                    Oficial
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

