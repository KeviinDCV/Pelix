import { sql } from '@vercel/postgres';

// Nota: @vercel/postgres funciona con cualquier proveedor de Postgres que proporcione
// una URL estándar (Neon, Supabase, Prisma Postgres, etc.)
// Asegúrate de tener POSTGRES_URL o DATABASE_URL configurado en las variables de entorno

// Tipos para la base de datos
export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  created_at: Date;
}

export interface Favorite {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  created_at: Date;
}

// Inicializar la base de datos (ejecutar solo una vez)
export async function initializeDatabase() {
  try {
    // Crear tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Crear tabla de historial de búsqueda
    await sql`
      CREATE TABLE IF NOT EXISTS search_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        query VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Crear índice para búsquedas rápidas por usuario
    await sql`
      CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
    `;

    // Crear tabla de favoritos
    await sql`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        movie_title VARCHAR(500) NOT NULL,
        movie_poster VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      );
    `;

    // Crear índices para favoritos
    await sql`
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_favorites_movie_id ON favorites(movie_id);
    `;

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Funciones de usuarios
export async function createUser(email: string, username: string, passwordHash: string): Promise<User> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL no configurado");
  }
  try {
    const result = await sql`
      INSERT INTO users (email, username, password_hash)
      VALUES (${email}, ${username}, ${passwordHash})
      RETURNING id, email, username, password_hash, created_at
    `;
    if (!result.rows[0]) {
      throw new Error("No se pudo crear el usuario");
    }
    return result.rows[0] as User;
  } catch (error) {
    console.error("Error en createUser:", error);
    // Si el error es que la tabla no existe, dar un mensaje más claro
    if (error instanceof Error && error.message.includes("does not exist")) {
      throw new Error("Las tablas de la base de datos no están inicializadas. Ejecuta /api/init-db primero.");
    }
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!process.env.POSTGRES_URL) {
    console.warn("POSTGRES_URL no configurado. No se puede obtener usuario.");
    return null;
  }
  try {
    const result = await sql`
      SELECT id, email, username, password_hash, created_at
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    return result.rows[0] as User || null;
  } catch (error) {
    console.error("Error en getUserByEmail:", error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, username, password_hash, created_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;
  return result.rows[0] as User || null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  if (!process.env.POSTGRES_URL) {
    console.warn("POSTGRES_URL no configurado. No se puede obtener usuario.");
    return null;
  }
  try {
    const result = await sql`
      SELECT id, email, username, password_hash, created_at
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;
    return result.rows[0] as User || null;
  } catch (error) {
    console.error("Error en getUserByUsername:", error);
    return null;
  }
}

// Funciones de historial de búsqueda
export async function addSearchHistory(userId: string, query: string): Promise<SearchHistory> {
  const result = await sql`
    INSERT INTO search_history (user_id, query)
    VALUES (${userId}, ${query})
    RETURNING id, user_id, query, created_at
  `;
  return result.rows[0] as SearchHistory;
}

export async function getSearchHistory(userId: string, limit: number = 20): Promise<SearchHistory[]> {
  const result = await sql`
    SELECT id, user_id, query, created_at
    FROM search_history
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result.rows as SearchHistory[];
}

export async function clearSearchHistory(userId: string): Promise<void> {
  await sql`
    DELETE FROM search_history
    WHERE user_id = ${userId}
  `;
}

// Funciones de favoritos
export async function addFavorite(
  userId: string,
  movieId: number,
  movieTitle: string,
  moviePoster: string | null
): Promise<Favorite> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL no configurado");
  }
  try {
    const result = await sql`
      INSERT INTO favorites (user_id, movie_id, movie_title, movie_poster)
      VALUES (${userId}, ${movieId}, ${movieTitle}, ${moviePoster})
      ON CONFLICT (user_id, movie_id) DO NOTHING
      RETURNING id, user_id, movie_id, movie_title, movie_poster, created_at
    `;
    
    // Si no se insertó (ya existe), obtener el existente
    if (result.rows.length === 0) {
      const existing = await sql`
        SELECT id, user_id, movie_id, movie_title, movie_poster, created_at
        FROM favorites
        WHERE user_id = ${userId} AND movie_id = ${movieId}
        LIMIT 1
      `;
      if (!existing.rows[0]) {
        throw new Error("No se pudo agregar el favorito");
      }
      return existing.rows[0] as Favorite;
    }
    
    if (!result.rows[0]) {
      throw new Error("No se pudo agregar el favorito");
    }
    return result.rows[0] as Favorite;
  } catch (error) {
    console.error("Error en addFavorite:", error);
    throw error;
  }
}

export async function removeFavorite(userId: string, movieId: number): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL no configurado");
  }
  try {
    await sql`
      DELETE FROM favorites
      WHERE user_id = ${userId} AND movie_id = ${movieId}
    `;
  } catch (error) {
    console.error("Error en removeFavorite:", error);
    throw error;
  }
}

export async function getFavorites(userId: string): Promise<Favorite[]> {
  if (!process.env.POSTGRES_URL) {
    console.warn("POSTGRES_URL no configurado. No se pueden obtener favoritos.");
    return [];
  }
  try {
    const result = await sql`
      SELECT id, user_id, movie_id, movie_title, movie_poster, created_at
      FROM favorites
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return result.rows as Favorite[];
  } catch (error) {
    console.error("Error en getFavorites:", error);
    return [];
  }
}

export async function isFavorite(userId: string, movieId: number): Promise<boolean> {
  const result = await sql`
    SELECT id
    FROM favorites
    WHERE user_id = ${userId} AND movie_id = ${movieId}
    LIMIT 1
  `;
  return result.rows.length > 0;
}

export async function getFavoriteCount(userId: string): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM favorites
    WHERE user_id = ${userId}
  `;
  return parseInt(result.rows[0].count as string);
}

