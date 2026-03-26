function Badge({ type, value, label }) {
  return <span className={`${type}-pill ${type}-${value}`}>{label}</span>;
}

export function StatusBadge({ value, label }) {
  return <Badge type="status" value={value} label={label} />;
}

export function PriorityBadge({ value, label }) {
  return <Badge type="priority" value={value} label={label} />;
}
