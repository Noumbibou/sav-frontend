import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardLayout from '../../components/DashboardLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

function RowSkeleton({ delay = 0 }) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between animate-pulse" style={{ animationDelay: `${delay}ms` }}>
      <div className="space-y-1.5">
        <div className="h-3.5 w-56 bg-gray-200 rounded" />
        <div className="h-2.5 w-20 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

function AllTicketsPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const charger = async () => {
    setChargement(true);
    try {
      const res = await axiosClient.get(`/api/tickets/paginated?page=${page}&size=10`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  return (
    <DashboardLayout title="Tous les tickets">
      <Link to="/responsable/dashboard" className="group text-sm text-brand-600 hover:text-brand-700 mb-4 inline-flex items-center gap-1.5 font-medium transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Retour au tableau de bord
      </Link>

      {chargement ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          <RowSkeleton delay={0} />
          <RowSkeleton delay={60} />
          <RowSkeleton delay={120} />
          <RowSkeleton delay={180} />
          <RowSkeleton delay={240} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 mb-4 overflow-hidden animate-fade-in-up">
            {data.content.map((ticket, i) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="group flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div>
                  <p className="text-sm text-gray-800 group-hover:text-brand-700 transition-colors">{ticket.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <PriorityBadge priority={ticket.priority?.label} />
                  <StatusBadge status={ticket.status} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm animate-fade-in-up animation-delay-100">
            <p className="text-gray-500">
              Page <span className="font-medium text-gray-700">{data.number + 1}</span> sur {data.totalPages} <span className="text-gray-400">({data.totalElements} tickets au total)</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Suivant
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AllTicketsPage;
