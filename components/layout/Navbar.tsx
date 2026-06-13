"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface NavbarProps {
  onChatOpen: () => void;
}

export default function Navbar({ onChatOpen }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav_offering"), href: "#angebot" },
    { label: t("nav_events"), href: "#events" },
    { label: t("nav_gallery"), href: "#galerie" },
    { label: t("nav_findus"), href: "#find-us" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
          background: scrolled ? "rgba(8,8,8,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <Image
            src="/logo.png"
            alt="donau LIFE"
            width={160}
            height={32}
            priority
            style={{ height: "32px", width: "auto", filter: "brightness(0) invert(1)" }}
          />
          <span style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 600,
            fontSize: "9px",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            paddingLeft: "1px",
          }}>coffeeshop</span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginLeft: "auto",
            marginRight: "16px",
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "color 0.2s",
                fontFamily: "var(--font-dm-sans)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--tx)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://www.donaulife.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "var(--green)",
              fontSize: "14px",
              textDecoration: "none",
              padding: "8px 12px",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {t("nav_headshop")} <ExternalLink size={12} />
          </a>
        </div>

        {/* Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Language Toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
            className="hidden md:flex"
          >
            {(["de", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "var(--green)" : "transparent",
                  color: lang === l ? "#080808" : "var(--tx2)",
                  border: "none",
                  padding: "4px 10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: "var(--font-syne)",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Chat Button */}
          <button
            onClick={onChatOpen}
            className="ring-pulse"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--green)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageCircle size={18} color="#080808" />
          </button>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "var(--tx)",
            }}
            className="md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "280px",
              background: "var(--bg2)",
              borderLeft: "1px solid var(--border)",
              zIndex: 49,
              padding: "80px 24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--tx)",
                  fontSize: "18px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "12px 0",
                  textAlign: "left",
                  fontFamily: "var(--font-syne)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://www.donaulife.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--green)",
                fontSize: "18px",
                fontWeight: 600,
                textDecoration: "none",
                padding: "12px 0",
                fontFamily: "var(--font-syne)",
              }}
            >
              {t("nav_headshop")}
            </a>

            {/* Language Toggle Mobile */}
            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              {(["de", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    background: lang === l ? "var(--green)" : "var(--card)",
                    border: "1px solid var(--border)",
                    color: lang === l ? "#080808" : "var(--tx2)",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 48,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
