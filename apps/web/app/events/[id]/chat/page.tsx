// PAGE 13 — Chat System (Event & Division Rooms)
// Route: /events/[id]/chat · Akses: Semua role (filtered per room)
// At-rest encryption. Pesan tersimpan & bisa dicari. Mention task/KPI/member dari chat.

import { Metadata } from "next";

export const metadata: Metadata = { title: "Chat — EvOS" };

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="chat-page">
      {/* Room Sidebar */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Chat Rooms</h2>
        </div>
        <div className="chat-rooms-list" id="chat-rooms-list">
          <div className="room-group">
            <span className="room-group-label">EVENT ROOMS</span>
            <button className="room-item active" id="room-general">
              # general
            </button>
            <button className="room-item" id="room-announcements">
              📢 announcements
            </button>
          </div>
          <div className="room-group">
            <span className="room-group-label">DIVISION ROOMS</span>
            {/* Division rooms rendered dynamically */}
            <p className="placeholder-text">Memuat divisi...</p>
          </div>
          <div className="room-group">
            <span className="room-group-label">DIRECT MESSAGES</span>
            <button className="room-item" id="btn-new-dm">+ New DM</button>
          </div>
        </div>
      </aside>

      {/* Chat Main Area */}
      <main className="chat-main">
        <div className="chat-header">
          <span className="chat-room-name" id="active-room-name"># general</span>
          <span className="chat-room-desc" id="active-room-desc">Diskusi umum event</span>
        </div>

        <div className="chat-messages" id="chat-messages">
          {/* Messages rendered dynamically via WebSocket */}
          <p className="placeholder-text">Belum ada pesan. Mulai percakapan!</p>
        </div>

        <div className="chat-input-bar">
          <button className="btn-attach" id="btn-attach-file" title="Lampirkan file">📎</button>
          <input
            id="chat-input"
            type="text"
            placeholder="Tulis pesan... Ketik @ untuk mention, # untuk task"
            className="chat-input"
          />
          <button className="btn btn-primary" id="btn-send-message">Kirim</button>
        </div>
      </main>
    </div>
  );
}
