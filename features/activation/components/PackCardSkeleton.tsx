export default function PackCardSkeleton() {
  return (
    <div className="pack-card-skeleton">
      <div className="skeleton skeleton-media" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: "68%" }} />
        <div className="skeleton skeleton-line" style={{ width: "38%", height: "10px" }} />
        <div className="skeleton skeleton-line" style={{ width: "44%", height: "28px", marginBottom: "4px" }} />
        <div className="skeleton skeleton-line" style={{ width: "28%", height: "10px", marginBottom: "8px" }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton-feature-row">
            <div className="skeleton skeleton-circle" />
            <div className="skeleton skeleton-line" style={{ flex: 1 }} />
          </div>
        ))}
        <div
          className="skeleton skeleton-line"
          style={{ height: "46px", marginTop: "auto", borderRadius: "10px" }}
        />
      </div>
    </div>
  );
}
