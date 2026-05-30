"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import SectionHead from "@/components/ui/SectionHead";
import Lightbox from "@/components/ui/Lightbox";
import { useLanguage } from "@/lib/i18n";
import defaultGallery from "@/data/gallery.json";

type GalleryEntry = {
  id: number;
  file: string;
  cat: string;
  caption_de: string;
  caption_en: string;
};

const CATEGORY_EMOJIS: Record<string, string> = {
  vibes: "🌿",
  events: "🎉",
  drinks: "☕",
  cbd: "🌱",
};

const HEIGHTS = [240, 300, 220, 280, 260, 320, 240, 280, 220, 300, 260, 240];

function isImage(file: string) {
  return /\.(jpg|jpeg|png|webp)$/i.test(file);
}

function isSvgPlaceholder(file: string) {
  return /\.svg$/i.test(file) || !isImage(file);
}

export default function Gallery() {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items: GalleryEntry[] = galleryData;
  const filtered = filter === "all" ? items : items.filter((i) => i.cat === filter);

  const lightboxImages = filtered.map((item) => ({
    url: isSvgPlaceholder(item.file) ? "" : `/gallery/${item.file}`,
    caption: lang === "de" ? item.caption_de : item.caption_en,
  }));

  const categories = [
    { key: "all", label: t("gallery_all") },
    { key: "vibes", label: t("gallery_vibes") },
    { key: "events", label: t("gallery_events") },
    { key: "drinks", label: t("gallery_drinks") },
    { key: "cbd", label: t("gallery_cbd") },
  ];

  return (
    <section
      id="galerie"
      style={{
        background: "var(--bg)",
        padding: "100px 24px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHead
          pre={t("gallery_pre")}
          title={t("gallery_title")}
          sub={t("gallery_sub")}
        />

        {/* Filter Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              style={{
                background: filter === cat.key ? "var(--green)" : "var(--card)",
                color: filter === cat.key ? "#080808" : "var(--tx2)",
                border: `1px solid ${filter === cat.key ? "var(--green)" : "var(--border)"}`,
                borderRadius: "50px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "var(--font-syne)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ columns: "3", columnGap: "12px" }}
            className="gallery-columns"
          >
            {filtered.map((item, idx) => {
              const caption = lang === "de" ? item.caption_de : item.caption_en;
              const height = HEIGHTS[idx % HEIGHTS.length];
              const src = `/gallery/${item.file}`;
              const usePlaceholder = isSvgPlaceholder(item.file);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => setLightboxIndex(idx)}
                  style={{
                    marginBottom: "12px",
                    breakInside: "avoid",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    height: `${height}px`,
                    background: "var(--card)",
                  }}
                >
                  {usePlaceholder ? (
                    // SVG placeholder — rendered as img for gradient
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={caption}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={caption}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  {/* Hover overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "background 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(0,0,0,0.55)";
                      (el.querySelector(".g-icon") as HTMLElement | null)?.style.setProperty("opacity", "1");
                      (el.querySelector(".g-cap") as HTMLElement | null)?.style.setProperty("opacity", "1");
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(0,0,0,0)";
                      (el.querySelector(".g-icon") as HTMLElement | null)?.style.setProperty("opacity", "0");
                      (el.querySelector(".g-cap") as HTMLElement | null)?.style.setProperty("opacity", "0");
                    }}
                  >
                    <div className="g-icon" style={{ opacity: 0, transition: "opacity 0.25s" }}>
                      <ZoomIn size={22} color="#fff" />
                    </div>
                    {caption && (
                      <p className="g-cap" style={{ opacity: 0, transition: "opacity 0.25s", color: "#fff", fontSize: "12px", textAlign: "center", padding: "0 12px", margin: 0 }}>
                        {caption}
                      </p>
                    )}
                  </div>

                  {/* Category emoji bottom-left */}
                  <div style={{ position: "absolute", bottom: "8px", left: "10px", fontSize: "16px", opacity: 0.7 }}>
                    {CATEGORY_EMOJIS[item.cat] ?? "🌿"}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) { .gallery-columns { columns: 2 !important; } }
      `}</style>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
