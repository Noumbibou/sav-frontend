import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const charger = async () => {
    setChargement(true);
    try {
      const ticketRes = await axiosClient.get(`/api/tickets/${id}`);
      setTicket(ticketRes.data);

      if (ticketRes.data.status === 'RESOLU') {
        try {
          const surveyRes = await axiosClient.get(`/api/surveys/ticket/${id}`);
          setSurvey(surveyRes.data);
        } catch (err) {
          setSurvey(null);
        }
      }
    } catch (err) {
      setTicket(null);
    } finally {
      setChargement(false);
    }
  };

  if (chargement) {
    return <PublicLayout><p className="text-gray-400 text-sm">Chargement...</p></PublicLayout>;
  }

  if (!ticket) {
    return (
      <PublicLayout>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
          Demande introuvable.
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Link to="/mes-demandes" className="text-sm text-brand-600 hover:underline mb-4 inline-block">
        ← Retour à mes demandes
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">{ticket.title}</h1>
          <div className="flex gap-2 shrink-0 ml-3">
            <PriorityBadge priority={ticket.priority?.label} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6">{ticket.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Catégorie</p>
            <p className="text-gray-700">{ticket.category?.name || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Créé le</p>
            <p className="text-gray-700">{new Date(ticket.createdAt).toLocaleString('fr-FR')}</p>
          </div>
        </div>

        {ticket.status === 'RESOLU' && ticket.resolution && (
          <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-100">
            <p className="text-xs font-medium text-green-700 mb-1">Résolution</p>
            <p className="text-sm text-gray-700">{ticket.resolution.description}</p>
          </div>
        )}

        {ticket.status === 'RESOLU' && survey && !survey.score && (
          <div className="mt-6">
            <Link
              to={`/surveys/${survey.id}`}
              className="block text-center bg-brand-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Donner mon avis sur cette résolution
            </Link>
          </div>
        )}

        {ticket.status === 'RESOLU' && survey && survey.score && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md text-center text-sm text-gray-500">
            Merci, vous avez déjà répondu à notre enquête de satisfaction.
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

export default TicketDetailPage;