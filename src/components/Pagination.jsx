const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </button>
      <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
        Page {page} of {totalPages}
      </span>
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;