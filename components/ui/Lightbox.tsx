"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface LightboxImage {
  url: string;
  caption: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((i) => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === "ArrowRight") setCurrent((i) => (i < images.length - 1 ? i + 1 : 0));
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, images.length]);

  const img = images[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.94)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <X size={18} color="#f0f0f0" />
      </button>

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "var(--tx2)",
          fontSize: "13px",
        }}
      >
        {current + 1} / {images.length}
      </div>

      {/* Nav Left */}
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i > 0 ? i - 1 : images.length - 1)); }}
        style={{
          position: "absolute",
          left: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronLeft size={20} color="#f0f0f0" />
      </button>

      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "0 80px",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {img.url ? (
          <div style={{ position: "relative", width: "100%", maxHeight: "80vh" }}>
            <Image
              src={img.url}
              alt={img.caption}
              width={900}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "400px",
              background: "linear-gradient(135deg, #0a2a0a, #1a3a1a)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            🌿
          </div>
        )}
        {img.caption && (
          <p style={{ color: "var(--tx2)", fontSize: "14px", textAlign: "center" }}>
            {img.caption}
          </p>
        )}
      </motion.div>

      {/* Nav Right */}
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i < images.length - 1 ? i + 1 : 0)); }}
        style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronRight size={20} color="#f0f0f0" />
      </button>
    </motion.div>
  );
}
