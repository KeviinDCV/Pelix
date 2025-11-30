import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6 max-w-md mx-auto">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-white mb-6">404</h1>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Página no encontrada</h2>
        <p className="text-white/60 mb-12">La página que buscas no existe o ha sido movida.</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}

