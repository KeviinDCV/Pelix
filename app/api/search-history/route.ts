import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addSearchHistory, getSearchHistory, clearSearchHistory } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    const history = await getSearchHistory(session.user.id, limit);
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json(
      { error: "Error al obtener historial" },
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
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query es requerido" },
        { status: 400 }
      );
    }

    const historyItem = await addSearchHistory(session.user.id, query.trim());
    return NextResponse.json({ success: true, history: historyItem });
  } catch (error) {
    console.error("Error al guardar historial:", error);
    return NextResponse.json(
      { error: "Error al guardar historial" },
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

    await clearSearchHistory(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al limpiar historial:", error);
    return NextResponse.json(
      { error: "Error al limpiar historial" },
      { status: 500 }
    );
  }
}

