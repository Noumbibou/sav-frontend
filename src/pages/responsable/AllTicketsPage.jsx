import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardLayout from '../../components/DashboardLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';

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
      <Link to="/responsable/dashboard" className="text-sm text-brand-600 hover:underline mb-4 inline-block">
        ← Retour au tableau de bord
      </Link>

      {chargement ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 mb-4">
            {data.content.map((ticket) => (
              <div key={ticket.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-800">{ticket.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <PriorityBadge priority={ticket.priority?.label} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">
              Page {data.number + 1} sur {data.totalPages} ({data.totalElements} tickets au total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AllTicketsPage;