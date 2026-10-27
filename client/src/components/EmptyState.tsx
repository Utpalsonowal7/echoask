export function EmptyState({
  title,
  children
}: {
  title: string;
  children: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">✳</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

