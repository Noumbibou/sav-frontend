import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardLayout from '../../components/DashboardLayout';
import { PriorityBadge, StatusBadge } from '../../components/Badge';
import { Link } from 'react-router-dom';

const SKILL_TYPES = ['TECHNIQUE', 'FACTURATION', 'GENERALE', 'RECLAMATION'];

const KPI_ICONS = {
  nouveaux: <path d="M12 5v14M5 12h14" />,
  enCours: <><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></>,
  resolus: <path d="M20 6 9 17l-5-5" />,
  satisfaction: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.977-2.89c-.782-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69z" />,
};

function KpiCard({ label, value, accent, tint, icon, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tint}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${accent}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </div>
      </div>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function KpiSkeleton({ delay = 0 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="w-8 h-8 rounded-lg bg-gray-100" />
      </div>
      <div className="h-8 w-14 bg-gray-200 rounded" />
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
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center ring-1 ring-brand-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nouvel agent</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {erreur && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 text-red-700 rounded-lg text-sm ring-1 ring-red-100 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{erreur}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Youssef Amrani"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Ex: youssef.amrani@sav.ma"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              className="flex-1 bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enCours ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                  Création...
                </>
              ) : (
                'Créer'
              )}
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
    {
      id: 'vue-ensemble', label: "Vue d'ensemble", icon: (
        <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>
      ),
    },
    {
      id: 'agents', label: 'Agents', icon: (
        <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
      ),
    },
  ];

  if (chargement) {
    return (
      <DashboardLayout title="Tableau de bord">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiSkeleton delay={0} />
          <KpiSkeleton delay={50} />
          <KpiSkeleton delay={100} />
          <KpiSkeleton delay={150} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-3">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
        </div>
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
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              ongletActif === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              {tab.icon}
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {ongletActif === 'vue-ensemble' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <KpiCard label="Nouveaux" value={nouveaux} accent="text-blue-600" tint="bg-blue-50" icon={KPI_ICONS.nouveaux} delay={0} />
            <KpiCard label="En cours" value={enCours} accent="text-purple-600" tint="bg-purple-50" icon={KPI_ICONS.enCours} delay={50} />
            <KpiCard label="Résolus" value={resolus} accent="text-green-600" tint="bg-green-50" icon={KPI_ICONS.resolus} delay={100} />
            <KpiCard label="Satisfaction moyenne" value={scoreMoyen !== '—' ? `${scoreMoyen}/5` : '—'} accent="text-brand-600" tint="bg-brand-50" icon={KPI_ICONS.satisfaction} delay={150} />
          </div>

          <section className="mb-8 animate-fade-in-up animation-delay-200">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Respect des délais SLA</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {Object.keys(synthese).length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucune donnée disponible. Lancez un rapport SLA depuis le backend.</p>
                </div>
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
                      <tr key={priorite} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3"><PriorityBadge priority={priorite} /></td>
                        <td className="px-5 py-3 text-gray-700">{data.total}</td>
                        <td className="px-5 py-3 text-gray-700">{data.respectes}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${data.tauxRespectPourcent >= 90 ? 'bg-green-500' : data.tauxRespectPourcent >= 70 ? 'bg-orange-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(100, data.tauxRespectPourcent)}%` }}
                              />
                            </div>
                            <span className={`font-semibold ${data.tauxRespectPourcent >= 90 ? 'text-green-600' : data.tauxRespectPourcent >= 70 ? 'text-orange-600' : 'text-red-600'}`}>
                              {data.tauxRespectPourcent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="animate-fade-in-up animation-delay-250">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tickets récents</h2>
              <Link to="/responsable/tickets" className="group text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1 transition-colors">
                Voir tous les tickets
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
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
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Agents & compétences</h2>
            <button
              onClick={() => setModaleOuverte(true)}
              className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm shadow-brand-600/20 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nouvel agent
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {agents.map((agent, i) => {
              const workload = getWorkload(agent.id);
              const ratio = workload ? workload.currentLoad / Math.max(workload.maxCapacity, 1) : 0;
              const initials = (agent.name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <div key={agent.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{agent.name}</p>
                        <p className="text-xs text-gray-500 truncate">{agent.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => supprimerAgent(agent.id, agent.name)}
                      title="Supprimer cet agent"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {workload && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Charge de travail</span>
                        <span className="font-medium">{workload.currentLoad}/{workload.maxCapacity}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${ratio >= 1 ? 'bg-red-500' : ratio >= 0.75 ? 'bg-orange-500' : 'bg-brand-500'}`}
                          style={{ width: `${Math.min(100, ratio * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {agent.skills?.map((skill) => (
                      <span
                        key={skill.id}
                        onClick={() => supprimerCompetence(agent.id, skill.id)}
                        title="Cliquer pour retirer"
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        {skill.name} ×
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={nouvelleCompetence[agent.id] || ''}
                      onChange={(e) => setNouvelleCompetence((prev) => ({ ...prev, [agent.id]: e.target.value }))}
                      className="flex-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-gray-400"
                    >
                      <option value="">+ Ajouter une compétence</option>
                      {SKILL_TYPES.filter((t) => !agent.skills?.some((s) => s.name === t)).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => ajouterCompetence(agent.id)}
                      className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 active:scale-[0.98] transition-all"
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
