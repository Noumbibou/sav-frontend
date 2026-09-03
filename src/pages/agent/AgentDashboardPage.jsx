import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function TicketCardSkeleton({ delay = 0 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
      <div className="h-3 w-2/3 bg-gray-100 rounded" />
    </div>
  );
}

function AgentDashboardPage() {
  const { agentId } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketSelectionne, setTicketSelectionne] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [chargementSuggestion, setChargementSuggestion] = useState(false);
  const [resolution, setResolution] = useState('');
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    chargerTickets();
  }, []);

  const chargerTickets = async () => {
    setChargement(true);
    try {
      const response = await axiosClient.get(`/api/tickets/agent/${agentId}`);
      setTickets(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const ouvrirTicket = async (ticket) => {
    setTicketSelectionne(ticket);
    setSuggestion('');
    setResolution('');
    setChargementSuggestion(true);

    try {
      const response = await axiosClient.get(`/api/tickets/${ticket.id}/suggestion`);
      setSuggestion(response.data.suggestion);
    } catch (err) {
      setSuggestion("Impossible de générer une suggestion pour le moment.");
    } finally {
      setChargementSuggestion(false);
    }
  };

  const resoudreTicket = async () => {
    if (!resolution.trim()) return;

    setEnvoiEnCours(true);
    try {
      await axiosClient.patch(`/api/tickets/${ticketSelectionne.id}/resoudre`, {
        description: resolution,
      });
      setTicketSelectionne(null);
      chargerTickets();
    } catch (err) {
      console.error(err);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const ticketsEnCours = tickets.filter((t) => t.status !== 'RESOLU');
  const ticketsResolus = tickets.filter((t) => t.status === 'RESOLU');

  return (
    <DashboardLayout title="Mes tickets">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-4 animate-fade-in-up">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Tickets assignés ({ticketsEnCours.length})
            </h2>
          </div>

          {chargement ? (
            <div className="space-y-2">
              <TicketCardSkeleton delay={0} />
              <TicketCardSkeleton delay={100} />
              <TicketCardSkeleton delay={200} />
            </div>
          ) : ticketsEnCours.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 border-dashed p-10 text-center animate-fade-in-up">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Aucun ticket en cours pour le moment</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ticketsEnCours.map((ticket, i) => (
                <button
                  key={ticket.id}
                  onClick={() => ouvrirTicket(ticket)}
                  className={`w-full text-left bg-white rounded-xl border p-4 hover:border-brand-400 hover:shadow-md transition-all animate-fade-in-up ${
                    ticketSelectionne?.id === ticket.id ? 'border-brand-500 ring-2 ring-brand-500/15 shadow-sm' : 'border-gray-200'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <PriorityBadge priority={ticket.priority?.label} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
                </button>
              ))}
            </div>
          )}

          {ticketsResolus.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Résolus récemment ({ticketsResolus.length})
              </h2>
              <div className="space-y-2">
                {ticketsResolus.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 p-4 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700">{ticket.title}</h3>
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1">
          {ticketSelectionne ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24 animate-fade-in-up">
              <h3 className="font-semibold text-gray-900 mb-1">{ticketSelectionne.title}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{ticketSelectionne.description}</p>

              <div className="mb-4 p-3.5 bg-brand-50 rounded-lg border border-brand-100">
                <p className="text-xs font-medium text-brand-700 mb-1.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 2.2 1.3 3.5 2 4.5s1 1.5 1 2.5h5c0-1 .3-1.5 1-2.5s2-2.3 2-4.5A5.5 5.5 0 0 0 9.5 2Z" />
                    <path d="M9 18h1M8.5 21h2" />
                  </svg>
                  Suggestion IA
                </p>
                {chargementSuggestion ? (
                  <div className="space-y-1.5 py-0.5">
                    <div className="h-2.5 w-full bg-brand-100/80 rounded animate-pulse" />
                    <div className="h-2.5 w-4/5 bg-brand-100/80 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                )}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">Résolution</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400 mb-3"
                placeholder="Décrivez la résolution apportée..."
              />

              <button
                onClick={resoudreTicket}
                disabled={envoiEnCours || !resolution.trim()}
                className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {envoiEnCours ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
                Marquer comme résolu
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 border-dashed p-8 text-center sticky top-24 animate-fade-in-up">
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Sélectionnez un ticket pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AgentDashboardPage;
