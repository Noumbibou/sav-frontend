import { Link } from 'react-router-dom';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm shadow-brand-600/20 transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-sm">SAV</span>
            </div>
            <span className="font-semibold text-gray-900">Support Client</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/" className="relative text-gray-600 hover:text-brand-700 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-brand-600 after:transition-all hover:after:w-full">Nouvelle demande</Link>
            <Link to="/mes-demandes" className="relative text-gray-600 hover:text-brand-700 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-brand-600 after:transition-all hover:after:w-full">Suivre ma demande</Link>
            <Link to="/login" className="text-gray-400 hover:text-gray-700 transition-colors pl-4 border-l border-gray-200">Espace agent</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}

export default PublicLayout;