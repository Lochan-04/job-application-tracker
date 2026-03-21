export function StatusBadge({ value, label }) {
  return <span className={`status-pill status-${value}`}>{label}</span>;
}

export function PriorityBadge({ value, label }) {
  return <span className={`priority-pill priority-${value}`}>{label}</span>;
}
