import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Página no encontrada</h1>
        <p className="text-[#8888aa] mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida. Vuelve al inicio para continuar explorando.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#a07708] text-white font-semibold px-6 py-3 rounded-xl transition-all glow"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
