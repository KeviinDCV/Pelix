import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFavorites } from "@/lib/db";
import FavoritesClient from "@/components/FavoritesClient";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const favorites = await getFavorites(session.user.id);

  return <FavoritesClient initialFavorites={favorites} />;
}
