// PAGE 21 — Organization Settings & Billing
// Route: /org/settings · Akses: Super Admin saja
// Tabs: Profile | Members | Integrations | Billing | Security

import { Metadata } from "next";

export const metadata: Metadata = { title: "Pengaturan Organisasi — EvOS" };

export default function OrgSettingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const activeTab = searchParams.tab ?? "profile";

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>⚙️ Pengaturan Organisasi</h1>
      </header>

      <nav className="settings-tabs">
        {SETTINGS_TABS.map((tab) => (
          <a
            key={tab.value}
            href={`/org/settings?tab=${tab.value}`}
            className={`settings-tab ${activeTab === tab.value ? "active" : ""}`}
            id={`settings-tab-${tab.value}`}
          >
            {tab.icon} {tab.label}
          </a>
        ))}
      </nav>

      <div className="settings-content">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section id="settings-profile">
            <h2>Profil Organisasi</h2>
            <form className="settings-form" id="org-profile-form">
              <div className="form-group">
                <label htmlFor="org-name">Nama Organisasi</label>
                <input id="org-name" name="name" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="org-type">Tipe Organisasi</label>
                <select id="org-type" name="type">
                  <option value="KAMPUS">Kampus / Organisasi Mahasiswa</option>
                  <option value="EO_PROFESIONAL">EO Profesional</option>
                  <option value="KORPORAT">Korporat</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="org-logo">Logo Organisasi</label>
                <input id="org-logo" name="logo" type="file" accept="image/*" />
              </div>
              <div className="form-group">
                <label htmlFor="org-description">Deskripsi</label>
                <textarea id="org-description" name="description" rows={3} />
              </div>
              <div className="form-group">
                <label htmlFor="org-sop">Upload SOP (PDF/DOCX)</label>
                <input id="org-sop" name="sop" type="file" accept=".pdf,.docx,.doc" />
              </div>
              <button type="submit" className="btn btn-primary" id="btn-save-org-profile">Simpan Perubahan</button>
            </form>
          </section>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <section id="settings-members">
            <div className="section-header">
              <h2>Member Organisasi</h2>
              <button className="btn btn-primary btn-sm" id="btn-invite-org-member">+ Invite Member</button>
            </div>
            <table className="data-table" id="org-members-table">
              <thead>
                <tr>
                  <th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody id="org-members-table-body">
                <tr><td colSpan={5} className="placeholder-text">Memuat member...</td></tr>
              </tbody>
            </table>
          </section>
        )}

        {/* Integrations Tab */}
        {activeTab === "integrations" && (
          <section id="settings-integrations">
            <h2>Integrasi</h2>
            <p className="section-desc">Integrasi tersedia di V1: Google Calendar, WhatsApp Business API, Google Drive.</p>
            <div className="integrations-list">
              {[
                { id: "google-calendar", name: "Google Calendar", icon: "📅" },
                { id: "whatsapp", name: "WhatsApp Business API", icon: "💬" },
                { id: "google-drive", name: "Google Drive", icon: "📁" },
              ].map((integration) => (
                <div key={integration.id} className="integration-card">
                  <span className="integration-icon">{integration.icon}</span>
                  <span className="integration-name">{integration.name}</span>
                  <button className="btn btn-outline btn-sm" id={`btn-connect-${integration.id}`}>
                    Hubungkan
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <section id="settings-billing">
            <h2>Langganan & Billing</h2>
            <div className="current-plan">
              <span className="plan-badge" id="current-plan-badge">FREE</span>
              <p>Anda saat ini menggunakan paket <strong id="current-plan-name">Free</strong>.</p>
            </div>
            <div className="pricing-tiers">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.name} className={`pricing-card ${tier.featured ? "pricing-card--featured" : ""}`}>
                  <h3>{tier.name}</h3>
                  <p className="pricing-price">{tier.price}</p>
                  <ul className="pricing-features">
                    {tier.features.map((f) => <li key={f}>✓ {f}</li>)}
                  </ul>
                  <button className="btn btn-primary" id={`btn-upgrade-${tier.name.toLowerCase()}`}>
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <section id="settings-security">
            <h2>Keamanan</h2>
            <div className="security-options">
              <div className="security-item">
                <div>
                  <strong>Two-Factor Authentication (2FA)</strong>
                  <p>Tambahkan lapisan keamanan ekstra ke akun Anda.</p>
                </div>
                <button className="btn btn-outline btn-sm" id="btn-enable-2fa">Aktifkan 2FA</button>
              </div>
              <div className="security-item">
                <div>
                  <strong>Data Export</strong>
                  <p>Download semua data event dalam format JSON/CSV.</p>
                </div>
                <button className="btn btn-outline btn-sm" id="btn-export-data">Export Data</button>
              </div>
              <div className="security-item security-item--danger">
                <div>
                  <strong>Hapus Akun</strong>
                  <p>Menghapus semua data organisasi secara permanen.</p>
                </div>
                <button className="btn btn-danger btn-sm" id="btn-delete-org">Hapus Organisasi</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const SETTINGS_TABS = [
  { value: "profile", icon: "🏢", label: "Profil" },
  { value: "members", icon: "👥", label: "Member" },
  { value: "integrations", icon: "🔗", label: "Integrasi" },
  { value: "billing", icon: "💳", label: "Billing" },
  { value: "security", icon: "🔒", label: "Keamanan" },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: "Rp 0 / bulan",
    featured: false,
    cta: "Paket Saat Ini",
    features: ["1 event aktif", "5 member", "Basic AI features"],
  },
  {
    name: "Pro",
    price: "Rp 299.000 / bulan",
    featured: true,
    cta: "Upgrade ke Pro",
    features: ["10 event aktif", "50 member", "Full AI suite", "Sponsor CRM"],
  },
  {
    name: "Business",
    price: "Rp 799.000 / bulan",
    featured: false,
    cta: "Upgrade ke Business",
    features: ["Unlimited event", "Unlimited member", "Org Memory Engine", "Priority support"],
  },
];
