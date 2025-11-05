import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { HiHome, HiOutlineSearch, HiOutlineFilm } from "react-icons/hi";
import AuthProvider from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pelix - Descubre las mejores películas",
  description: "Explora películas en cines, populares y próximos estrenos",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-flame/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 sm:h-20">
                <Link 
                  href="/" 
                  className="flex items-baseline gap-2 hover:opacity-90 transition-opacity"
                >
                  <span className="text-2xl sm:text-3xl font-bold gradient-text">Pelix</span>
                  <span className="text-xs sm:text-sm text-gray/60 font-normal">by Kevin</span>
                </Link>
                <div className="flex items-center gap-3 sm:gap-6">
                  <Link
                    href="/"
                    className="text-lavenderBlush/80 hover:text-sunset transition-colors font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    aria-label="Inicio"
                  >
                    <HiHome className="w-5 h-5" />
                    <span className="hidden sm:inline">Inicio</span>
                  </Link>
                  <Link
                    href="/genres"
                    className="text-lavenderBlush/80 hover:text-sunset transition-colors font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    aria-label="Categorías"
                  >
                    <HiOutlineFilm className="w-5 h-5" />
                    <span className="hidden sm:inline">Categorías</span>
                  </Link>
                  <Link
                    href="/search"
                    className="text-lavenderBlush/80 hover:text-sunset transition-colors font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    aria-label="Buscar"
                  >
                    <HiOutlineSearch className="w-5 h-5" />
                    <span className="hidden sm:inline">Buscar</span>
                  </Link>
                  <UserMenu />
                </div>
              </div>
            </div>
          </nav>
          <div className="flex-1">
            {children}
          </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a1a1a",
              color: "#eee5e9",
              border: "1px solid #cf5c36",
            },
            success: {
              iconTheme: {
                primary: "#efc88b",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#cf5c36",
                secondary: "#000000",
              },
            },
          }}
        />
        <footer className="border-t border-flame/20 mt-auto py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray text-sm">
              Powered by{" "}
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sunset hover:text-flame transition-colors"
              >
                TMDB
              </a>
            </p>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

