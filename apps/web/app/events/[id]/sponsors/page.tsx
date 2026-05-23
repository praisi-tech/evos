// PAGE 17 — Sponsor CRM
// Route: /events/[id]/sponsors · Akses: PM (full), Division Head Sponsorship (operational)
// Catatan V1: AI Probability Score, Fatigue Indicator, Warm Intro Map → defer V2

import { Metadata } from "next";

export const metadata: Metadata = { title: "Sponsor CRM — EvOS" };

export default function SponsorsPage({ params }: { params: { id: string } }) {
  return (
    <div className="sponsors-page">
      <header className="page-header">
        <h1>🤝 Sponsor CRM</h1>
        <button className="btn btn-primary" id="btn-add-sponsor">+ Tambah Sponsor</button>
      </header>

      {/* Pipeline Summary */}
      <div className="sponsor-pipeline">
        {SPONSOR_STAGES.map((stage) => (
          <div key={stage.value} className="pipeline-stage">
            <span className="pipeline-label">{stage.label}</span>
            <span className="pipeline-count" id={`sponsor-count-${stage.value}`}>0</span>
          </div>
        ))}
      </div>

      {/* Sponsor Table */}
      <section className="section">
        <div className="section-header">
          <h2>Daftar Sponsor</h2>
          <input type="search" id="sponsor-search" placeholder="Cari sponsor..." className="input-search" />
        </div>
        <table className="data-table" id="sponsors-table">
          <thead>
            <tr>
              <th>Perusahaan</th>
              <th>PIC</th>
              <th>Stage</th>
              <th>Nilai (IDR)</th>
              <th>Last Contact</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="sponsors-table-body">
            <tr>
              <td colSpan={6} className="placeholder-text">Belum ada sponsor. Tambah sponsor pertama.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Interaction Log */}
      <section className="section">
        <h2>Riwayat Interaksi</h2>
        <div className="interaction-log" id="interaction-log">
          <p className="placeholder-text">Pilih sponsor untuk melihat riwayat interaksi.</p>
        </div>
      </section>
    </div>
  );
}

const SPONSOR_STAGES = [
  { value: "PROSPEK", label: "Prospek" },
  { value: "DIHUBUNGI", label: "Dihubungi" },
  { value: "NEGOSIASI", label: "Negosiasi" },
  { value: "DEAL", label: "✅ Deal" },
  { value: "DITOLAK", label: "❌ Ditolak" },
];
