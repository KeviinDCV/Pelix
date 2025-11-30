import { notFound } from "next/navigation";
import { getMoviesByGenre, getGenres } from "@/lib/tmdb";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
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

  const allGenres = await getGenres();
  const genre = allGenres.find((g) => g.id === genreId);

  if (!genre) {
    notFound();
  }

  const moviesData = await getMoviesByGenre(genreId, currentPage);
  const movies = moviesData.results;
  const totalPages = Math.min(moviesData.total_pages, 500);
  const totalResults = moviesData.total_results;

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 uppercase">
            {genre.name}
          </h1>
          <p className="text-white/60">
            {totalResults.toLocaleString()} películas encontradas
          </p>
        </div>

        {movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-16">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} priority={index < 4} />
              ))}
            </div>

            {/* Paginación minimalista */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/genres/${genreId}?page=${Math.max(1, currentPage - 1)}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 border transition-all ${
                      currentPage === 1
                        ? "text-white/30 border-white/10 cursor-not-allowed"
                        : "text-white border-white/20 hover:bg-white/5"
                    }`}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : 0}
                  >
                    <HiChevronLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">ANTERIOR</span>
                  </Link>

                  <div className="flex items-center gap-1">
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
                          className={`min-w-[44px] px-3 py-3 text-center text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? "bg-white text-black"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={`/genres/${genreId}?page=${Math.min(totalPages, currentPage + 1)}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 border transition-all ${
                      currentPage === totalPages
                        ? "text-white/30 border-white/10 cursor-not-allowed"
                        : "text-white border-white/20 hover:bg-white/5"
                    }`}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : 0}
                  >
                    <span className="text-sm font-medium">SIGUIENTE</span>
                    <HiChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <p className="text-white/40 text-sm">
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-white/60 text-lg">No se encontraron películas en este género.</p>
          </div>
        )}
      </div>
    </div>
  );
}

