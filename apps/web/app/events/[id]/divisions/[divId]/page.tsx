// PAGE 08-12 — Division Workspace (Task Board, KPI, AI Advisor, Files, Members)
// Route: /events/[id]/divisions/[divId]
// Akses: Division Head (full), Core Member, PM (full)
// Tabs: Tasks | KPI | AI Advisor | Files | Members

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Division Workspace — EvOS",
};

export default function DivisionWorkspacePage({
  params,
  searchParams,
}: {
  params: { id: string; divId: string };
  searchParams: { tab?: string };
}) {
  const activeTab = searchParams.tab ?? "tasks";

  return (
    <div className="division-workspace">
      <header className="page-header">
        <div>
          <a href={`/events/${params.id}`} className="btn-back">← Command Center</a>
          <h1 id="division-name">Nama Divisi</h1>
          <p className="page-subtitle" id="division-description">Deskripsi divisi</p>
        </div>
        <div className="division-header-actions">
          <span className="workload-badge" id="division-workload">Workload: —%</span>
        </div>
      </header>

      {/* Workspace Tabs */}
      <nav className="workspace-tabs">
        {WORKSPACE_TABS.map((tab) => (
          <a
            key={tab.value}
            href={`/events/${params.id}/divisions/${params.divId}?tab=${tab.value}`}
            className={`workspace-tab ${activeTab === tab.value ? "active" : ""}`}
            id={`ws-tab-${tab.value}`}
          >
            {tab.icon} {tab.label}
          </a>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="workspace-content">

        {/* TASKS TAB — Kanban Board */}
        {activeTab === "tasks" && (
          <section className="kanban-board" id="kanban-board">
            {KANBAN_COLUMNS.map((col) => (
              <div key={col.status} className="kanban-column">
                <div className="kanban-column-header">
                  <span>{col.label}</span>
                  <span className="column-count" id={`col-count-${col.status}`}>0</span>
                </div>
                <div className="kanban-cards" id={`kanban-col-${col.status}`} data-status={col.status}>
                  {/* Task cards rendered dynamically */}
                </div>
                <button className="btn-add-task" id={`btn-add-task-${col.status}`}>+ Tambah Task</button>
              </div>
            ))}
          </section>
        )}

        {/* KPI TAB */}
        {activeTab === "kpi" && (
          <section className="kpi-tracker" id="kpi-tracker">
            <div className="section-header">
              <h2>KPI Tracker</h2>
              <button className="btn btn-primary btn-sm" id="btn-add-kpi">+ KPI Baru</button>
            </div>
            <div className="kpi-list" id="kpi-list">
              <p className="placeholder-text">Belum ada KPI. Tambah atau tunggu AI generate.</p>
            </div>
          </section>
        )}

        {/* AI ADVISOR TAB */}
        {activeTab === "ai" && (
          <section className="ai-advisor" id="ai-advisor">
            <div className="ai-advisor-header">
              <h2>🧠 AI Advisor</h2>
              <p>Asisten kontekstual berdasarkan SOP organisasi dan status event saat ini.</p>
            </div>
            <div className="ai-chat-window" id="ai-chat-window">
              <div className="ai-messages" id="ai-messages" />
              <div className="ai-input-bar">
                <input
                  id="ai-input"
                  type="text"
                  placeholder="Tanya AI Advisor..."
                  className="ai-input"
                />
                <button className="btn btn-primary" id="btn-ai-send">Kirim</button>
              </div>
            </div>
          </section>
        )}

        {/* FILES TAB */}
        {activeTab === "files" && (
          <section className="file-repository" id="file-repository">
            <div className="section-header">
              <h2>File Repository</h2>
              <button className="btn btn-primary btn-sm" id="btn-upload-file">+ Upload File</button>
            </div>
            <div className="file-list" id="file-list">
              <p className="placeholder-text">Belum ada file. Upload file pertama Anda.</p>
            </div>
          </section>
        )}

        {/* MEMBERS TAB */}
        {activeTab === "members" && (
          <section className="member-directory" id="member-directory">
            <div className="section-header">
              <h2>Member Divisi</h2>
              <button className="btn btn-primary btn-sm" id="btn-invite-member">+ Invite Member</button>
            </div>
            <div className="member-grid" id="member-grid">
              <p className="placeholder-text">Memuat daftar member...</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const WORKSPACE_TABS = [
  { value: "tasks", icon: "✅", label: "Tasks" },
  { value: "kpi", icon: "📈", label: "KPI" },
  { value: "ai", icon: "🧠", label: "AI Advisor" },
  { value: "files", icon: "📁", label: "Files" },
  { value: "members", icon: "👥", label: "Members" },
];

const KANBAN_COLUMNS = [
  { status: "BACKLOG", label: "Backlog" },
  { status: "BLOCKED", label: "🚫 Blocked" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "IN_REVIEW", label: "In Review" },
  { status: "DONE", label: "✅ Done" },
];
