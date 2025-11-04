import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isFavorite } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false });
    }

    const searchParams = request.nextUrl.searchParams;
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId es requerido" },
        { status: 400 }
      );
    }

    const favorite = await isFavorite(session.user.id, parseInt(movieId));
    return NextResponse.json({ isFavorite: favorite });
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    return NextResponse.json({ isFavorite: false });
  }
}

