// PAGE 18 — Vendor Management System
// Route: /events/[id]/vendors · Akses: PM (full), Division Head Logistik (operational)

import { Metadata } from "next";

export const metadata: Metadata = { title: "Vendor Management — EvOS" };

export default function VendorsPage({ params }: { params: { id: string } }) {
  return (
    <div className="vendors-page">
      <header className="page-header">
        <h1>📦 Vendor Management</h1>
        <button className="btn btn-primary" id="btn-add-vendor">+ Tambah Vendor</button>
      </header>

      {/* Vendor Stats */}
      <div className="vendor-stats-grid">
        <div className="stat-card">
          <span className="stat-value" id="vendor-total">0</span>
          <span className="stat-label">Total Vendor</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" id="vendor-confirmed">0</span>
          <span className="stat-label">✅ Confirmed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" id="vendor-pending">0</span>
          <span className="stat-label">⏳ Pending</span>
        </div>
        <div className="stat-card stat-card--warning">
          <span className="stat-value" id="vendor-at-risk">0</span>
          <span className="stat-label">⚠️ At Risk</span>
        </div>
      </div>

      {/* Vendor Table */}
      <section className="section">
        <div className="section-header">
          <h2>Daftar Vendor</h2>
          <input type="search" id="vendor-search" placeholder="Cari vendor..." className="input-search" />
        </div>
        <table className="data-table" id="vendors-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Kategori</th>
              <th>PIC</th>
              <th>Status</th>
              <th>Nilai Kontrak</th>
              <th>Deadline</th>
              <th>Reliability</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="vendors-table-body">
            <tr>
              <td colSpan={8} className="placeholder-text">Belum ada vendor. Tambah vendor pertama.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* AI Vendor Insights */}
      <section className="section">
        <h2>🧠 AI Vendor Insights</h2>
        <div className="ai-insights" id="vendor-ai-insights">
          <p className="placeholder-text">Insights akan muncul berdasarkan data historis vendor.</p>
        </div>
      </section>
    </div>
  );
}
