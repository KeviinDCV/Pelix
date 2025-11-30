import { getGenres } from "@/lib/tmdb";
import GenreCard from "@/components/GenreCard";

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            Géneros
          </h1>
          <p className="text-white/60">Explora películas por categoría.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {genres.map((genre, index) => (
            <GenreCard key={genre.id} genre={genre} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

