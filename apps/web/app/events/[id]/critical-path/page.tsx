// PAGE 15 — Critical Path & Dependency Map
// Route: /events/[id]/critical-path · Akses: PM (full), Division Head (partial)

import { Metadata } from "next";

export const metadata: Metadata = { title: "Critical Path — EvOS" };

export default function CriticalPathPage({ params }: { params: { id: string } }) {
  return (
    <div className="critical-path-page">
      <header className="page-header">
        <h1>🗺️ Critical Path & Dependency Map</h1>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" id="btn-cp-refresh">
            🔄 Refresh
          </button>
          <button className="btn btn-outline btn-sm" id="btn-cp-simulate">
            ⚡ Simulate Delay
          </button>
        </div>
      </header>

      {/* Legend */}
      <div className="cp-legend">
        <span className="legend-item legend-critical">🔴 Critical Path</span>
        <span className="legend-item legend-blocked">🚫 Blocked</span>
        <span className="legend-item legend-at-risk">🟡 At Risk</span>
        <span className="legend-item legend-on-track">🟢 On Track</span>
      </div>

      {/* Dependency Graph Canvas */}
      <div className="dependency-graph" id="dependency-graph">
        <p className="placeholder-text">
          Dependency graph akan dirender di sini menggunakan D3.js / ReactFlow.
        </p>
      </div>

      {/* Blocked Tasks Panel */}
      <section className="section">
        <h2>🚫 Task yang Terblokir</h2>
        <div className="blocked-tasks-list" id="blocked-tasks-list">
          <p className="placeholder-text">Tidak ada task yang terblokir saat ini.</p>
        </div>
      </section>

      {/* Delay Simulation Panel */}
      <section className="section" id="delay-simulation-panel">
        <h2>⚡ Simulasi Dampak Keterlambatan</h2>
        <div className="simulation-controls">
          <select id="simulate-task-select" className="select">
            <option value="">Pilih task...</option>
          </select>
          <input id="simulate-delay-days" type="number" min={1} max={30} placeholder="Hari delay" className="input-sm" />
          <button className="btn btn-warning btn-sm" id="btn-run-simulation">Jalankan Simulasi</button>
        </div>
        <div className="simulation-result" id="simulation-result">
          <p className="placeholder-text">Pilih task dan jalankan simulasi untuk melihat dampak cascade.</p>
        </div>
      </section>
    </div>
  );
}
