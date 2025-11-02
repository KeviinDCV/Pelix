import Link from "next/link";
import { getGenres } from "@/lib/tmdb";
import GenreCard from "@/components/GenreCard";

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <main className="min-h-screen bg-black py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 gradient-text">
            Categorías
          </h1>
          <p className="text-gray text-base sm:text-lg px-4">
            Explora películas por género
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {genres.map((genre, index) => (
            <GenreCard key={genre.id} genre={genre} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

