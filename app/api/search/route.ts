import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchMovies(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json(
      { error: "Error al buscar películas" },
      { status: 500 }
    );
  }
}

