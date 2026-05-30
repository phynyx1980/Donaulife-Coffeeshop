"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/verify").then((r) => {
      if (r.ok) router.replace("/admin/dashboard");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "40px 36px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Image
            src="/logo.png"
            alt="donau LIFE"
            width={180}
            height={36}
            style={{ width: "180px", height: "auto", filter: "brightness(0) invert(1)", margin: "0 auto" }}
          />
          <p style={{
            fontFamily: "var(--font-syne)",
            fontSize: "10px",
            color: "var(--tx2)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: "6px",
          }}>
            Admin-Bereich
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)" }}>
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@donaulife.at"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "var(--tx)",
                fontSize: "14px",
                outline: "none",
                fontFamily: "var(--font-dm-sans)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green-bdr)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)" }}>
              PASSWORT
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "var(--tx)",
                fontSize: "14px",
                outline: "none",
                fontFamily: "var(--font-dm-sans)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green-bdr)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#f87171",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "var(--border)" : "var(--green)",
              color: loading ? "var(--tx2)" : "#080808",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              fontFamily: "var(--font-syne)",
              transition: "opacity 0.2s",
              marginTop: "4px",
            }}
          >
            {loading ? "Anmeldung läuft..." : "Anmelden"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "var(--tx2)" }}>
          <a href="/" style={{ color: "var(--tx2)", textDecoration: "none" }}>← Zurück zur Website</a>
        </p>
      </div>
    </div>
  );
}
