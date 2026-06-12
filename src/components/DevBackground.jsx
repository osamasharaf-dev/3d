import React, { memo, useEffect, useState } from "react";

const ITEMS = [
  { text: "</>",        x: "4%",  y: "12%", size: 30, delay: 0,   color: "#0ea5e9", opacity: 0.05 },
  { text: "{ }",        x: "91%", y: "8%",  size: 36, delay: 1.2, color: "#4f46e5", opacity: 0.05 },
  { text: "const",      x: "28%", y: "30%", size: 15, delay: 1.5, color: "#4f46e5", opacity: 0.045, mono: true },
  { text: "function()", x: "68%", y: "48%", size: 13, delay: 0.9, color: "#0ea5e9", opacity: 0.04,  mono: true },
  { text: "async/await",x: "85%", y: "62%", size: 12, delay: 1.8, color: "#06b6d4", opacity: 0.04,  mono: true },
  { text: "return",     x: "6%",  y: "55%", size: 14, delay: 0.3, color: "#0ea5e9", opacity: 0.04,  mono: true },
  { text: "&&",         x: "60%", y: "70%", size: 28, delay: 2.2, color: "#0ea5e9", opacity: 0.04  },
  { text: "مرحبا",      x: "20%", y: "72%", size: 20, delay: 0.7, color: "#4f46e5", opacity: 0.038 },
  { text: "برمجة",      x: "76%", y: "35%", size: 18, delay: 1.4, color: "#0ea5e9", opacity: 0.038 },
  { text: "كود",        x: "88%", y: "45%", size: 22, delay: 2.0, color: "#06b6d4", opacity: 0.035 },
];

const DevBackground = memo(() => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="dev-bg-item"
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
            animationDelay: `${item.delay}s, ${item.delay * 0.5}s`,
            "--base-opacity": item.opacity,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
});

DevBackground.displayName = "DevBackground";
export default DevBackground;
