import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardLayout from '../../components/DashboardLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';
import { Link } from 'react-router-dom';

const SKILL_TYPES = ['TECHNIQUE', 'FACTURATION', 'GENERALE', 'RECLAMATION'];

function KpiCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function CreateAgentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnCours(true);
    try {
      await axiosClient.post('/api/agents', form);
      onCreated();
      onClose();
    } catch (err) {
      setErreur("Erreur lors de la création (email peut-être déjà utilisé).");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Nouvel agent</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {erreur && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{erreur}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Youssef Amrani"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Ex: youssef.amrani@sav.ma"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              className="flex-1 bg-brand-600 text-white py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {enCours ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResponsableDashboardPage() {
  const [ongletActif, setOngletActif] = useState('vue-ensemble');
  const [modaleOuverte, setModaleOuverte] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [synthese, setSynthese] = useState({});
  const [surveys, setSurveys] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [nouvelleCompetence, setNouvelleCompetence] = useState({});

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const [ticketsRes, agentsRes, workloadsRes, syntheseRes, surveysRes] = await Promise.all([
        axiosClient.get('/api/tickets'),
        axiosClient.get('/api/agents'),
        axiosClient.get('/api/workloads'),
        axiosClient.get('/api/sla-reports/synthese'),
        axiosClient.get('/api/surveys'),
      ]);
      setTickets(ticketsRes.data);
      setAgents(agentsRes.data);
      setWorkloads(workloadsRes.data);
      setSynthese(syntheseRes.data);
      setSurveys(surveysRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const ajouterCompetence = async (agentId) => {
    const skill = nouvelleCompetence[agentId];
    if (!skill) return;
    try {
      await axiosClient.post(`/api/agents/${agentId}/skills`, { name: skill });
      setNouvelleCompetence((prev) => ({ ...prev, [agentId]: '' }));
      chargerDonnees();
    } catch (err) {
      alert("Vous n'avez pas les droits pour effectuer cette action.");
    }
  };

  const supprimerAgent = async (agentId, agentName) => {
  if (!window.confirm(`Supprimer ${agentName} ? Cette action est irréversible.`)) return;

  try {
    await axiosClient.delete(`/api/agents/${agentId}`);
    chargerDonnees();
  } catch (err) {
    alert("Impossible de supprimer cet agent.");
  }
};

  const supprimerCompetence = async (agentId, skillId) => {
    try {
      await axiosClient.delete(`/api/agents/${agentId}/skills/${skillId}`);
      chargerDonnees();
    } catch (err) {
      alert("Vous n'avez pas les droits pour effectuer cette action.");
    }
  };

  const nouveaux = tickets.filter((t) => t.status === 'NOUVEAU').length;
  const enCours = tickets.filter((t) => t.status === 'EN_COURS').length;
  const resolus = tickets.filter((t) => t.status === 'RESOLU').length;

  const surveysRepondues = surveys.filter((s) => s.score != null);
  const scoreMoyen = surveysRepondues.length
    ? (surveysRepondues.reduce((sum, s) => sum + s.score, 0) / surveysRepondues.length).toFixed(1)
    : '—';

  const getWorkload = (agentId) => workloads.find((w) => w.agent?.id === agentId);

  const tabs = [
    { id: 'vue-ensemble', label: "Vue d'ensemble" },
    { id: 'agents', label: 'Agents' },
  ];

  if (chargement) {
    return (
      <DashboardLayout title="Tableau de bord">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de bord">
      {/* Onglets */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setOngletActif(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              ongletActif === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ongletActif === 'vue-ensemble' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <KpiCard label="Nouveaux" value={nouveaux} accent="text-blue-600" />
            <KpiCard label="En cours" value={enCours} accent="text-purple-600" />
            <KpiCard label="Résolus" value={resolus} accent="text-green-600" />
            <KpiCard label="Satisfaction moyenne" value={scoreMoyen !== '—' ? `${scoreMoyen}/5` : '—'} accent="text-brand-600" />
          </div>

          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Respect des délais SLA</h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {Object.keys(synthese).length === 0 ? (
                <p className="p-6 text-sm text-gray-400">Aucune donnée disponible. Lancez un rapport SLA depuis le backend.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-left">
                    <tr>
                      <th className="px-5 py-3 font-medium">Priorité</th>
                      <th className="px-5 py-3 font-medium">Tickets évalués</th>
                      <th className="px-5 py-3 font-medium">Respectés</th>
                      <th className="px-5 py-3 font-medium">Taux</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(synthese).map(([priorite, data]) => (
                      <tr key={priorite}>
                        <td className="px-5 py-3"><PriorityBadge priority={priorite} /></td>
                        <td className="px-5 py-3 text-gray-700">{data.total}</td>
                        <td className="px-5 py-3 text-gray-700">{data.respectes}</td>
                        <td className="px-5 py-3">
                          <span className={`font-semibold ${data.tauxRespectPourcent >= 90 ? 'text-green-600' : data.tauxRespectPourcent >= 70 ? 'text-orange-600' : 'text-red-600'}`}>
                            {data.tauxRespectPourcent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tickets récents</h2>
              <Link to="/responsable/tickets" className="text-sm text-brand-600 hover:underline">
                Voir tous les tickets →
              </Link>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="px-5 py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-800">{ticket.title}</p>
                  <div className="flex gap-2 shrink-0 ml-3">
                    <PriorityBadge priority={ticket.priority?.label} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {ongletActif === 'agents' && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Agents & compétences</h2>
            <button
              onClick={() => setModaleOuverte(true)}
              className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-brand-700 transition-colors"
            >
              + Nouvel agent
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {agents.map((agent) => {
              const workload = getWorkload(agent.id);
              return (
                <div key={agent.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {workload && (
                        <span className="text-xs text-gray-500">
                          {workload.currentLoad}/{workload.maxCapacity}
                        </span>
                      )}
                      <button
                        onClick={() => supprimerAgent(agent.id, agent.name)}
                        title="Supprimer cet agent"
                        className="text-gray-300 hover:text-red-600 transition-colors text-lg leading-none">
                          ×
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {agent.skills?.map((skill) => (
                      <span
                        key={skill.id}
                        onClick={() => supprimerCompetence(agent.id, skill.id)}
                        title="Cliquer pour retirer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {skill.name} ×
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={nouvelleCompetence[agent.id] || ''}
                      onChange={(e) => setNouvelleCompetence((prev) => ({ ...prev, [agent.id]: e.target.value }))}
                      className="flex-1 text-xs border border-gray-300 rounded-md px-2 py-1.5"
                    >
                      <option value="">+ Ajouter une compétence</option>
                      {SKILL_TYPES.filter((t) => !agent.skills?.some((s) => s.name === t)).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => ajouterCompetence(agent.id)}
                      className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {modaleOuverte && (
        <CreateAgentModal
          onClose={() => setModaleOuverte(false)}
          onCreated={chargerDonnees}
        />
      )}
    </DashboardLayout>
  );
}

export default ResponsableDashboardPage;
