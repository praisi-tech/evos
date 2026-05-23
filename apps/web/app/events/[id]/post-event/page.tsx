// PAGE 20 — Post-Event Report & Organizational Learning Loop
// Route: /events/[id]/post-event · Akses: PM (full), Super Admin (full), Division Head (divisinya)
// AI auto-generate dalam 24 jam setelah PM klik 'End Event'.

import { Metadata } from "next";

export const metadata: Metadata = { title: "Post-Event Report — EvOS" };

export default function PostEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="post-event-page">
      <header className="page-header">
        <h1>📋 Post-Event Report</h1>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" id="btn-export-pdf">Export PDF</button>
          <button className="btn btn-outline btn-sm" id="btn-export-csv">Export CSV</button>
        </div>
      </header>

      {/* Report Status Banner */}
      <div className="report-status-banner" id="report-status-banner">
        <span>⏳ AI sedang menyusun laporan... Biasanya selesai dalam 24 jam setelah event berakhir.</span>
      </div>

      {/* Report Sections */}
      <div className="report-sections">
        {/* Executive Summary */}
        <section className="report-section">
          <h2>Executive Summary</h2>
          <div id="report-executive-summary" className="report-content">
            <p className="placeholder-text">Menunggu AI generate...</p>
          </div>
        </section>

        {/* Health Score Final */}
        <section className="report-section">
          <h2>📊 Final Health Score</h2>
          <div id="report-health-chart" className="chart-placeholder">Chart</div>
        </section>

        {/* Task Completion Rate */}
        <section className="report-section">
          <h2>✅ Task Completion</h2>
          <div className="completion-stats-grid" id="completion-stats">
            <div className="stat-card">
              <span className="stat-value" id="stat-tasks-total">—</span>
              <span className="stat-label">Total Task</span>
            </div>
            <div className="stat-card stat-card--success">
              <span className="stat-value" id="stat-tasks-done">—</span>
              <span className="stat-label">Selesai</span>
            </div>
            <div className="stat-card stat-card--danger">
              <span className="stat-value" id="stat-tasks-overdue">—</span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
        </section>

        {/* KPI Achievement */}
        <section className="report-section">
          <h2>🎯 KPI Achievement</h2>
          <div id="report-kpi-list" className="report-content">
            <p className="placeholder-text">Menunggu AI generate...</p>
          </div>
        </section>

        {/* Risk & Incident Summary */}
        <section className="report-section">
          <h2>⚠️ Risk & Incident Summary</h2>
          <div id="report-risk-summary" className="report-content">
            <p className="placeholder-text">Menunggu AI generate...</p>
          </div>
        </section>

        {/* AI Lessons Learned */}
        <section className="report-section">
          <h2>🧠 Pelajaran yang Dipetik (AI)</h2>
          <div id="report-lessons" className="report-content ai-content">
            <p className="placeholder-text">Menunggu AI generate...</p>
          </div>
        </section>

        {/* Org Memory Update */}
        <section className="report-section">
          <h2>💾 Org Memory Update</h2>
          <p className="section-desc">Data berikut telah dimasukkan ke Organizational Memory Engine:</p>
          <ul id="org-memory-updates" className="memory-update-list">
            <li className="placeholder-text">Memuat...</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
