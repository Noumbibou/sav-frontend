const PRIORITY_STYLES = {
  CRITIQUE: 'bg-red-100 text-red-700 ring-red-600/20',
  HAUTE: 'bg-orange-100 text-orange-700 ring-orange-600/20',
  MOYENNE: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
  BASSE: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

const STATUS_STYLES = {
  NOUVEAU: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  EN_COURS: 'bg-purple-100 text-purple-700 ring-purple-600/20',
  RESOLU: 'bg-green-100 text-green-700 ring-green-600/20',
};

export function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.BASSE;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${style}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NOUVEAU;
  const label = status === 'EN_COURS' ? 'En cours' : status === 'RESOLU' ? 'Résolu' : 'Nouveau';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${style}`}>
      {label}
    </span>
  );
}