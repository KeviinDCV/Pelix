import { NextRequest, NextResponse } from "next/server";
import { getMovieReviews } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movieId = searchParams.get("movieId");
  const page = searchParams.get("page");

  if (!movieId) {
    return NextResponse.json(
      { error: "movieId parameter is required" },
      { status: 400 }
    );
  }

  const movieIdNum = parseInt(movieId);
  const pageNum = page ? parseInt(page) : 1;

  if (isNaN(movieIdNum)) {
    return NextResponse.json(
      { error: "Invalid movieId" },
      { status: 400 }
    );
  }

  try {
    const reviewsData = await getMovieReviews(movieIdNum, pageNum);
    return NextResponse.json(reviewsData);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Error al obtener reseñas" },
      { status: 500 }
    );
  }
}

