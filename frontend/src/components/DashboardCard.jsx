export default function DashboardCard({ label, value, accent }) {
  return (
    <div className="dash-card">
      <span>{label}</span>
      <strong className={accent ? "accent" : ""}>{value}</strong>
    </div>
  );
}
