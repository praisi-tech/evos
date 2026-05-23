// PAGE 04 — Main Dashboard (Organization Level)
// Route: /dashboard · Akses: Super Admin, PM

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — EvOS",
  description: "Pantau semua event organisasi Anda dalam satu tampilan.",
};

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard Organisasi</h1>
          <p className="page-subtitle">Ringkasan semua event aktif Anda</p>
        </div>
        <a href="/events/new" className="btn btn-primary" id="btn-create-event">
          + Buat Event Baru
        </a>
      </header>

      {/* Health Score Overview */}
      <section className="widget-grid">
        <div className="widget widget-health-score">
          <span className="widget-label">Avg. Health Score</span>
          <span className="widget-value" id="avg-health-score">—</span>
          <span className="widget-hint">Threshold kritis &lt; 60</span>
        </div>
        <div className="widget">
          <span className="widget-label">Event Aktif</span>
          <span className="widget-value" id="active-events-count">—</span>
        </div>
        <div className="widget">
          <span className="widget-label">Total Member</span>
          <span className="widget-value" id="total-members-count">—</span>
        </div>
        <div className="widget">
          <span className="widget-label">Task Overdue</span>
          <span className="widget-value widget-value--danger" id="overdue-tasks-count">—</span>
        </div>
      </section>

      {/* Active Events List */}
      <section className="section">
        <h2>Event Aktif</h2>
        <div className="event-cards" id="active-events-list">
          <div className="empty-state">
            <span>Belum ada event aktif.</span>
            <a href="/events/new" className="btn btn-primary btn-sm">Buat Event Pertama</a>
          </div>
        </div>
      </section>

      {/* AI Insights Panel */}
      <section className="section">
        <h2>🧠 AI Insights</h2>
        <div className="ai-insights-list" id="ai-insights">
          <p className="placeholder-text">AI insights akan muncul setelah event pertama selesai.</p>
        </div>
      </section>
    </div>
  );
}
