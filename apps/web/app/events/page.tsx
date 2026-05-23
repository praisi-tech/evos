// PAGE 05 — Event List
// Route: /events · Akses: Super Admin, PM (write); Division Head, Core Member (read)

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Semua Event — EvOS",
  description: "Kelola semua event organisasi Anda.",
};

export default function EventsPage() {
  return (
    <div className="events-page">
      <header className="page-header">
        <div>
          <h1>Event</h1>
          <p className="page-subtitle">Semua event dalam organisasi Anda</p>
        </div>
        <Link href="/events/new" className="btn btn-primary" id="btn-new-event">
          + Buat Event Baru
        </Link>
      </header>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="search"
          id="event-search"
          placeholder="Cari event..."
          className="input-search"
        />
        <select id="event-status-filter" className="select">
          <option value="">Semua Status</option>
          <option value="PLANNING">Planning</option>
          <option value="STRATEGIC">Strategic</option>
          <option value="TACTICAL">Tactical</option>
          <option value="EXECUTION">Execution</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select id="event-type-filter" className="select">
          <option value="">Semua Tipe</option>
          <option value="CONCERT">Concert</option>
          <option value="CONFERENCE">Conference</option>
          <option value="CAMPUS">Campus</option>
          <option value="CORPORATE">Corporate</option>
          <option value="FESTIVAL">Festival</option>
          <option value="SEMINAR">Seminar</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="events-grid" id="events-grid">
        <div className="empty-state">
          <span>Belum ada event.</span>
          <Link href="/events/new" className="btn btn-primary btn-sm">
            Buat Event Pertama
          </Link>
        </div>
      </div>
    </div>
  );
}
