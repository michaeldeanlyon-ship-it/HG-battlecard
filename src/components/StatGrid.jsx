export default function StatGrid({ stats }) {
  return (
    <div className="statgrid">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <p className="stat-label">{s.label}</p>
          <p className="stat-value">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
