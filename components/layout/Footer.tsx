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
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <Image src="/logo.svg" alt="Donaulife Coffeeshop" width={160} height={32} style={{ height: "32px", width: "auto" }} />
            <div
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: "9px",
                color: "var(--tx2)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                paddingLeft: "1px",
              }}
            >
              coffeeshop
            </div>
          </div>

          {/* Social Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href="https://www.instagram.com/donaulifecoffeeshop/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--tx2)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              <AtSign size={16} /> @donaulifecoffeeshop
            </a>
            <a
              href="https://www.instagram.com/donaulife/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--tx2)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              <AtSign size={16} /> @donaulife
            </a>
            <a
              href="https://www.donaulife.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--tx2)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx2)")}
            >
              <Globe size={16} /> www.donaulife.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "var(--tx2)", fontSize: "13px", margin: 0 }}>
            {t("footer_copy")}
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link
              href="/impressum"
              style={{ color: "var(--tx2)", fontSize: "13px", textDecoration: "none" }}
            >
              {t("footer_impressum")}
            </Link>
            <Link
              href="/datenschutz"
              style={{ color: "var(--tx2)", fontSize: "13px", textDecoration: "none" }}
            >
              {t("footer_datenschutz")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
