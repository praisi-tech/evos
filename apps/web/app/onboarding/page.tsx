// PAGE 03 — Organization Setup Wizard
// Route: /onboarding · Akses: Super Admin (user baru)
// 4-step wizard wajib selesai sebelum buat event
// Step 1: Buat/Bergabung Org
// Step 2: Upload logo, isi profil org
// Step 3: Upload SOP (opsional)
// Step 4: Invite admin tambahan

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Organisasi — EvOS",
  description: "Selesaikan setup organisasi Anda untuk mulai menggunakan EvOS.",
};

export default function OnboardingPage() {
  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <span className="logo-text">EvOS</span>
        <p>Setup Organisasi</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {["Buat Organisasi", "Profil Org", "Upload SOP", "Invite Tim"].map(
          (step, i) => (
            <div key={step} className="step-item" data-step={i + 1}>
              <div className="step-circle">{i + 1}</div>
              <span className="step-label">{step}</span>
            </div>
          )
        )}
      </div>

      {/* Step Content — rendered by client component */}
      <div className="onboarding-content">
        {/* Step 1: Create or Join Org */}
        <section className="onboarding-step" id="step-1">
          <h1>Buat atau Bergabung ke Organisasi</h1>
          <p>Setiap event dikelola dalam konteks sebuah organisasi.</p>

          <div className="org-choice-grid">
            <button className="choice-card" id="btn-create-org">
              <span className="choice-icon">🏢</span>
              <strong>Buat Organisasi Baru</strong>
              <span>Saya ingin mendirikan org baru di EvOS</span>
            </button>
            <button className="choice-card" id="btn-join-org">
              <span className="choice-icon">🔗</span>
              <strong>Bergabung dengan Kode Undangan</strong>
              <span>Saya punya kode dari admin organisasi</span>
            </button>
          </div>
        </section>
      </div>

      <div className="onboarding-footer">
        <button className="btn btn-ghost" id="btn-prev-step" disabled>Kembali</button>
        <button className="btn btn-primary" id="btn-next-step">Lanjut</button>
      </div>
    </div>
  );
}
