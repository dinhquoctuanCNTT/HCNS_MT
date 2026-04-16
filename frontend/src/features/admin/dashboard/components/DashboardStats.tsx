const stats = [
  {
    value: "$30200",
    label: "All Earnings",
    update: "update : 2:15 am",
    tone: "orange",
  },
  {
    value: "290+",
    label: "Page Views",
    update: "update : 2:15 am",
    tone: "green",
  },
  {
    value: "145",
    label: "Task Completed",
    update: "update : 2:15 am",
    tone: "pink",
  },
  {
    value: "500",
    label: "Downloads",
    update: "update : 2:15 am",
    tone: "blue",
  },
];

export default function DashboardStats() {
  return (
    <section className="dashboard-stats">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`dashboard-stat-card dashboard-stat-card--${item.tone}`}
        >
          <div className="dashboard-stat-card__body">
            <div>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>

            <div className="dashboard-stat-card__miniChart">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="dashboard-stat-card__footer">
            <span className="dashboard-stat-card__clock">◷</span>
            <span>{item.update}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
