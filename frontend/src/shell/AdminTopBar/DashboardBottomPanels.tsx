export default function DashboardBottomPanels() {
  return (
    <section className="dashboard-bottom">
      <article className="dashboard-panel dashboard-panel--bottomLarge">
        <div className="dashboard-panel__header">
          <div>
            <h2>Application Sales</h2>
          </div>

          <div className="dashboard-panel__tools">
            <button type="button">⛶</button>
            <button type="button">−</button>
            <button type="button">🗑</button>
          </div>
        </div>

        <div className="dashboard-application">
          <div className="dashboard-application__legend">
            <span className="dashboard-application__square" />
            <span>Application</span>
          </div>
        </div>
      </article>

      <article className="dashboard-panel dashboard-panel--bottomSmall">
        <div className="dashboard-panel__header">
          <div>
            <h2>User Activity</h2>
          </div>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-user__item">
            <div className="dashboard-user__avatar" />
            <div>
              <strong>John Deo</strong>
              <p>Developer</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
