"use client";

import { motion } from "framer-motion";
import SectionHead from "@/components/ui/SectionHead";
import { useLanguage } from "@/lib/i18n";

const OFFERINGS = [
  { icon: "☕", accentRgb: "199,123,58", titleKey: "offering1_title" as const, textKey: "offering1_text" as const },
  { icon: "🌿", accentRgb: "57,211,83", titleKey: "offering2_title" as const, textKey: "offering2_text" as const },
  { icon: "🎉", accentRgb: "139,92,246", titleKey: "offering3_title" as const, textKey: "offering3_text" as const },
];

export default function Offerings() {
  const { t } = useLanguage();

  return (
    <section
      id="angebot"
      style={{
        background: "var(--bg2)",
        padding: "100px 24px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHead
          pre={t("offerings_pre")}
          title={t("offerings_title")}
          sub={t("offerings_sub")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {OFFERINGS.map((o, i) => (
            <motion.div
              key={o.titleKey}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              style={{
                background: "var(--card)",
                border: `1px solid rgba(${o.accentRgb},0.2)`,
                borderRadius: "18px",
                padding: "32px",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                transition: "box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(57,211,83,0.1)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon box */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: `rgba(${o.accentRgb},0.12)`,
                  border: `1px solid rgba(${o.accentRgb},0.2)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "20px",
                }}
              >
                {o.icon}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--tx)",
                  marginBottom: "10px",
                }}
              >
                {t(o.titleKey)}
              </h3>
              <p
                style={{
                  color: "var(--tx2)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  marginBottom: "0",
                }}
              >
                {t(o.textKey)}
              </p>

              {/* Bottom accent line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, rgba(${o.accentRgb},0.6), rgba(${o.accentRgb},0.1))`,
                  borderRadius: "0 0 18px 18px",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
