import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite as checkIsFavorite,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const favorites = await getFavorites(session.user.id);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return NextResponse.json(
      { error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieTitle, moviePoster } = body;

    if (!movieId || !movieTitle) {
      return NextResponse.json(
        { error: "movieId y movieTitle son requeridos" },
        { status: 400 }
      );
    }

    const favorite = await addFavorite(
      session.user.id,
      movieId,
      movieTitle,
      moviePoster || null
    );
    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Error al agregar favorito",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId es requerido" },
        { status: 400 }
      );
    }

    await removeFavorite(session.user.id, parseInt(movieId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Error al eliminar favorito",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

