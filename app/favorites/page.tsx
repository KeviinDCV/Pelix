import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFavorites } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { HiArrowLeft, HiHeart } from "react-icons/hi";
import { getPosterUrl } from "@/lib/tmdb";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const favorites = await getFavorites(session.user.id);

  return (
    <main className="min-h-screen bg-black py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-gray hover:text-sunset transition-colors mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Volver al inicio</span>
          </Link>
          
          {/* Title Section - Responsive Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-1 w-6 sm:w-8 md:w-12 bg-gradient-to-r from-flame to-sunset rounded-full flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-lavenderBlush flex items-center gap-2">
                <HiHeart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-flame flex-shrink-0" />
                <span className="whitespace-nowrap">Mis Favoritos</span>
              </h1>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-flame/30 to-transparent min-w-0 hidden sm:block" />
          </div>
          
          <p className="text-gray text-sm sm:text-base md:text-lg">
            {favorites.length} {favorites.length === 1 ? "película guardada" : "películas guardadas"}
          </p>
        </div>

        {/* Content Section */}
        {favorites.length === 0 ? (
          <div className="text-center py-10 sm:py-12 md:py-16 px-4">
            <HiHeart className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray/30 mx-auto mb-4 sm:mb-5 md:mb-6" />
            <p className="text-gray text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
              No tienes películas favoritas aún
            </p>
            <p className="text-gray/70 text-xs sm:text-sm md:text-base max-w-md mx-auto">
              Haz clic derecho en cualquier película o usa el botón de corazón para agregar a favoritos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6">
            {favorites.map((favorite) => (
              <Link
                key={favorite.id}
                href={`/movie/${favorite.movie_id}`}
                className="group relative aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden bg-black/50 border border-flame/20 hover:border-sunset transition-all duration-300"
              >
                <Image
                  src={getPosterUrl(favorite.movie_poster)}
                  alt={favorite.movie_title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-lavenderBlush text-xs sm:text-sm font-semibold line-clamp-2">
                    {favorite.movie_title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

