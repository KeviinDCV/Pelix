import Image from "next/image";
import Link from "next/link";
import type { MovieDetails } from "@/types/tmdb";
import { getMovieDetails, getBackdropUrl, getPosterUrl, getMovieVideos } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import StreamingLinks from "@/components/StreamingLinks";
import MovieTrailer from "@/components/MovieTrailer";
import MovieStatus from "@/components/MovieStatus";
import MovieReviews from "@/components/MovieReviews";

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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* HERO / BACKDROP */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-end w-full">
            {/* POSTER */}
            <div className="hidden md:block aspect-[2/3] overflow-hidden shadow-2xl shadow-black/50">
              <Image 
                src={posterUrl} 
                alt={movie.title} 
                width={300}
                height={450}
                className="w-full h-full object-cover" 
                priority
              />
            </div>

            {/* INFO */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 text-sm font-medium text-white/60 mb-4">
                <span className="bg-white/10 px-2 py-1 text-white">HD</span>
                <span>{releaseYear}</span>
                <span>{movie.runtime} min</span>
                {movie.genres && movie.genres.length > 0 && (
                  <span>{movie.genres.map(g => g.name).join(" / ")}</span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="#streaming"
                  className="flex items-center gap-3 bg-white text-black px-8 py-3 font-bold hover:bg-white/90 transition-colors"
                >
                  VER AHORA
                </Link>
                <MovieStatus releaseDate={movie.release_date} />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-white/60">/10</span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="text-white/60">
                  <span className="text-white font-bold">{movie.vote_count.toLocaleString()}</span> votos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 md:px-12 mt-12">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          
          {/* LEFT COLUMN */}
          <div>
            {/* Tagline */}
            {movie.tagline && (
              <p className="text-lg text-white/50 italic mb-8">"{movie.tagline}"</p>
            )}

            <h3 className="text-xl font-display font-bold text-white mb-4">Sinopsis</h3>
            <p className="text-lg text-white/70 leading-relaxed mb-12">
              {movie.overview}
            </p>

            {/* Trailer */}
            {videos && videos.results && videos.results.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-display font-bold text-white mb-6">Trailer</h3>
                <MovieTrailer videos={videos.results} />
              </div>
            )}

            {/* Streaming Links */}
            <div id="streaming" className="mb-12">
              <h3 className="text-xl font-display font-bold text-white mb-6">Ver en Streaming</h3>
              <StreamingLinks movie={movie} />
            </div>

            {/* Reviews */}
            <div className="mb-12">
              <MovieReviews movieId={movieId} />
            </div>
          </div>

          {/* RIGHT COLUMN (SIDEBAR) */}
          <div className="space-y-8">
            <div className="bg-secondary/10 p-6 border border-white/5">
              <h4 className="font-bold text-white mb-4">Detalles</h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Estado</span>
                  <span className="text-white">{movie.status}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Fecha de estreno</span>
                  <span className="text-white">
                    {new Date(movie.release_date).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Duración</span>
                  <span className="text-white">{movie.runtime} min</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Popularidad</span>
                  <span className="text-white">{movie.popularity.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="bg-secondary/10 p-6 border border-white/5">
                <h4 className="font-bold text-white mb-4">Géneros</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id} 
                      className="text-xs bg-white/5 text-white/70 px-3 py-1 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

