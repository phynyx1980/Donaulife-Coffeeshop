"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ZoomIn } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Modal from "@/components/ui/Modal";
import { useLanguage } from "@/lib/i18n";
import type { DonauEvent } from "@/lib/types";

function EventSkeleton() {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div className="skeleton" style={{ height: "200px" }} />
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="skeleton" style={{ height: "16px", width: "60%" }} />
        <div className="skeleton" style={{ height: "22px" }} />
        <div className="skeleton" style={{ height: "14px" }} />
        <div className="skeleton" style={{ height: "14px", width: "80%" }} />
      </div>
    </div>
  );
}

export default function Events() {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState<DonauEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<DonauEvent | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data: DonauEvent[]) => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section
      id="events"
      style={{
        background: "var(--bg)",
        padding: "100px 24px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHead
          pre={t("events_pre")}
          title={t("events_title")}
          sub={t("events_sub")}
        />

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: "24px",
            }}
          >
            {[0, 1, 2, 3].map((i) => <EventSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <p style={{ color: "var(--tx2)", textAlign: "center" }}>{t("events_empty")}</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: "24px",
            }}
          >
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  cursor: event.flyer_url ? "pointer" : "default",
                  position: "relative",
                }}
                onClick={() => event.flyer_url && setSelectedEvent(event)}
              >
                {/* Flyer or Gradient */}
                <div
                  style={{
                    height: "200px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {event.flyer_url ? (
                    <>
                      <Image
                        src={event.flyer_url}
                        alt={event.title}
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.3s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6))",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ZoomIn size={14} color="#f0f0f0" />
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        background: `linear-gradient(135deg, rgba(${hexToRgb(event.tag_color)},0.15), rgba(${hexToRgb(event.tag_color)},0.04))`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px",
                      }}
                    >
                      {tagEmoji(event.tag)}
                    </div>
                  )}

                  {/* Tag Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: event.tag_color,
                      color: "#fff",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {event.tag}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "var(--tx2)", fontSize: "13px" }}>
                      {lang === "de" ? event.date_de : event.date_en}
                    </span>
                    <span style={{ color: "var(--border)" }}>·</span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--tx2)",
                        fontSize: "13px",
                      }}
                    >
                      <Clock size={12} /> {event.time}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "var(--tx)",
                      marginBottom: "8px",
                      lineHeight: 1.2,
                    }}
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: "var(--tx2)", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                    {lang === "de" ? event.description_de : event.description_en}
                  </p>
                </div>

                {/* Bottom color bar */}
                <div
                  style={{
                    height: "3px",
                    background: `linear-gradient(90deg, ${event.tag_color}, transparent)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Flyer Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <div>
            {selectedEvent.flyer_url && (
              <div style={{ position: "relative", width: "100%", height: "320px" }}>
                <Image
                  src={selectedEvent.flyer_url}
                  alt={selectedEvent.title}
                  fill
                  style={{ objectFit: "cover", borderRadius: "18px 18px 0 0" }}
                />
              </div>
            )}
            <div style={{ padding: "24px" }}>
              <span
                style={{
                  background: selectedEvent.tag_color,
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "inline-block",
                  marginBottom: "12px",
                }}
              >
                {selectedEvent.tag}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 800,
                  fontSize: "24px",
                  color: "var(--tx)",
                  marginBottom: "8px",
                }}
              >
                {selectedEvent.title}
              </h2>
              <p style={{ color: "var(--tx2)", fontSize: "14px", marginBottom: "4px" }}>
                {lang === "de" ? selectedEvent.date_de : selectedEvent.date_en} · {selectedEvent.time} Uhr
              </p>
              <p style={{ color: "var(--tx2)", fontSize: "15px", lineHeight: 1.6, marginTop: "12px" }}>
                {lang === "de" ? selectedEvent.description_de : selectedEvent.description_en}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

function tagEmoji(tag: string): string {
  const map: Record<string, string> = {
    Karaoke: "🎤",
    DJ: "🎧",
    Live: "🎶",
    Special: "⭐",
  };
  return map[tag] ?? "🎉";
}
