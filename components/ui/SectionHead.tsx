"use client";

interface SectionHeadProps {
  pre: string;
  title: string;
  sub?: string;
  center?: boolean;
}

export default function SectionHead({ pre, title, sub, center = true }: SectionHeadProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <span
        style={{
          color: "var(--green)",
          fontFamily: "var(--font-syne)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "10px",
        }}
      >
        {pre}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 800,
          color: "var(--tx)",
          lineHeight: 1.1,
          marginBottom: sub ? "16px" : 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            color: "var(--tx2)",
            fontSize: "16px",
            lineHeight: 1.6,
            maxWidth: center ? "560px" : undefined,
            margin: center ? "0 auto" : undefined,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
