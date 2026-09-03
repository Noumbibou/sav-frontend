const PRIORITY_STYLES = {
  CRITIQUE: { pill: 'bg-red-50 text-red-700 ring-red-600/20', dot: 'bg-red-500' },
  HAUTE: { pill: 'bg-orange-50 text-orange-700 ring-orange-600/20', dot: 'bg-orange-500' },
  MOYENNE: { pill: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20', dot: 'bg-yellow-500' },
  BASSE: { pill: 'bg-gray-100 text-gray-600 ring-gray-500/20', dot: 'bg-gray-400' },
};

const STATUS_STYLES = {
  NOUVEAU: { pill: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500' },
  EN_COURS: { pill: 'bg-purple-50 text-purple-700 ring-purple-600/20', dot: 'bg-purple-500' },
  RESOLU: { pill: 'bg-green-50 text-green-700 ring-green-600/20', dot: 'bg-green-500' },
};

export function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.BASSE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${style.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NOUVEAU;
  const label = status === 'EN_COURS' ? 'En cours' : status === 'RESOLU' ? 'Résolu' : 'Nouveau';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${style.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'EN_COURS' ? 'animate-pulse' : ''} ${style.dot}`} />
      {label}
    </span>
  );
}