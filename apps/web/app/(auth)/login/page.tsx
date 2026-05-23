// PAGE 02 — Authentication: Login
// Route: /auth/login · Akses: Public
// Post-Login Redirect:
//   - Belum onboarding → /onboarding
//   - Sudah onboarding → /dashboard

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Masuk — EvOS",
  description: "Masuk ke akun EvOS Anda.",
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="logo-text">
            EvOS
          </Link>
          <h1>Selamat Datang Kembali</h1>
          <p>Masuk ke akun Anda untuk melanjutkan.</p>
        </div>

        <form className="auth-form" action="/api/auth/login" method="POST">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@organisasi.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
              <Link href="/auth/forgot-password" className="form-link-inline">
                Lupa password?
              </Link>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Masuk
          </button>
        </form>

        <div className="auth-divider">
          <span>atau</span>
        </div>

        <button className="btn btn-outline btn-full btn-google" id="btn-google-login">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Masuk dengan Google
        </button>

        <p className="auth-footer">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="auth-link">
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
