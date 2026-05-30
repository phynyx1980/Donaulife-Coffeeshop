"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface HeroProps {
  onChatOpen: () => void;
}

interface Particle {
  x: number; y: number; vx: number; vy: number; radius: number; opacity: number;
}
interface SmokeParticle {
  x: number; y: number; vy: number; vx: number; radius: number; life: number; maxLife: number; wobble: number;
}

export default function Hero({ onChatOpen }: HeroProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const smokeRef = useRef<SmokeParticle[]>([]);

  // Spawn one smoke particle from the leaf center
  const spawnSmoke = useCallback((cx: number, cy: number) => {
    if (smokeRef.current.length > 40) return;
    const life = 100 + Math.random() * 80;
    smokeRef.current.push({
      x: cx + (Math.random() - 0.5) * 30,
      y: cy,
      vy: -(0.5 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 0.3,
      radius: 6 + Math.random() * 10,
      life: 0,
      maxLife: life,
      wobble: Math.random() * Math.PI * 2,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Background network particles
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      radius: Math.random() * 1.3 + 0.3,
      opacity: Math.random() * 0.3 + 0.04,
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Smoke source: center of the big hero logo (leaf position)
      const smokeX = canvas.width / 2;
      const smokeY = canvas.height * 0.28; // just above center logo
      // Spawn more frequently for denser smoke
      if (frame % 6 === 0) spawnSmoke(smokeX, smokeY);

      // Network particles
      const pts = particlesRef.current;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57,211,83,${p.opacity})`;
        ctx.fill();
      }

      // Connecting lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(57,211,83,${0.04 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Smoke particles — dense, wispy, rising
      smokeRef.current = smokeRef.current.filter(s => s.life < s.maxLife);
      for (const s of smokeRef.current) {
        s.life++;
        s.wobble += 0.02;
        s.x += s.vx + Math.sin(s.wobble) * 0.15;
        s.y += s.vy;
        s.radius += 0.1;

        const progress = s.life / s.maxLife;
        const alpha =
          progress < 0.2  ? (progress / 0.2) * 0.28 :
          progress > 0.6  ? ((1 - progress) / 0.4) * 0.28 : 0.28;

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
        grad.addColorStop(0, `rgba(57,211,83,${alpha})`);
        grad.addColorStop(0.5, `rgba(57,211,83,${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(57,211,83,0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [spawnSmoke]);

  const scrollToEvents = () =>
    document.querySelector("#events")?.scrollIntoView({ behavior: "smooth" });

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <section
      className="grain"
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: "680px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
      />

      {/* Glow behind logo */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "600px",
        height: "340px",
        background: "radial-gradient(ellipse, rgba(57,211,83,0.12) 0%, transparent 68%)",
        filter: "blur(12px)",
        pointerEvents: "none",
        zIndex: 1,
      }}/>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── BIG LOGO ── */}
        <motion.div variants={item} style={{ marginBottom: "12px" }}>
          <motion.div
            animate={{ y: [0, -10, 0, -5, 0] }}
            transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
            style={{
              display: "flex",
              justifyContent: "center",
              // Preserve original green colors: only drop-shadow for glow, no brightness distortion
              filter:
                "drop-shadow(0 0 1px rgba(255,255,255,0.6)) " +
                "drop-shadow(0 0 22px rgba(57,211,83,0.65)) " +
                "drop-shadow(0 0 50px rgba(57,211,83,0.28))",
            }}
          >
            <Image
              src="/logo.png"
              alt="donau LIFE Coffeeshop"
              width={700}
              height={140}
              priority
              style={{
                width: "clamp(340px, 58vw, 700px)",
                height: "auto",
              }}
            />
          </motion.div>

          {/* COFFEESHOP sub-label */}
          <div style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 600,
            fontSize: "clamp(9px, 1vw, 12px)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
            marginTop: "10px",
            textAlign: "center",
          }}>
            coffeeshop
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={item} style={{
          width: "60px", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(57,211,83,0.5), transparent)",
          margin: "18px 0 20px",
        }}/>

        {/* ── SLOGAN: COFFEE, VIBES & GOOD TIMES ── */}
        <motion.div variants={item} style={{ marginBottom: "28px", textAlign: "center" }}>
          {/* Zeile 1: COFFEE, VIBES */}
          <div style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(20px, 3.2vw, 44px)",
            fontWeight: 700,
            fontStyle: "normal",
            lineHeight: 1,
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "block",
          }}>
            COFFEE, VIBES
          </div>
          {/* Zeile 2: & GOOD TIMES – grün + kursiv */}
          <div style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(20px, 3.2vw, 44px)",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1.1,
            color: "var(--green)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "block",
            filter: "drop-shadow(0 0 12px rgba(57,211,83,0.35))",
          }}>
            &amp; GOOD TIMES
          </div>
        </motion.div>

        {/* Adresse — wie im Referenzbild */}
        <motion.p variants={item} style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(10px, 1.1vw, 12px)",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--tx2)",
          marginBottom: "32px",
        }}>
          Untere Landstraße 71 &nbsp;·&nbsp; Krems an der Donau
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={scrollToEvents}
            style={{
              background: "var(--green)", color: "#080808", border: "none",
              borderRadius: "50px", padding: "13px 28px", fontSize: "15px",
              fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne)",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: "0 0 24px rgba(57,211,83,0.3)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            {t("hero_cta_primary")}
          </button>
          <button
            onClick={onChatOpen}
            style={{
              background: "transparent", color: "var(--tx)",
              border: "1px solid var(--border)", borderRadius: "50px",
              padding: "13px 28px", fontSize: "15px", fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-syne)", transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--green-bdr)"; (e.currentTarget as HTMLElement).style.color = "var(--green)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--tx)"; }}
          >
            {t("hero_cta_secondary")}
          </button>
        </motion.div>
      </motion.div>

      {/* ── LOGO UNTEN LINKS ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.55, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "28px",
          left: "28px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/logo.png"
          alt="donau LIFE"
          width={160}
          height={32}
          style={{
            width: "clamp(100px, 14vw, 160px)",
            height: "auto",
            filter: "brightness(8)",
            opacity: 0.4,
          }}
        />
      </motion.div>

      {/* Bounce Arrow */}
      <div
        onClick={scrollToEvents}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 2, cursor: "pointer" }}
      >
        <ChevronDown size={22} color="var(--tx2)" style={{ animation: "bounceArr 2s ease-in-out infinite" }} />
        <style>{`@keyframes bounceArr { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(8px);opacity:.9} }`}</style>
      </div>
    </section>
  );
}
