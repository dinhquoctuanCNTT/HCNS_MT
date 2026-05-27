export default function DashboardRightPanel() {
  return (
    <section className="dashboard-panel dashboard-panel--risk">
      <h2 className="dashboard-risk__title">Project Risk</h2>

      <div className="dashboard-risk__circle">
        <div className="dashboard-risk__circleInner">5</div>
      </div>

      <div className="dashboard-risk__status">Balanced</div>
      <button className="dashboard-risk__link" type="button">
        Change Your Risk
      </button>

      <div className="dashboard-risk__meta">
        <div>
          <span>Nr</span>
          <strong>AWS 2455</strong>
        </div>

        <div>
          <span>Created</span>
          <strong>30th Sep</strong>
        </div>
      </div>

      <button className="dashboard-risk__download" type="button">
        Download Overall Report
      </button>
    </section>
  );
}
