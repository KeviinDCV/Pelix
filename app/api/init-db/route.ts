import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: "Base de datos inicializada correctamente" });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    return NextResponse.json(
      { success: false, error: "Error al inicializar la base de datos" },
      { status: 500 }
    );
  }
}

