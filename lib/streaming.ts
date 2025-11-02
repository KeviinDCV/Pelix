import type { Movie, MovieDetails } from "@/types/tmdb";
import type { StreamingLink } from "@/types/tmdb";

/**
 * Intenta obtener links de streaming usando Consumet API
 * Si falla, retorna enlaces de búsqueda alternativos
 */
export async function getStreamingLinks(movie: Movie | MovieDetails): Promise<StreamingLink[]> {
  const searchQuery = encodeURIComponent(`${movie.title} ${new Date(movie.release_date).getFullYear()}`);
  const titleSlug = movie.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Intentar obtener links de Consumet API (si está disponible)
  try {
    const consumetResponse = await fetch(
      `https://api.consumet.org/movies/flixhq/${encodeURIComponent(movie.title)}`,
      { next: { revalidate: 3600 } }
    );
    
    if (consumetResponse.ok) {
      const data = await consumetResponse.json();
      if (data.results && data.results.length > 0) {
        // Si encontramos resultados, usar el primer resultado
        const firstResult = data.results[0];
        const streamResponse = await fetch(
          `https://api.consumet.org/movies/flixhq/info?id=${firstResult.id}`,
          { next: { revalidate: 3600 } }
        );
        
        if (streamResponse.ok) {
          const streamData = await streamResponse.json();
          if (streamData.sources && streamData.sources.length > 0) {
            return streamData.sources.map((source: any, index: number) => ({
              name: source.quality || `Calidad ${index + 1}`,
              url: source.url,
              icon: "🎬",
            }));
          }
        }
      }
    }
  } catch (error) {
    console.log("Consumet API no disponible, usando enlaces de búsqueda alternativos");
  }

  // Fallback: Enlaces de búsqueda en plataformas populares
  // Nota: Estos son enlaces de búsqueda, los usuarios deben buscar manualmente
  const links: StreamingLink[] = [
    {
      name: "Buscar en PelisPlus",
      url: `https://pelisplushd.lat/?s=${searchQuery}`,
      icon: "🎥",
    },
    {
      name: "Buscar en Cuevana",
      url: `https://cuevana3.ch/?s=${searchQuery}`,
      icon: "🍿",
    },
    {
      name: "Buscar en Repelis",
      url: `https://www.repelis.lat/?s=${searchQuery}`,
      icon: "🎬",
    },
    {
      name: "Buscar en PelisFlix",
      url: `https://pelisflix.me/?s=${searchQuery}`,
      icon: "🎞️",
    },
    {
      name: "Buscar en Pelispedia",
      url: `https://pelispedia.red/?s=${searchQuery}`,
      icon: "📺",
    },
  ];

  return links;
}

