import { notFound } from "next/navigation";
import MovieGrid from "@/components/MovieGrid";
import { getMoviesByGenre, getGenres } from "@/lib/tmdb";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

interface GenrePageProps {
  params: Promise<{ id: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { id } = await params;
  const genreId = parseInt(id);

  if (isNaN(genreId)) {
    notFound();
  }

  // Obtener géneros para encontrar el nombre
  const allGenres = await getGenres();
  const genre = allGenres.find((g) => g.id === genreId);

  if (!genre) {
    notFound();
  }

  // Obtener películas del género
  const moviesData = await getMoviesByGenre(genreId);
  const movies = moviesData.results;

  return (
    <main className="min-h-screen bg-black py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/genres"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-gray hover:text-sunset transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Volver a categorías</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-flame to-sunset rounded-full flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-lavenderBlush flex-shrink-0">
              {genre.name}
            </h1>
            <div className="flex-1 h-px bg-gradient-to-r from-flame/30 to-transparent min-w-0" />
          </div>
          <p className="text-gray text-base sm:text-lg">
            {moviesData.total_results} películas encontradas
          </p>
        </div>

        {movies.length > 0 ? (
          <MovieGrid movies={movies} title="" />
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <p className="text-gray text-lg sm:text-xl">No se encontraron películas en este género.</p>
          </div>
        )}
      </div>
    </main>
  );
}

