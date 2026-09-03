import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setIsSubmitting(true);

    try {
      const role = await login(email, password);
      if (role === 'AGENT') {
        navigate('/agent/dashboard');
      } else if (role === 'RESPONSABLE') {
        navigate('/responsable/dashboard');
      }
    } catch (err) {
      setErreur('Email ou mot de passe incorrect');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Panneau de marque (visible dès md) */}
      <div className="hidden md:flex relative w-1/2 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900">
        <div className="absolute -top-24 -left-16 w-96 h-96 bg-brand-400/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-brand-300/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl animate-blob animation-delay-4000" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center ring-1 ring-white/20">
              <span className="font-bold text-sm">SAV</span>
            </div>
            <span className="font-semibold text-white/90">Support Client</span>
          </div>

          <div className="animate-fade-in-up animation-delay-150">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6 ring-1 ring-white/20 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Espace professionnel
            </h1>
            <p className="text-white/70 max-w-sm leading-relaxed">
              Gérez les demandes clients, suivez les tickets et pilotez la satisfaction de votre support en un seul endroit.
            </p>
          </div>

          <p className="text-xs text-white/50 animate-fade-in-up animation-delay-200">
            © {new Date().getFullYear()} Support Client — Tous droits réservés
          </p>
        </div>
      </div>

      {/* Panneau formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex md:hidden items-center gap-3 mb-10 animate-fade-in-up">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SAV</span>
            </div>
            <span className="font-semibold text-gray-900">Support Client</span>
          </div>

          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Connexion</h2>
            <p className="text-sm text-gray-500 mb-8">
              Accédez à votre espace agent ou responsable.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {erreur && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 text-red-700 rounded-lg text-sm ring-1 ring-red-100 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{erreur}</span>
              </div>
            )}

            <div className="mb-5 animate-fade-in-up animation-delay-100">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative group">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
                  required
                />
              </div>
            </div>

            <div className="mb-6 animate-fade-in-up animation-delay-150">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative group">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium shadow-sm shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed animate-fade-in-up animation-delay-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
