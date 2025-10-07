export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white px-6 py-8 flex items-center justify-center">
            <div className="max-w-xl text-center">
                <h1 className="text-5xl font-bold mb-4">404</h1>
                <p className="text-xl text-white/80 mb-6">
                    Oups... Cette page n'existe pas ou a été déplacée.
                </p>
                <a
                    href="/"
                    className="inline-block text-sm font-medium border border-white/30 px-5 py-2 rounded-md hover:border-white/50 hover:bg-white/10 transition"
                >
                    Retour à l'accueil
                </a>
            </div>
        </div>
    );
}
