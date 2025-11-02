import MovieGrid from "@/components/MovieGrid";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
} from "@/lib/tmdb";

export default async function HomePage() {
  // Fetch todas las secciones en paralelo
  const [nowPlaying, popular, upcoming] = await Promise.all([
    getNowPlayingMovies(),
    getPopularMovies(),
    getUpcomingMovies(),
  ]);

  return (
    <main className="min-h-screen bg-black py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 gradient-text">
            Descubre Pelix
          </h1>
          <p className="text-base sm:text-lg text-gray max-w-2xl mx-auto px-4">
            Explora las películas más populares, en cines y próximos estrenos
          </p>
        </div>

        <MovieGrid movies={nowPlaying} title="En Cines" />
        <MovieGrid movies={popular} title="Más Populares" />
        <MovieGrid movies={upcoming} title="Próximamente" />
      </div>
    </main>
  );
}

