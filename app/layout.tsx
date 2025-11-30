import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PELIX - Cinema Experience",
  description: "Descubre las mejores películas con una experiencia cinematográfica única",
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
      <body className="antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
        <AuthProvider>
          <Navbar />

          <div className="flex-1">
            {children}
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "hsl(220 10% 10%)",
                color: "#ffffff",
                border: "1px solid hsl(220 5% 20%)",
              },
              success: {
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "hsl(220 10% 6%)",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "hsl(220 10% 6%)",
                },
              },
            }}
          />

          {/* Footer minimalista */}
          <footer className="border-t border-white/5 mt-auto py-12">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <Link 
                  href="/" 
                  className="text-xl font-display font-bold tracking-tighter text-white/50 hover:text-white transition-colors"
                >
                  PELIX
                </Link>
                <p className="text-sm text-white/40">
                  Powered by{" "}
                  <a 
                    href="https://www.themoviedb.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    TMDB
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

