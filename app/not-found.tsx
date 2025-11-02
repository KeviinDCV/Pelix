import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center py-12 sm:py-20">
      <div className="text-center px-4 sm:px-6 max-w-md mx-auto">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold gradient-text mb-4 sm:mb-6">404</h1>
        <h2 className="text-xl sm:text-2xl text-lavenderBlush mb-2 sm:mb-3">Página no encontrada</h2>
        <p className="text-gray text-sm sm:text-base mb-8 sm:mb-12">La página que buscas no existe o ha sido movida.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-flame to-sunset text-black font-semibold rounded-lg sm:rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-flame/20 text-sm sm:text-base"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

