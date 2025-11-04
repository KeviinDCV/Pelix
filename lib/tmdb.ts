import type { Movie, MoviesResponse, MovieDetails, Genre, VideosResponse, ReviewsResponse } from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!API_KEY) {
  console.warn("NEXT_PUBLIC_TMDB_API_KEY no está configurada");
}

export function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path) {
    // Placeholder SVG para películas sin imagen
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750'%3E%3Crect width='500' height='750' fill='%232d2d2d'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%23888888' text-anchor='middle' dy='.3em'%3ESin Imagen%3C/text%3E%3C/svg%3E";
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getPosterUrl(path: string | null): string {
  return getImageUrl(path, "w500");
}

export function getBackdropUrl(path: string | null): string {
  return getImageUrl(path, "w1280");
}

async function fetchTMDB<T>(endpoint: string): Promise<T> {
  if (!API_KEY) {
    throw new Error("TMDB API Key no configurada");
  }

  // Español latinoamericano (es-MX)
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=es-MX&region=MX`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache por 1 hora
  });

  if (!response.ok) {
    throw new Error(`Error en TMDB API: ${response.statusText}`);
  }

  return response.json();
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<MoviesResponse>("/movie/now_playing");
  return data.results;
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<MoviesResponse>("/movie/popular");
  return data.results;
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<MoviesResponse>("/movie/upcoming");
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${id}`);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await fetchTMDB<MoviesResponse>(
    `/search/movie?query=${encodeURIComponent(query)}`
  );
  return data.results;
}

export async function getGenres(): Promise<Genre[]> {
  const data = await fetchTMDB<{ genres: Genre[] }>("/genre/movie/list");
  return data.genres;
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<MoviesResponse> {
  return fetchTMDB<MoviesResponse>(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
  );
}

export async function getMovieVideos(id: number): Promise<VideosResponse> {
  return fetchTMDB<VideosResponse>(`/movie/${id}/videos`);
}

export async function getMovieReviews(id: number, page: number = 1): Promise<ReviewsResponse> {
  return fetchTMDB<ReviewsResponse>(`/movie/${id}/reviews?page=${page}`);
}

export function getMovieStatus(movie: Movie): string {
  if (!movie.release_date) {
    return "Próximamente";
  }
  
  const releaseDate = new Date(movie.release_date);
  const today = new Date();
  
  // Verificar si la fecha es válida
  if (isNaN(releaseDate.getTime())) {
    return "Próximamente";
  }
  
  const daysDiff = Math.floor(
    (releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Si la película se estrena en el futuro
  if (daysDiff > 30) {
    return "Próximamente";
  } else if (daysDiff > 0 && daysDiff <= 30) {
    // Se estrena en los próximos 30 días
    return "En cines";
  } else if (daysDiff <= 0 && daysDiff >= -90) {
    // Se estrenó hace menos de 90 días (probablemente aún en cines)
    return "En cines";
  } else {
    // Se estrenó hace más de 90 días (ya disponible en streaming)
    return "Disponible";
  }
}

