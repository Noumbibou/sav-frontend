import { Link } from 'react-router-dom';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SAV</span>
            </div>
            <span className="font-semibold text-gray-900">Support Client</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Nouvelle demande</Link>
            <Link to="/mes-demandes" className="text-gray-600 hover:text-gray-900">Suivre ma demande</Link>
            <Link to="/login" className="text-gray-400 hover:text-gray-700">Espace agent</Link>
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