"use client";

import Image from "next/image";
import Link from "next/link";
import { AtSign, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        padding: "48px 24px 32px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top row: Logo + Social Links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
          }}
        >
          {/* Original Logo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Image
              src="/logo.png"
              alt="donau LIFE Coffeeshop"
              width={220}
              height={44}
              style={{
                width: "clamp(160px, 20vw, 220px)",
                height: "auto",
                filter: "brightness(0) invert(1)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                paddingLeft: "1px",
              }}
            >
              coffeeshop
            </span>
          </div>

          {/* Social Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href="https://www.instagram.com/donaulifecoffeeshop/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--tx2)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              <AtSign size={16} /> @donaulifecoffeeshop
            </a>
            <a
              href="https://www.instagram.com/donaulife/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--tx2)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              <AtSign size={16} /> @donaulife
            </a>
            <a
              href="https://www.donaulife.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--tx2)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              <Globe size={16} /> www.donaulife.com
            </a>
          </div>
        </div>

        {/* Bottom row: Copyright + Legal links */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Logo klein + Copyright */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <Image
              src="/logo.png"
              alt="donau LIFE"
              width={100}
              height={20}
              style={{
                width: "100px",
                height: "auto",
                filter: "brightness(0) invert(1)",
                opacity: 0.55,
              }}
            />
            <p style={{ color: "var(--tx2)", fontSize: "12px", margin: 0 }}>
              {t("footer_copy")}
            </p>
          </div>

          {/* Right: Impressum + Datenschutz */}
          <div style={{ display: "flex", gap: "16px" }}>
            <Link
              href="/impressum"
              style={{ color: "var(--tx2)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              {t("footer_impressum")}
            </Link>
            <Link
              href="/datenschutz"
              style={{ color: "var(--tx2)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              {t("footer_datenschutz")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
