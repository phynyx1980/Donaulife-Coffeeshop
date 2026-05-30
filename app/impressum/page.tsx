"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function Impressum() {
  const { t } = useLanguage();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        padding: "120px 24px 80px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: "var(--green)",
            textDecoration: "none",
            fontSize: "14px",
            display: "inline-block",
            marginBottom: "32px",
          }}
        >
          {t("legal_back")}
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            color: "var(--tx)",
            marginBottom: "32px",
          }}
        >
          {t("impressum_title")}
        </h1>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "32px",
            color: "var(--tx2)",
            lineHeight: 1.8,
            fontSize: "15px",
          }}
        >
          <p style={{ color: "var(--tx2)", fontStyle: "italic" }}>{t("legal_placeholder")}</p>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />

          <p><strong style={{ color: "var(--tx)" }}>Donaulife Coffeeshop</strong></p>
          <p>Untere Landstraße 71<br />3500 Krems an der Donau<br />Österreich</p>
          <p>
            Tel: <a href="tel:+436608866699" style={{ color: "var(--green)" }}>+43 660 8522872</a><br />
            E-Mail: <a href="mailto:coffeeshop@donaulife.at" style={{ color: "var(--green)" }}>coffeeshop@donaulife.at</a>
          </p>
        </div>
      </div>
    </div>
  );
}
