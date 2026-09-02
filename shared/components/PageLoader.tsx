export default function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="page-loader">
      <div className="page-loader-ring" />
      <span>{label}</span>
    </div>
  );
}
