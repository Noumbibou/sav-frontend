import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function TicketSkeleton({ delay = 0 }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between animate-pulse" style={{ animationDelay: `${delay}ms` }}>
      <div className="space-y-2">
        <div className="h-3.5 w-48 bg-gray-200 rounded" />
        <div className="h-2.5 w-24 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

function MyTicketsPage() {
  const [email, setEmail] = useState(localStorage.getItem('clientEmail') || '');
  const [tickets, setTickets] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const searchBoxRef = useRef(null);
  const dropdownRef = useRef(null);

  const rechercher = async (e, valeurEmail = email) => {
    e.preventDefault();
    setShowSuggestions(false);
    setErreur('');
    setChargement(true);
    setTickets(null);

    try {
      const customerRes = await axiosClient.get(`/api/customers/by-email/${encodeURIComponent(valeurEmail)}`);
      const ticketsRes = await axiosClient.get(`/api/tickets/customer/${customerRes.data.id}`);
      setTickets(ticketsRes.data);
      localStorage.setItem('clientEmail', valeurEmail);
      if (ticketsRes.data.length === 0) {
        setErreur("Vous n'avez pas encore de demande enregistrée.");
      }
    } catch (err) {
      setErreur('Aucune demande trouvée pour cet email.');
      setTickets([]);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (email) rechercher({ preventDefault: () => {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (email.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      axiosClient
        .get(`/api/customers/search`, { params: { query: email.trim() } })
        .then((res) => setSuggestions(res.data))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (!showSuggestions) return;
    const handleClickOutside = (e) => {
      const dansChamp = searchBoxRef.current && searchBoxRef.current.contains(e.target);
      const dansDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!dansChamp && !dansDropdown) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  useEffect(() => {
    if (!showSuggestions || suggestions.length === 0 || !searchBoxRef.current) {
      setDropdownRect(null);
      return;
    }
    const updatePosition = () => {
      const rect = searchBoxRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showSuggestions, suggestions]);

  const choisirSuggestion = (suggestionEmail) => {
    setEmail(suggestionEmail);
    setShowSuggestions(false);
    rechercher({ preventDefault: () => {} }, suggestionEmail);
  };

  return (
    <PublicLayout>
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center ring-1 ring-brand-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suivre mes demandes</h1>
            <p className="text-gray-500 text-sm mt-0.5">Retrouvez l'historique et le statut de vos demandes.</p>
          </div>
        </div>
      </div>

      <form onSubmit={rechercher} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex gap-3 animate-fade-in-up animation-delay-100">
        <div className="relative flex-1" ref={searchBoxRef}>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 peer-focus:text-brand-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" />
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              const valeur = e.target.value;
              setEmail(valeur);
              setShowSuggestions(true);
              if (!valeur.trim()) {
                setTickets(null);
                setErreur('');
                localStorage.removeItem('clientEmail');
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Votre adresse email"
            required
            autoComplete="off"
            className="peer w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
          />
          {showSuggestions && suggestions.length > 0 && dropdownRect && createPortal(
            <ul
              ref={dropdownRef}
              style={{ position: 'absolute', top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
              className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in"
            >
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => choisirSuggestion(s.email)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 transition-colors flex flex-col"
                  >
                    <span className="text-gray-900 font-medium">{s.email}</span>
                    <span className="text-xs text-gray-400">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>,
            document.body
          )}
        </div>
        <button
          type="submit"
          disabled={chargement}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
        >
          {chargement ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
              </svg>
              Recherche...
            </>
          ) : (
            'Rechercher'
          )}
        </button>
      </form>

      {chargement && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden animate-fade-in">
          <TicketSkeleton delay={0} />
          <TicketSkeleton delay={100} />
          <TicketSkeleton delay={200} />
        </div>
      )}

      {!chargement && tickets === null && (
        <div className="text-center py-16 animate-fade-in-up animation-delay-150">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Entrez votre email pour retrouver vos demandes.</p>
        </div>
      )}

      {!chargement && erreur && tickets?.length === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">{erreur}</p>
        </div>
      )}

      {!chargement && tickets && tickets.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden animate-fade-in-up">
          {tickets.map((ticket, i) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="group flex items-center gap-4 px-5 py-4 hover:bg-brand-50/40 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center shrink-0 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-gray-400 group-hover:text-brand-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate group-hover:text-brand-700 transition-colors">{ticket.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <PriorityBadge priority={ticket.priority?.label} />
                <StatusBadge status={ticket.status} />
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </PublicLayout>
  );
}

export default MyTicketsPage;
