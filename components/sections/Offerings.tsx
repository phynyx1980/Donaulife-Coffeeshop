"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHead from "@/components/ui/SectionHead";
import { useLanguage } from "@/lib/i18n";

const OFFERINGS = [
  {
    icon: "☕",
    accentRgb: "199,123,58",
    titleKey: "offering1_title" as const,
    textKey: "offering1_text" as const,
    image: "/offerings/coffe and drinks.png",
  },
  {
    icon: "🌿",
    accentRgb: "57,211,83",
    titleKey: "offering2_title" as const,
    textKey: "offering2_text" as const,
    image: "/offerings/cbd and lifestyle.png",
  },
  {
    icon: "🎉",
    accentRgb: "139,92,246",
    titleKey: "offering3_title" as const,
    textKey: "offering3_text" as const,
    image: "/offerings/events and vibes.png",
  },
];

function OfferingCard({ o, i, t }: {
  o: typeof OFFERINGS[number];
  i: number;
  t: (k: typeof o.titleKey | typeof o.textKey) => string;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.12 }}
      whileHover={{ y: -4 }}
      style={{
        border: `1px solid rgba(${o.accentRgb},0.25)`,
        borderRadius: "18px",
        padding: "36px 32px",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "var(--card)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 12px 40px rgba(${o.accentRgb},0.15)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Background image */}
      {!imgError && (
        <div style={{
          position: "absolute", inset: 0,
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          <Image
            src={o.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Dark gradient overlay — text lesbar */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(
          to bottom,
          rgba(8,8,8,0.45) 0%,
          rgba(8,8,8,0.55) 40%,
          rgba(8,8,8,0.80) 100%
        )`,
      }} />

      {/* Farbiger Akzent-Schimmer oben */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "120px",
        background: `linear-gradient(to bottom, rgba(${o.accentRgb},0.12), transparent)`,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: `rgba(${o.accentRgb},0.18)`,
          border: `1px solid rgba(${o.accentRgb},0.35)`,
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          marginBottom: "20px",
        }}>
          {o.icon}
        </div>

        <h3 style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: "20px",
          color: "#ffffff",
          marginBottom: "10px",
          textShadow: "0 1px 8px rgba(0,0,0,0.5)",
        }}>
          {t(o.titleKey)}
        </h3>

        <p style={{
          color: "rgba(255,255,255,0.82)",
          fontSize: "15px",
          lineHeight: 1.6,
          margin: 0,
          textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        }}>
          {t(o.textKey)}
        </p>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "3px",
        background: `linear-gradient(90deg, rgba(${o.accentRgb},0.8), rgba(${o.accentRgb},0.1))`,
      }} />
    </motion.div>
  );
}

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

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {OFFERINGS.map((o, i) => (
            <OfferingCard key={o.titleKey} o={o} i={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
