import MovieGrid from "@/components/MovieGrid";
import InfoBanner from "@/components/InfoBanner";
import HeroBanner from "@/components/HeroBanner";
import Link from "next/link";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
} from "@/lib/tmdb";

export default async function HomePage() {
  const [nowPlaying, popular, upcoming] = await Promise.all([
    getNowPlayingMovies(),
    getPopularMovies(),
    getUpcomingMovies(),
  ]);

  const featuredMovies = [...nowPlaying.slice(0, 3), ...upcoming.slice(0, 2)];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <InfoBanner />
      <HeroBanner movies={featuredMovies} />

      {/* Secciones de películas */}
      <main className="container mx-auto px-6 md:px-12">
        <MovieGrid movies={nowPlaying} title="En Cartelera" showViewAll />
        <MovieGrid movies={popular} title="Tendencias" showViewAll />
        <MovieGrid movies={upcoming} title="Próximamente" showViewAll />
      </main>

      {/* Sección de categorías estilo DarkFilmHub */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["DRAMA", "SCI-FI", "ACCIÓN", "TERROR"].map((cat) => (
              <Link
                key={cat}
                href="/genres"
                className="aspect-video border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <span className="font-display font-bold text-xl tracking-widest text-white/40 group-hover:text-white transition-colors">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

