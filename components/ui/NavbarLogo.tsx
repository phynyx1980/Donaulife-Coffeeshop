"use client";

const green = "#39d353";

function CannabisLeafMini({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path d="M96 220 Q97 195 97 170 Q97 162 100 160 Q103 162 103 170 Q103 195 104 220 Z" fill={green}/>
      <path d="M100 10 C96 22 84 30 76 28 C80 36 88 40 96 40 C92 44 86 46 82 50 C88 52 95 50 100 48 C105 50 112 52 118 50 C114 46 108 44 104 40 C112 40 120 36 124 28 C116 30 104 22 100 10 Z" fill={green}/>
      <path d="M93 40 C82 30 64 32 56 26 C59 36 67 44 76 44 C71 47 65 52 62 58 C69 57 77 52 82 47 Z" fill={green}/>
      <path d="M107 40 C118 30 136 32 144 26 C141 36 133 44 124 44 C129 47 135 52 138 58 C131 57 123 52 118 47 Z" fill={green}/>
      <path d="M87 54 C73 46 52 50 42 42 C46 55 56 63 68 62 C63 66 57 73 56 80 C63 78 72 70 78 63 Z" fill={green}/>
      <path d="M113 54 C127 46 148 50 158 42 C154 55 144 63 132 62 C137 66 143 73 144 80 C137 78 128 70 122 63 Z" fill={green}/>
      <path d="M85 70 C69 64 46 68 36 60 C40 74 52 82 64 80 C60 85 56 93 57 100 C64 97 73 88 79 80 Z" fill={green}/>
      <path d="M115 70 C131 64 154 68 164 60 C160 74 148 82 136 80 C140 85 144 93 143 100 C136 97 127 88 121 80 Z" fill={green}/>
    </svg>
  );
}

export default function NavbarLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", lineHeight: 1 }}>
      <span style={{
        fontFamily: "'Nunito', 'Quicksand', system-ui, sans-serif",
        fontWeight: 300,
        fontSize: "21px",
        color: "#ffffff",
        letterSpacing: "-0.3px",
      }}>
        donau
      </span>
      <CannabisLeafMini size={20} />
      <span style={{
        fontFamily: "'Nunito', 'Quicksand', system-ui, sans-serif",
        fontWeight: 900,
        fontSize: "21px",
        color: green,
        letterSpacing: "1.5px",
      }}>
        LIFE
      </span>
    </div>
  );
}
