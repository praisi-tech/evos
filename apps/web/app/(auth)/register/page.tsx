// PAGE 02 — Authentication: Register
// Route: /auth/register · Akses: Public

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar — EvOS",
  description: "Buat akun EvOS gratis dan mulai kelola event Anda dengan AI.",
};

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="logo-text">EvOS</Link>
          <h1>Buat Akun Baru</h1>
          <p>Gratis selamanya untuk tim kecil.</p>
        </div>

        <form className="auth-form" action="/api/auth/register" method="POST">
          <div className="form-group">
            <label htmlFor="full_name">Nama Lengkap</label>
            <input id="full_name" name="full_name" type="text" placeholder="Nama Anda" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="nama@organisasi.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Min. 8 karakter" required autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Buat Akun
          </button>
        </form>

        <div className="auth-divider"><span>atau</span></div>
        <button className="btn btn-outline btn-full btn-google" id="btn-google-register">
          Daftar dengan Google
        </button>

        <p className="auth-footer">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="auth-link">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
