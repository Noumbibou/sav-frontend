import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function MyTicketsPage() {
  const [email, setEmail] = useState(localStorage.getItem('clientEmail') || '');
  const [tickets, setTickets] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const rechercher = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    setTickets(null);

    try {
      const customerRes = await axiosClient.get(`/api/customers/by-email/${encodeURIComponent(email)}`);
      const ticketsRes = await axiosClient.get(`/api/tickets/customer/${customerRes.data.id}`);
      setTickets(ticketsRes.data);
      localStorage.setItem('clientEmail', email);
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

  return (
    <PublicLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suivre mes demandes</h1>
        <p className="text-gray-500 text-sm mt-1">Retrouvez l'historique et le statut de vos demandes.</p>
      </div>

      <form onSubmit={rechercher} className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={chargement}
          className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {chargement ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {erreur && tickets?.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">{erreur}</p>
      )}

      {tickets && tickets.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <PriorityBadge priority={ticket.priority?.label} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PublicLayout>
  );
}

export default MyTicketsPage;