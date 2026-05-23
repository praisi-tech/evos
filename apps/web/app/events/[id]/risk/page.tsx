// PAGE 16 — Risk Dashboard & Escalation Chain
// Route: /events/[id]/risk · Akses: PM (full), Super Admin (view)

import { Metadata } from "next";

export const metadata: Metadata = { title: "Risk Dashboard — EvOS" };

export default function RiskPage({ params }: { params: { id: string } }) {
  return (
    <div className="risk-page">
      <header className="page-header">
        <h1>⚠️ Risk Dashboard</h1>
        <button className="btn btn-primary" id="btn-add-risk">+ Tambah Risiko</button>
      </header>

      {/* Risk Summary Cards */}
      <div className="risk-summary-grid">
        <div className="risk-card risk-card--critical">
          <span className="risk-count" id="count-critical">0</span>
          <span className="risk-label">🔴 Critical</span>
        </div>
        <div className="risk-card risk-card--high">
          <span className="risk-count" id="count-high">0</span>
          <span className="risk-label">🟠 High</span>
        </div>
        <div className="risk-card risk-card--medium">
          <span className="risk-count" id="count-medium">0</span>
          <span className="risk-label">🟡 Medium</span>
        </div>
        <div className="risk-card risk-card--low">
          <span className="risk-count" id="count-low">0</span>
          <span className="risk-label">🟢 Low</span>
        </div>
      </div>

      {/* Active Risks Table */}
      <section className="section">
        <h2>Risiko Aktif</h2>
        <table className="data-table" id="risks-table">
          <thead>
            <tr>
              <th>Risiko</th>
              <th>Divisi</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Escalation Level</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="risks-table-body">
            <tr>
              <td colSpan={6} className="placeholder-text">Tidak ada risiko aktif.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* AI Escalation Protocol — V1 */}
      <section className="section">
        <h2>🤖 AI Escalation Protocol</h2>
        <div className="escalation-chain" id="escalation-chain">
          <div className="escalation-step">
            <span className="escalation-level">Level 1</span>
            <span className="escalation-desc">In-app notification ke Division Head</span>
          </div>
          <div className="escalation-step">
            <span className="escalation-level">Level 2</span>
            <span className="escalation-desc">Push notification + WhatsApp ke PM</span>
          </div>
          <div className="escalation-step">
            <span className="escalation-level">Level 3</span>
            <span className="escalation-desc">Alert ke Super Admin + task otomatis dibuat</span>
          </div>
        </div>
        <div className="escalation-logs" id="escalation-logs">
          <p className="placeholder-text">Belum ada eskalasi berjalan.</p>
        </div>
      </section>
    </div>
  );
}
