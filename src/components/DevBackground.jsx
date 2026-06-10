import React, { memo } from "react";

const ITEMS = [
  { text: "</>",         x: "4%",  y: "12%", size: 30, delay: 0,    color: "#0ea5e9", opacity: 0.05 },
  { text: "{ }",         x: "91%", y: "8%",  size: 36, delay: 1.2,  color: "#4f46e5", opacity: 0.05 },
  { text: "[ ]",         x: "18%", y: "88%", size: 26, delay: 2.1,  color: "#06b6d4", opacity: 0.045 },
  { text: "=>",          x: "82%", y: "82%", size: 24, delay: 0.6,  color: "#0ea5e9", opacity: 0.05 },
  { text: "const",       x: "28%", y: "30%", size: 15, delay: 1.5,  color: "#4f46e5", opacity: 0.045, mono: true },
  { text: "function()",  x: "68%", y: "48%", size: 13, delay: 0.9,  color: "#0ea5e9", opacity: 0.04,  mono: true },
  { text: "import",      x: "44%", y: "91%", size: 15, delay: 2.4,  color: "#4f46e5", opacity: 0.04,  mono: true },
  { text: "async/await", x: "85%", y: "62%", size: 12, delay: 1.8,  color: "#06b6d4", opacity: 0.04,  mono: true },
  { text: "return",      x: "6%",  y: "55%", size: 14, delay: 0.3,  color: "#0ea5e9", opacity: 0.04,  mono: true },
  { text: "npm install", x: "53%", y: "18%", size: 12, delay: 1.1,  color: "#4f46e5", opacity: 0.038, mono: true },
  { text: "git commit",  x: "10%", y: "78%", size: 12, delay: 2.8,  color: "#06b6d4", opacity: 0.038, mono: true },
  { text: "export",      x: "75%", y: "25%", size: 14, delay: 0.5,  color: "#0ea5e9", opacity: 0.04,  mono: true },
  { text: "#",           x: "38%", y: "55%", size: 40, delay: 1.7,  color: "#4f46e5", opacity: 0.03  },
  { text: "&&",          x: "60%", y: "70%", size: 28, delay: 2.2,  color: "#0ea5e9", opacity: 0.04  },
  { text: "||",          x: "22%", y: "50%", size: 26, delay: 0.8,  color: "#06b6d4", opacity: 0.038 },
  { text: "مرحبا",       x: "20%", y: "72%", size: 20, delay: 0.7,  color: "#4f46e5", opacity: 0.038 },
  { text: "برمجة",       x: "76%", y: "35%", size: 18, delay: 1.4,  color: "#0ea5e9", opacity: 0.038 },
  { text: "تطوير",       x: "48%", y: "62%", size: 17, delay: 2.5,  color: "#06b6d4", opacity: 0.035 },
  { text: "بيانات",      x: "35%", y: "14%", size: 19, delay: 0.9,  color: "#4f46e5", opacity: 0.038 },
  { text: "شبكة",        x: "62%", y: "78%", size: 20, delay: 1.6,  color: "#0ea5e9", opacity: 0.038 },
  { text: "كود",         x: "88%", y: "45%", size: 22, delay: 2.0,  color: "#06b6d4", opacity: 0.035 },
  { text: "ويب",         x: "5%",  y: "40%", size: 18, delay: 1.3,  color: "#4f46e5", opacity: 0.035 },
];

const DevBackground = memo(() => (
  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none overflow-hidden"
    style={{ zIndex: 0 }}
  >
    {ITEMS.map((item, i) => (
      <span
        key={i}
        style={{
          position: "absolute",
          left: item.x,
          top: item.y,
          fontSize: item.size,
          color: item.color,
          opacity: item.opacity,
          fontFamily: item.mono ? "'Courier New', monospace" : "inherit",
          fontWeight: 700,
          userSelect: "none",
          animation: `devFloat ${4 + (i % 4)}s ease-in-out ${item.delay}s infinite, devFade ${6 + (i % 3)}s ease-in-out ${item.delay * 0.5}s infinite`,
          "--base-opacity": item.opacity,
          willChange: "transform, opacity",
        }}
      >
        {item.text}
      </span>
    ))}
  </div>
));

DevBackground.displayName = "DevBackground";
export default DevBackground;
