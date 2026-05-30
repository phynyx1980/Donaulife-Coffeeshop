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
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface SmokeParticle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  life: number;
  maxLife: number;
}

export default function Hero({ onChatOpen }: HeroProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const smokeRef = useRef<SmokeParticle[]>([]);

  const spawnSmoke = useCallback((cx: number, cy: number) => {
    if (smokeRef.current.length > 20) return;
    const life = 80 + Math.random() * 60;
    smokeRef.current.push({
      x: cx + (Math.random() - 0.5) * 20,
      y: cy,
      vy: -(0.4 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 0.2,
      radius: 4 + Math.random() * 6,
      life: 0,
      maxLife: life,
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

    particlesRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.35 + 0.05,
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Smoke source: center of logo (leaf position)
      const smokeX = canvas.width / 2;
      const smokeY = canvas.height * 0.3;
      if (frame % 10 === 0) spawnSmoke(smokeX, smokeY);

      // Particles
      const pts = particlesRef.current;
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(21,160,106,${p.opacity})`;
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
            ctx.strokeStyle = `rgba(21,160,106,${0.05 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Smoke
      smokeRef.current = smokeRef.current.filter(s => s.life < s.maxLife);
      for (const s of smokeRef.current) {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vx += (Math.random() - 0.5) * 0.03;
        s.radius += 0.08;
        const p = s.life / s.maxLife;
        const a = p < 0.25 ? (p / 0.25) * 0.18 : p > 0.65 ? ((1 - p) / 0.35) * 0.18 : 0.18;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
        grad.addColorStop(0, `rgba(21,160,106,${a})`);
        grad.addColorStop(1, `rgba(21,160,106,0)`);
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
        minHeight: "640px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
      />

      {/* Glow behind logo */}
      <div style={{
        position: "absolute",
        top: "26%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "480px",
        height: "280px",
        background: "radial-gradient(ellipse, rgba(21,160,106,0.1) 0%, transparent 70%)",
        filter: "blur(10px)",
        pointerEvents: "none",
        zIndex: 1,
      }}/>

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
        {/* ── LOGO ── */}
        <motion.div variants={item} style={{ marginBottom: "8px" }}>
          {/* Animated logo — float + glow */}
          <motion.div
            animate={{ y: [0, -8, 0, -4, 0] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            style={{
              filter: "drop-shadow(0 0 18px rgba(21,160,106,0.5)) drop-shadow(0 0 40px rgba(21,160,106,0.2))",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image
              src="/logo.png"
              alt="donau LIFE Coffeeshop"
              width={480}
              height={96}
              priority
              style={{
                width: "clamp(260px, 45vw, 480px)",
                height: "auto",
                filter: "brightness(8) drop-shadow(0 0 18px rgba(21,160,106,0.5)) drop-shadow(0 0 40px rgba(21,160,106,0.2))",
              }}
            />
          </motion.div>
          {/* COFFEESHOP label */}
          <div style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 600,
            fontSize: "clamp(9px, 1vw, 12px)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            marginTop: "8px",
            textAlign: "center",
          }}>
            coffeeshop
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={item} style={{
          width: "56px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(21,160,106,0.55), transparent)",
          margin: "20px 0 24px",
        }}/>

        {/* Badge */}
        <motion.div variants={item}>
          <span style={{
            display: "inline-block",
            background: "var(--green-dim)",
            border: "1px solid var(--green-bdr)",
            color: "var(--green)",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
            marginBottom: "18px",
          }}>
            {t("hero_badge")}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1 variants={item} style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(28px, 4.2vw, 54px)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
          color: "var(--tx)",
          marginBottom: "14px",
          maxWidth: "680px",
        }}>
          {t("hero_h1")}
        </motion.h1>

        {/* Sub */}
        <motion.p variants={item} style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(11px, 1.3vw, 14px)",
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--tx2)",
          marginBottom: "34px",
        }}>
          {t("hero_sub")}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={scrollToEvents}
            style={{
              background: "var(--green)",
              color: "#080808",
              border: "none",
              borderRadius: "50px",
              padding: "13px 28px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-syne)",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: "0 0 24px rgba(21,160,106,0.3)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            {t("hero_cta_primary")}
          </button>
          <button
            onClick={onChatOpen}
            style={{
              background: "transparent",
              color: "var(--tx)",
              border: "1px solid var(--border)",
              borderRadius: "50px",
              padding: "13px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-syne)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--green-bdr)"; (e.currentTarget as HTMLElement).style.color = "var(--green)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--tx)"; }}
          >
            {t("hero_cta_secondary")}
          </button>
        </motion.div>
      </motion.div>

      {/* Bounce Arrow */}
      <div
        onClick={scrollToEvents}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 2, cursor: "pointer" }}
      >
        <ChevronDown size={22} color="var(--tx2)" style={{ animation: "bounceArr 2s ease-in-out infinite" }} />
        <style>{`@keyframes bounceArr { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(8px);opacity:1} }`}</style>
      </div>
    </section>
  );
}
