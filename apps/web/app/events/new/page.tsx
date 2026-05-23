// PAGE 06 — Event Setup Wizard (AI Generation) ⭐ Core Feature
// Route: /events/new · Akses: Super Admin, PM
// 8-step wizard: nama → tipe → tanggal → venue → peserta → budget → konfirmasi → AI generate

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Event Baru — EvOS",
  description: "Setup event baru dan biarkan AI generate struktur lengkapnya untuk Anda.",
};

export default function NewEventPage() {
  return (
    <div className="wizard-page">
      <div className="wizard-header">
        <a href="/events" className="btn-back">← Kembali ke Event</a>
        <h1>Buat Event Baru</h1>
        <p>AI akan generate struktur divisi, timeline, KPI, dan risk matrix secara otomatis.</p>
      </div>

      {/* Wizard Step Indicator — 8 Steps */}
      <div className="wizard-steps">
        {WIZARD_STEPS.map((step, i) => (
          <div key={step} className="wizard-step-item" data-step={i + 1}>
            <div className="wizard-step-circle">{i + 1}</div>
            <span className="wizard-step-label">{step}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Nama & Tipe Event */}
      <div className="wizard-body">
        <section className="wizard-step active" id="wizard-step-1">
          <h2>Nama & Tipe Event</h2>
          <div className="form-group">
            <label htmlFor="event-name">Nama Event</label>
            <input id="event-name" name="name" type="text" placeholder="cth: Tech Summit 2025" required />
          </div>
          <div className="form-group">
            <label>Tipe Event</label>
            <div className="event-type-grid">
              {EVENT_TYPES.map((t) => (
                <button key={t.value} className="event-type-card" data-value={t.value} id={`event-type-${t.value.toLowerCase()}`}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Step 2: Tanggal */}
        <section className="wizard-step" id="wizard-step-2">
          <h2>Tanggal Event</h2>
          <div className="form-group">
            <label htmlFor="event-date">Tanggal Pelaksanaan</label>
            <input id="event-date" name="event_date" type="date" required />
          </div>
        </section>

        {/* Step 3: Venue */}
        <section className="wizard-step" id="wizard-step-3">
          <h2>Venue</h2>
          <div className="form-group">
            <label htmlFor="venue-type">Tipe Venue</label>
            <select id="venue-type" name="venue_type">
              <option value="INDOOR">Indoor</option>
              <option value="OUTDOOR">Outdoor</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="venue-city">Kota</label>
            <input id="venue-city" name="city" type="text" placeholder="Jakarta" />
          </div>
          <div className="form-group">
            <label htmlFor="venue-name">Nama Venue (opsional)</label>
            <input id="venue-name" name="venue_name" type="text" placeholder="Balai Sidang, GBK, dll." />
          </div>
        </section>

        {/* Step 4: Estimasi Peserta */}
        <section className="wizard-step" id="wizard-step-4">
          <h2>Estimasi Peserta</h2>
          <div className="form-group">
            <label htmlFor="attendee-range">Estimasi Jumlah Peserta</label>
            <select id="attendee-range" name="estimated_attendees">
              <option value="BELOW_100">Di bawah 100</option>
              <option value="100_500">100 – 500</option>
              <option value="500_1000">500 – 1.000</option>
              <option value="1000_5000">1.000 – 5.000</option>
              <option value="ABOVE_5000">Di atas 5.000</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ticket-format">Format Tiket</label>
            <select id="ticket-format" name="ticket_format">
              <option value="FREE">Gratis</option>
              <option value="PAID">Berbayar</option>
              <option value="INVITATION">Undangan</option>
            </select>
          </div>
        </section>

        {/* Step 5: Budget */}
        <section className="wizard-step" id="wizard-step-5">
          <h2>Estimasi Budget</h2>
          <div className="form-group">
            <label htmlFor="budget-estimate">Total Budget (IDR)</label>
            <input id="budget-estimate" name="budget_estimate" type="number" placeholder="50000000" min={0} />
          </div>
          <div className="form-group">
            <label htmlFor="budget-source">Sumber Dana</label>
            <select id="budget-source" name="budget_source">
              <option value="SELF_FUNDED">Dana Sendiri / Iuran</option>
              <option value="SPONSORSHIP">Sponsorship</option>
              <option value="TICKET_SALES">Penjualan Tiket</option>
              <option value="MIXED">Campuran</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="target-sponsorship">Target Sponsorship (IDR)</label>
            <input id="target-sponsorship" name="target_sponsorship" type="number" placeholder="0" min={0} />
          </div>
        </section>

        {/* Step 6: Konfirmasi */}
        <section className="wizard-step" id="wizard-step-6">
          <h2>Review & Konfirmasi</h2>
          <div className="review-panel" id="review-summary">
            {/* Populated dynamically */}
            <p className="placeholder-text">Ringkasan event akan tampil di sini.</p>
          </div>
        </section>

        {/* Step 7: AI Generation Loading */}
        <section className="wizard-step" id="wizard-step-7">
          <div className="ai-generating">
            <div className="ai-spinner" aria-label="AI sedang memproses" />
            <h2>AI Sedang Generate Struktur Event...</h2>
            <ul className="ai-progress-list" id="ai-progress-list">
              <li id="ai-step-divisions">🔄 Membuat struktur divisi...</li>
              <li id="ai-step-timeline">⏳ Generate timeline & milestones...</li>
              <li id="ai-step-kpi">⏳ Menyusun KPI per divisi...</li>
              <li id="ai-step-risk">⏳ Analisis risk matrix...</li>
              <li id="ai-step-dependency">⏳ Mapping dependency graph...</li>
            </ul>
          </div>
        </section>

        {/* Step 8: Review AI Output */}
        <section className="wizard-step" id="wizard-step-8">
          <h2>Review Rekomendasi AI</h2>
          <p>Review dan edit rekomendasi AI sebelum mengaktifkan event.</p>
          <div className="ai-output-tabs">
            <button className="tab-btn active" data-tab="divisions">Divisi</button>
            <button className="tab-btn" data-tab="timeline">Timeline</button>
            <button className="tab-btn" data-tab="kpi">KPI</button>
            <button className="tab-btn" data-tab="risks">Risiko</button>
          </div>
          <div className="ai-output-content" id="ai-output-content">
            <p className="placeholder-text">Output AI akan tampil di sini.</p>
          </div>
        </section>
      </div>

      {/* Wizard Navigation */}
      <div className="wizard-footer">
        <button className="btn btn-ghost" id="btn-wizard-prev" disabled>Kembali</button>
        <div className="step-counter" id="step-counter">Langkah 1 dari 8</div>
        <button className="btn btn-primary" id="btn-wizard-next">Lanjut</button>
      </div>
    </div>
  );
}

const WIZARD_STEPS = [
  "Nama & Tipe", "Tanggal", "Venue", "Peserta",
  "Budget", "Konfirmasi", "AI Generate", "Review",
];

const EVENT_TYPES = [
  { value: "CONCERT", icon: "🎵", label: "Concert" },
  { value: "CONFERENCE", icon: "🎤", label: "Conference" },
  { value: "CAMPUS", icon: "🎓", label: "Campus" },
  { value: "CORPORATE", icon: "🏢", label: "Corporate" },
  { value: "FESTIVAL", icon: "🎪", label: "Festival" },
  { value: "SEMINAR", icon: "📚", label: "Seminar" },
  { value: "OTHER", icon: "✨", label: "Other" },
];
