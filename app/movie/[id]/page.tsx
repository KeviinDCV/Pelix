import Image from "next/image";
import type { MovieDetails } from "@/types/tmdb";
import { getMovieDetails, getBackdropUrl, getPosterUrl, getMovieVideos } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import StreamingLinks from "@/components/StreamingLinks";
import MovieTrailer from "@/components/MovieTrailer";
import MovieStatus from "@/components/MovieStatus";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  let movie: MovieDetails;
  let videos;
  try {
    [movie, videos] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId).catch(() => ({ id: movieId, results: [] })),
    ]);
  } catch (error) {
    notFound();
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <main className="min-h-screen bg-black">
      {/* Backdrop */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 md:-mt-40 relative z-10 pb-12 sm:pb-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-48 h-72 sm:w-56 sm:h-[336px] md:w-64 md:h-96 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 border-flame/20">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-8 md:pb-12 space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-lavenderBlush mb-4 sm:mb-6 leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-sunset/30">
                  <span className="text-sunset font-bold text-lg sm:text-xl">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray hidden sm:inline">•</span>
                <span className="text-lavenderBlush/90 text-sm sm:text-base">{releaseYear}</span>
                <span className="text-gray hidden sm:inline">•</span>
                <span className="text-lavenderBlush/90 text-sm sm:text-base">{movie.runtime} min</span>
                <span className="text-gray hidden sm:inline">•</span>
                <div className="w-full sm:w-auto">
                  <MovieStatus releaseDate={movie.release_date} />
                </div>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-2 bg-black/50 border border-flame/20 text-lavenderBlush rounded-full text-sm font-medium backdrop-blur-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-lg sm:text-xl text-sunset italic font-light leading-relaxed">
                "{movie.tagline}"
              </p>
            )}

            {/* Overview */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-lavenderBlush mb-3 sm:mb-4">
                Sinopsis
              </h2>
              <p className="text-lavenderBlush/80 leading-relaxed text-base sm:text-lg">
                {movie.overview}
              </p>
            </div>

            {/* Trailer */}
            {videos && videos.results && videos.results.length > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-flame/20">
                <MovieTrailer videos={videos.results} />
              </div>
            )}

            {/* Streaming Links */}
            <div className="pt-4 sm:pt-6 border-t border-flame/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-lavenderBlush mb-3 sm:mb-4">
                Ver en Streaming
              </h2>
              <StreamingLinks movie={movie} />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-flame/20">
              <div>
                <span className="text-gray text-xs sm:text-sm uppercase tracking-wide block">Estado</span>
                <p className="text-lavenderBlush mt-1 font-medium text-sm sm:text-base">{movie.status}</p>
              </div>
              <div>
                <span className="text-gray text-xs sm:text-sm uppercase tracking-wide block">Popularidad</span>
                <p className="text-lavenderBlush mt-1 font-medium text-sm sm:text-base">
                  {movie.popularity.toFixed(0)}
                </p>
              </div>
              <div>
                <span className="text-gray text-xs sm:text-sm uppercase tracking-wide block">Votos</span>
                <p className="text-lavenderBlush mt-1 font-medium text-sm sm:text-base">
                  {movie.vote_count.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                <span className="text-gray text-xs sm:text-sm uppercase tracking-wide block">Fecha de estreno</span>
                <p className="text-lavenderBlush mt-1 font-medium text-sm sm:text-base">
                  {new Date(movie.release_date).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

