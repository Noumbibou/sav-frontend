import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import PublicLayout from '../../components/PublicLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function DetailSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-64 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 bg-gray-100 rounded" />
          <div className="h-3.5 w-24 bg-gray-200 rounded" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 bg-gray-100 rounded" />
          <div className="h-3.5 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

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

  const BackLink = () => (
    <Link to="/mes-demandes" className="group text-sm text-brand-600 hover:text-brand-700 mb-4 inline-flex items-center gap-1.5 font-medium transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
      Retour à mes demandes
    </Link>
  );

  if (chargement) {
    return (
      <PublicLayout>
        <BackLink />
        <DetailSkeleton />
      </PublicLayout>
    );
  }

  if (!ticket) {
    return (
      <PublicLayout>
        <BackLink />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center animate-fade-in-up">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Demande introuvable.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <BackLink />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 animate-fade-in-up">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-900 leading-snug">{ticket.title}</h1>
          <div className="flex gap-2 shrink-0">
            <PriorityBadge priority={ticket.priority?.label} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">{ticket.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div className="flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Catégorie</p>
              <p className="text-gray-700 font-medium">{ticket.category?.name || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Créé le</p>
              <p className="text-gray-700 font-medium">{new Date(ticket.createdAt).toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {ticket.status === 'RESOLU' && ticket.resolution && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 flex gap-3 animate-fade-in-up animation-delay-100">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-green-700 mb-1">Résolution</p>
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.resolution.description}</p>
            </div>
          </div>
        )}

        {ticket.status === 'RESOLU' && survey && !survey.score && (
          <div className="mt-6 animate-fade-in-up animation-delay-150">
            <Link
              to={`/surveys/${survey.id}`}
              className="flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.977-2.89c-.782-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69z" />
              </svg>
              Donner mon avis sur cette résolution
            </Link>
          </div>
        )}

        {ticket.status === 'RESOLU' && survey && survey.score && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500 flex items-center justify-center gap-2 animate-fade-in-up animation-delay-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Merci, vous avez déjà répondu à notre enquête de satisfaction.
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

export default TicketDetailPage;
