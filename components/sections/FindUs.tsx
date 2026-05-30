"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { useLanguage } from "@/lib/i18n";

export default function FindUs() {
  const { t } = useLanguage();

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Untere+Landstraße+71,+3500+Krems+an+der+Donau";

  const embedUrl =
    "https://maps.google.com/maps?q=Untere+Landstra%C3%9Fe+71,+3500+Krems+an+der+Donau,+Austria&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section
      id="find-us"
      style={{
        background: "var(--bg2)",
        padding: "100px 24px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHead
          pre={t("findus_pre")}
          title={t("findus_title")}
          sub={t("findus_sub")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
          className="find-us-grid"
        >
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: "28px" }}
          >
            {/* Öffnungszeiten */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Clock size={16} color="var(--green)" />
                <span
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--tx2)",
                  }}
                >
                  {t("findus_hours_title")}
                </span>
              </div>
              <p style={{ color: "var(--tx)", fontSize: "16px", fontWeight: 600, margin: 0 }}>
                {t("findus_hours")}
              </p>
              <p style={{ color: "var(--green)", fontSize: "18px", fontWeight: 700, margin: "4px 0 0" }}>
                {t("findus_hours_time")}
              </p>
            </div>

            {/* Adresse */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <MapPin size={16} color="var(--green)" />
                <span
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--tx2)",
                  }}
                >
                  {t("findus_address_title")}
                </span>
              </div>
              <p style={{ color: "var(--tx)", fontSize: "15px", margin: 0, lineHeight: 1.5 }}>
                {t("findus_address")}
              </p>
            </div>

            {/* Kontakt */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Phone size={16} color="var(--green)" />
                <span
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--tx2)",
                  }}
                >
                  {t("findus_contact_title")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a
                  href="tel:+436608866699"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--tx)",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  <Phone size={14} color="var(--tx2)" /> +43 660 8866699
                </a>
                <a
                  href="mailto:coffeeshop@donaulife.at"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--tx)",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  <Mail size={14} color="var(--tx2)" /> coffeeshop@donaulife.at
                </a>
                <a
                  href="https://www.donaulife.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--green)",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  <Globe size={14} color="var(--green)" /> www.donaulife.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map Column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            {/* Open in Maps button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(8,8,8,0.88)",
                color: "var(--green)",
                border: "1px solid var(--green-bdr)",
                borderRadius: "50px",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                backdropFilter: "blur(8px)",
              }}
            >
              {t("findus_map_open")} <ExternalLink size={11} />
            </a>

            <iframe
              src={embedUrl}
              width="100%"
              height="380"
              style={{
                border: 0,
                display: "block",
                filter: "invert(90%) hue-rotate(180deg) saturate(0.7) brightness(0.85)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Donaulife Coffeeshop Standort"
            />

            {/* Green bottom accent */}
            <div
              style={{
                height: "3px",
                background: "linear-gradient(90deg, var(--green), transparent)",
              }}
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .find-us-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
