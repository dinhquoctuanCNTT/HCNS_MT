export default function DashboardChart() {
  return (
    <section className="dashboard-panel dashboard-panel--chart">
      <div className="dashboard-panel__header">
        <div>
          <h2>Sales Analytics</h2>
          <p>For more details about usage, please refer amCharts licences.</p>
        </div>

        <div className="dashboard-panel__tools">
          <button type="button">⛶</button>
          <button type="button">−</button>
          <button type="button">🗑</button>
        </div>
      </div>

      <div className="dashboard-chart">
        <div className="dashboard-chart__topline" />

        <div className="dashboard-chart__years">
          <span>1950</span>
          <span>1960</span>
          <span>1970</span>
          <span>1980</span>
          <span>1990</span>
          <span>2000</span>
        </div>

        <div className="dashboard-chart__line dashboard-chart__line--gray" />
        <div className="dashboard-chart__line dashboard-chart__line--orange" />

        <div className="dashboard-chart__xLabels">
          <span>1972</span>
          <span>1973</span>
          <span>1974</span>
          <span>1975</span>
          <span>1976</span>
          <span>1977</span>
          <span>1978</span>
          <span>1979</span>
          <span>1980</span>
          <span>1981</span>
        </div>
      </div>
    </section>
  );
}
