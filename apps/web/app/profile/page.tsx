// PAGE 22 — Profile & Notification Settings
// Route: /profile · Akses: Semua role

import { Metadata } from "next";

export const metadata: Metadata = { title: "Profil Saya — EvOS" };

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>👤 Profil Saya</h1>
      </header>

      <div className="profile-layout">
        {/* Profile Form */}
        <section className="profile-section">
          <h2>Informasi Pribadi</h2>
          <form className="settings-form" id="profile-form">
            <div className="avatar-upload">
              <div className="avatar" id="avatar-preview" />
              <button type="button" className="btn btn-outline btn-sm" id="btn-change-avatar">
                Ganti Foto
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="profile-name">Nama Lengkap</label>
              <input id="profile-name" name="full_name" type="text" required />
            </div>
            <div className="form-group">
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" name="email" type="email" disabled />
            </div>
            <div className="form-group">
              <label htmlFor="profile-whatsapp">WhatsApp</label>
              <input id="profile-whatsapp" name="whatsapp" type="tel" placeholder="+628xxxxxxxxxx" />
            </div>
            <div className="form-group">
              <label htmlFor="profile-bio">Bio</label>
              <textarea id="profile-bio" name="bio" rows={3} placeholder="Ceritakan sedikit tentang diri Anda..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profile-language">Bahasa</label>
                <select id="profile-language" name="language">
                  <option value="ID">Indonesia</option>
                  <option value="EN">English</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="profile-theme">Tema</label>
                <select id="profile-theme" name="theme">
                  <option value="SYSTEM">Sistem</option>
                  <option value="LIGHT">Light</option>
                  <option value="DARK">Dark</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" id="btn-save-profile">Simpan</button>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="profile-section">
          <h2>🔔 Preferensi Notifikasi</h2>
          <div className="notification-preferences" id="notification-preferences">
            {NOTIFICATION_TYPES.map((n) => (
              <div key={n.id} className="notification-item">
                <div>
                  <strong>{n.label}</strong>
                  <p>{n.description}</p>
                </div>
                <div className="notification-channels">
                  <label className="toggle-label">
                    <input type="checkbox" id={`notif-inapp-${n.id}`} name={`inapp_${n.id}`} defaultChecked />
                    In-App
                  </label>
                  <label className="toggle-label">
                    <input type="checkbox" id={`notif-push-${n.id}`} name={`push_${n.id}`} />
                    Push
                  </label>
                  <label className="toggle-label">
                    <input type="checkbox" id={`notif-wa-${n.id}`} name={`wa_${n.id}`} />
                    WhatsApp
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="profile-section">
          <h2>🔒 Keamanan</h2>
          <div className="security-actions">
            <button className="btn btn-outline" id="btn-change-password">Ganti Password</button>
            <button className="btn btn-outline" id="btn-setup-2fa">Setup 2FA (TOTP)</button>
            <button className="btn btn-danger-outline" id="btn-delete-account">Hapus Akun</button>
          </div>
        </section>
      </div>
    </div>
  );
}

const NOTIFICATION_TYPES = [
  { id: "task_deadline", label: "Deadline Task", description: "Pengingat H-7, H-3, H-1 dari deadline." },
  { id: "task_assigned", label: "Task Ditugaskan", description: "Notifikasi saat task baru di-assign ke Anda." },
  { id: "risk_escalation", label: "Eskalasi Risiko", description: "Alert ketika risiko di-escalate ke level Anda." },
  { id: "health_score_drop", label: "Health Score Drop", description: "Alert ketika health score turun di bawah 60." },
  { id: "mention", label: "Mention di Chat", description: "Ketika seseorang @mention Anda di chat." },
  { id: "war_room_activated", label: "War Room Aktif", description: "Ketika War Room Mode diaktifkan." },
  { id: "post_event_ready", label: "Post-Event Report", description: "Ketika laporan post-event siap dibaca." },
];
