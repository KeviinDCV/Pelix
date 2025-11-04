import { notFound } from "next/navigation";
import { getMoviesByGenre, getGenres } from "@/lib/tmdb";
import Link from "next/link";
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import MovieCard from "@/components/MovieCard";

interface GenrePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const genreId = parseInt(id);
  const currentPage = parseInt(page || "1");

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
  const moviesData = await getMoviesByGenre(genreId, currentPage);
  const movies = moviesData.results;
  const totalPages = Math.min(moviesData.total_pages, 500); // TMDB limita a 500 páginas
  const totalResults = moviesData.total_results;

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
            {totalResults.toLocaleString()} películas encontradas
          </p>
        </div>

        {movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} priority={index < 6} />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-12">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/genres/${genreId}?page=${Math.max(1, currentPage - 1)}`}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? "text-gray/50 cursor-not-allowed bg-black/30"
                        : "text-lavenderBlush hover:text-sunset hover:bg-flame/20 bg-black/50 border border-flame/20"
                    }`}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : 0}
                  >
                    <HiChevronLeft className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Anterior</span>
                  </Link>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Link
                          key={pageNum}
                          href={`/genres/${genreId}?page=${pageNum}`}
                          className={`min-w-[40px] sm:min-w-[44px] px-2 sm:px-3 py-2 text-center rounded-lg transition-all text-sm sm:text-base ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-flame to-sunset text-black font-bold"
                              : "text-lavenderBlush hover:text-sunset hover:bg-flame/20 bg-black/50 border border-flame/20"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={`/genres/${genreId}?page=${Math.min(totalPages, currentPage + 1)}`}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? "text-gray/50 cursor-not-allowed bg-black/30"
                        : "text-lavenderBlush hover:text-sunset hover:bg-flame/20 bg-black/50 border border-flame/20"
                    }`}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : 0}
                  >
                    <span className="text-sm sm:text-base">Siguiente</span>
                    <HiChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <p className="text-gray text-sm sm:text-base">
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <p className="text-gray text-lg sm:text-xl">No se encontraron películas en este género.</p>
          </div>
        )}
      </div>
    </main>
  );
}

