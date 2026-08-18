import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function AgentDashboardPage() {
  const { agentId } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketSelectionne, setTicketSelectionne] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [chargementSuggestion, setChargementSuggestion] = useState(false);
  const [resolution, setResolution] = useState('');
  const [chargement, setChargement] = useState(true);

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

    try {
      await axiosClient.patch(`/api/tickets/${ticketSelectionne.id}/resoudre`, {
        description: resolution,
      });
      setTicketSelectionne(null);
      chargerTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const ticketsEnCours = tickets.filter((t) => t.status !== 'RESOLU');
  const ticketsResolus = tickets.filter((t) => t.status === 'RESOLU');

  return (
    <DashboardLayout title="Mes tickets">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Tickets assignés ({ticketsEnCours.length})
            </h2>
          </div>

          {chargement ? (
            <div className="text-gray-400 text-sm">Chargement...</div>
          ) : ticketsEnCours.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
              Aucun ticket en cours pour le moment
            </div>
          ) : (
            <div className="space-y-2">
              {ticketsEnCours.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => ouvrirTicket(ticket)}
                  className={`w-full text-left bg-white rounded-lg border p-4 hover:border-brand-500 hover:shadow-sm transition-all ${
                    ticketSelectionne?.id === ticket.id ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200'
                  }`}
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
            <div className="mt-8">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Résolus récemment ({ticketsResolus.length})
              </h2>
              <div className="space-y-2 opacity-60">
                {ticketsResolus.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-4">
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
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-1">{ticketSelectionne.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{ticketSelectionne.description}</p>

              <div className="mb-4 p-3 bg-brand-50 rounded-md border border-brand-100">
                <p className="text-xs font-medium text-brand-700 mb-1">💡 Suggestion IA</p>
                {chargementSuggestion ? (
                  <p className="text-sm text-gray-500 italic">Génération en cours...</p>
                ) : (
                  <p className="text-sm text-gray-700">{suggestion}</p>
                )}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Résolution</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
                placeholder="Décrivez la résolution apportée..."
              />

              <button
                onClick={resoudreTicket}
                className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 transition-colors text-sm font-medium"
              >
                Marquer comme résolu
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 border-dashed p-8 text-center text-gray-400 text-sm">
              Sélectionnez un ticket pour voir les détails
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AgentDashboardPage;