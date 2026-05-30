"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function HeadshopCTA() {
  const { t } = useLanguage();

  return (
    <section
      style={{
        background: "linear-gradient(135deg,#030d03,#071407,#030d03)",
        padding: "80px 24px",
        borderTop: "1px solid rgba(57,211,83,0.1)",
        borderBottom: "1px solid rgba(57,211,83,0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          right: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(57,211,83,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ flex: 1, minWidth: "280px" }}
        >
          <span
            style={{
              display: "inline-block",
              background: "var(--green-dim)",
              border: "1px solid var(--green-bdr)",
              color: "var(--green)",
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t("headshop_badge")}
          </span>

          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(24px, 3.5vw, 42px)",
              color: "var(--tx)",
              lineHeight: 1.1,
              marginBottom: "12px",
              letterSpacing: "-0.5px",
            }}
          >
            {t("headshop_title")}
          </h2>

          <p
            style={{
              color: "var(--tx2)",
              fontSize: "15px",
              marginBottom: "24px",
            }}
          >
            {t("headshop_sub")}
          </p>

          <a
            href="https://www.donaulife.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--green)",
              color: "#080808",
              borderRadius: "50px",
              padding: "13px 26px",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "var(--font-syne)",
              marginBottom: "12px",
            }}
          >
            {t("headshop_cta")} <ExternalLink size={14} />
          </a>

          <p style={{ color: "var(--tx2)", fontSize: "12px", marginTop: "10px" }}>
            {t("headshop_note")}
          </p>
        </motion.div>

        {/* Big Emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="shimmer"
          style={{
            fontSize: "clamp(80px, 12vw, 140px)",
            userSelect: "none",
            filter: "drop-shadow(0 0 30px rgba(57,211,83,0.2))",
          }}
        >
          🌱
        </motion.div>
      </div>
    </section>
  );
}
