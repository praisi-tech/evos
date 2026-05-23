// PAGE 01 — Landing Page
// Route: / · Akses: Public (belum login)
// Tujuan: Konversi pengunjung menjadi user terdaftar

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EvOS — Event Operating System | AI-Powered Event Intelligence",
  description:
    "Revolusi cara organisasi mengelola event. Dari perencanaan hingga post-event analytics — semua dalam satu platform bertenaga AI.",
};

export default function LandingPage() {
  return (
    <main className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-text">EvOS</span>
        </div>
        <div className="navbar-actions">
          <Link href="/auth/login" className="btn btn-ghost">
            Masuk
          </Link>
          <Link href="/auth/register" className="btn btn-primary">
            Mulai Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Event Intelligence</div>
          <h1 className="hero-title">
            Satu Platform untuk Seluruh Lifecycle Event Anda
          </h1>
          <p className="hero-subtitle">
            EvOS menggantikan spreadsheet, grup chat berantakan, dan alat
            terpisah dengan sistem operasional terintegrasi bertenaga AI.
          </p>
          <div className="hero-cta">
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              Coba Gratis Sekarang
            </Link>
            <Link href="#features" className="btn btn-outline btn-lg">
              Lihat Fitur
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Fitur Utama EvOS</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Siap merevolusi cara Anda mengorganisir event?</h2>
        <Link href="/auth/register" className="btn btn-primary btn-lg">
          Daftar Sekarang — Gratis
        </Link>
      </section>
    </main>
  );
}

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Event Setup",
    description:
      "Generate struktur divisi, timeline, KPI, dan risk matrix secara otomatis.",
  },
  {
    icon: "📊",
    title: "Dynamic Health Score",
    description:
      "Pantau kesehatan event real-time. Threshold kritis di bawah 60.",
  },
  {
    icon: "🗺️",
    title: "Critical Path Engine",
    description:
      "Visualisasi dependency antar task dan simulasi dampak keterlambatan.",
  },
  {
    icon: "⚠️",
    title: "Risk Escalation Protocol",
    description:
      "Setiap risiko terdeteksi memicu escalation chain otomatis yang proporsional.",
  },
  {
    icon: "💬",
    title: "Integrated Chat",
    description:
      "Room per-event dan per-divisi dengan enkripsi at-rest. Mention task langsung dari chat.",
  },
  {
    icon: "🏢",
    title: "War Room Mode",
    description:
      "Interface command center yang auto-aktif di hari H. Optimized untuk kecepatan.",
  },
  {
    icon: "🎓",
    title: "Org Memory Engine",
    description:
      "Platform belajar dari setiap event. AI semakin akurat seiring waktu.",
  },
  {
    icon: "📋",
    title: "Sponsor CRM",
    description: "Data-driven relationship management untuk semua sponsor Anda.",
  },
];
