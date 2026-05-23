// PAGE 19 — War Room Mode (Event Day Command Center)
// Route: /events/[id]/warroom · Aktif: H-0 saja · Akses: PM (full), Division Head (ops), Core Member (report)
// Auto-switch 6 jam sebelum event. Dark mode, layout kompak, fokus data live.

import { Metadata } from "next";

export const metadata: Metadata = { title: "🚨 War Room — EvOS" };

export default function WarRoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="warroom-page dark">
      {/* War Room Header */}
      <header className="warroom-header">
        <div className="warroom-title">
          <span className="warroom-badge">🚨 WAR ROOM ACTIVE</span>
          <h1 id="warroom-event-name">Nama Event</h1>
        </div>
        <div className="warroom-meta">
          <div className="warroom-clock" id="warroom-clock">00:00:00</div>
          <div className="warroom-health">
            <span>Health</span>
            <span className="health-score-value" id="warroom-health-score">—</span>
          </div>
          <button className="btn btn-danger-outline btn-sm" id="btn-end-event">End Event</button>
        </div>
      </header>

      {/* Live Command Grid */}
      <div className="warroom-grid">
        {/* Incident Report */}
        <section className="warroom-widget warroom-widget--primary">
          <div className="widget-header">
            <h2>🆘 Laporkan Insiden</h2>
          </div>
          <form className="incident-form" id="incident-form">
            <select id="incident-severity" name="severity" className="select select--dark" required>
              <option value="">Pilih severity...</option>
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🟠 High</option>
              <option value="CRITICAL">🔴 Critical</option>
            </select>
            <input id="incident-location" name="location" type="text" className="input input--dark" placeholder="Lokasi insiden" />
            <textarea id="incident-description" name="description" className="textarea textarea--dark" rows={3} placeholder="Deskripsi insiden..." required />
            <button type="submit" className="btn btn-danger btn-full" id="btn-report-incident">
              🚨 Kirim Laporan
            </button>
          </form>
        </section>

        {/* Live Incidents Feed */}
        <section className="warroom-widget">
          <h2>📡 Live Incidents</h2>
          <div className="incidents-feed" id="incidents-feed">
            <p className="placeholder-text">Belum ada insiden dilaporkan.</p>
          </div>
        </section>

        {/* Division Status */}
        <section className="warroom-widget">
          <h2>👥 Status Divisi</h2>
          <div className="division-status-list" id="warroom-division-status">
            <p className="placeholder-text">Memuat status divisi...</p>
          </div>
        </section>

        {/* Critical Tasks */}
        <section className="warroom-widget">
          <h2>⚡ Task Kritis H-0</h2>
          <div className="critical-tasks-list" id="warroom-critical-tasks">
            <p className="placeholder-text">Memuat task...</p>
          </div>
        </section>

        {/* Quick Chat */}
        <section className="warroom-widget warroom-widget--chat">
          <h2>💬 Command Chat</h2>
          <div className="warroom-chat-messages" id="warroom-chat" />
          <div className="warroom-chat-input">
            <input id="warroom-chat-input" type="text" className="input input--dark" placeholder="Kirim pesan cepat..." />
            <button className="btn btn-primary btn-sm" id="btn-warroom-send">→</button>
          </div>
        </section>
      </div>
    </div>
  );
}
