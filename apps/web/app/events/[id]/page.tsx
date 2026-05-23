// PAGE 07 — Event Command Center (Dashboard per Event)
// Route: /events/[id] · Akses: PM (full), Division Head (partial), Core Member (view)

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Command Center — EvOS",
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="event-detail-page">
      <header className="event-header">
        <div className="event-header-left">
          <a href="/events" className="btn-back">← Event</a>
          <div>
            <h1 id="event-name">Nama Event</h1>
            <div className="event-meta">
              <span id="event-type-badge" className="badge">—</span>
              <span id="event-date">—</span>
              <span id="event-phase" className="phase-badge">—</span>
            </div>
          </div>
        </div>
        <div className="event-header-right">
          {/* Health Score */}
          <div className="health-score-widget">
            <span className="health-score-label">Health Score</span>
            <span className="health-score-value" id="event-health-score">—</span>
            <span className="health-score-hint">/ 100</span>
          </div>
          <button className="btn btn-danger" id="btn-activate-warroom">
            🚨 War Room
          </button>
        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <nav className="event-tabs">
        {EVENT_TABS.map((tab) => (
          <a
            key={tab.href}
            href={`/events/${params.id}${tab.href}`}
            className="event-tab"
            id={`tab-${tab.id}`}
          >
            {tab.icon} {tab.label}
          </a>
        ))}
      </nav>

      {/* Main Widget Grid */}
      <div className="event-widget-grid">
        {/* Health Score Breakdown */}
        <section className="widget widget-lg">
          <h2>Health Score Breakdown</h2>
          <div id="health-score-chart" className="chart-placeholder">Chart</div>
        </section>

        {/* Critical Tasks */}
        <section className="widget">
          <h2>⚠️ Task Kritis</h2>
          <ul id="critical-tasks-list" className="task-list">
            <li className="placeholder-text">Memuat...</li>
          </ul>
        </section>

        {/* Timeline / Milestones */}
        <section className="widget widget-lg">
          <h2>Timeline & Milestones</h2>
          <div id="timeline-view" className="timeline-placeholder">Timeline</div>
        </section>

        {/* Divisions Status */}
        <section className="widget">
          <h2>Status Divisi</h2>
          <ul id="divisions-status-list" className="division-list">
            <li className="placeholder-text">Memuat...</li>
          </ul>
        </section>

        {/* Risk Summary */}
        <section className="widget">
          <h2>🔴 Risiko Aktif</h2>
          <ul id="active-risks-list" className="risk-list">
            <li className="placeholder-text">Memuat...</li>
          </ul>
        </section>

        {/* AI Insights */}
        <section className="widget">
          <h2>🧠 AI Insights</h2>
          <div id="event-ai-insights" className="ai-insights">
            <p className="placeholder-text">AI sedang menganalisis event ini...</p>
          </div>
        </section>
      </div>
    </div>
  );
}

const EVENT_TABS = [
  { id: "overview", href: "", icon: "📊", label: "Overview" },
  { id: "divisions", href: "/divisions", icon: "👥", label: "Divisi" },
  { id: "chat", href: "/chat", icon: "💬", label: "Chat" },
  { id: "meetings", href: "/meetings", icon: "📅", label: "Meetings" },
  { id: "critical-path", href: "/critical-path", icon: "🗺️", label: "Critical Path" },
  { id: "risk", href: "/risk", icon: "⚠️", label: "Risiko" },
  { id: "sponsors", href: "/sponsors", icon: "🤝", label: "Sponsor" },
  { id: "vendors", href: "/vendors", icon: "📦", label: "Vendor" },
  { id: "warroom", href: "/warroom", icon: "🚨", label: "War Room" },
  { id: "post-event", href: "/post-event", icon: "📋", label: "Post-Event" },
];
