// PAGE 14 — Meeting Scheduler & AI Summarizer
// Route: /events/[id]/meetings · Akses: PM (host), Division Head, Core Member

import { Metadata } from "next";

export const metadata: Metadata = { title: "Meetings — EvOS" };

export default function MeetingsPage({ params }: { params: { id: string } }) {
  return (
    <div className="meetings-page">
      <header className="page-header">
        <h1>📅 Meetings</h1>
        <button className="btn btn-primary" id="btn-schedule-meeting">
          + Jadwalkan Meeting
        </button>
      </header>

      {/* Upcoming Meetings */}
      <section className="section">
        <h2>Upcoming</h2>
        <div className="meetings-list" id="upcoming-meetings">
          <p className="placeholder-text">Tidak ada meeting terjadwal.</p>
        </div>
      </section>

      {/* Past Meetings with AI Summaries */}
      <section className="section">
        <h2>Selesai — dengan AI Summary</h2>
        <div className="meetings-list" id="past-meetings">
          <p className="placeholder-text">Belum ada meeting selesai.</p>
        </div>
      </section>

      {/* Meeting Modal (hidden by default) */}
      <dialog className="modal" id="meeting-modal">
        <div className="modal-header">
          <h2>Jadwalkan Meeting</h2>
          <button className="btn-close" id="btn-close-meeting-modal">✕</button>
        </div>
        <form className="modal-form" id="meeting-form">
          <div className="form-group">
            <label htmlFor="meeting-title">Judul Meeting</label>
            <input id="meeting-title" name="title" type="text" required placeholder="Daily Standup, Sprint Review, dll." />
          </div>
          <div className="form-group">
            <label htmlFor="meeting-datetime">Tanggal & Waktu</label>
            <input id="meeting-datetime" name="scheduled_at" type="datetime-local" required />
          </div>
          <div className="form-group">
            <label htmlFor="meeting-link">Link Video Call (opsional)</label>
            <input id="meeting-link" name="meeting_url" type="url" placeholder="https://meet.google.com/..." />
          </div>
          <div className="form-group">
            <label htmlFor="meeting-agenda">Agenda</label>
            <textarea id="meeting-agenda" name="agenda" rows={4} placeholder="Tulis agenda meeting..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" id="btn-cancel-meeting">Batal</button>
            <button type="submit" className="btn btn-primary">Simpan</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
