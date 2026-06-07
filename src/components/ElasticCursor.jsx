import React, { useEffect, useRef, useState } from "react";

const BLOB_SIZE = 44;
const DOT_SIZE = 6;
const LERP_SPEED = 0.18;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ElasticCursor() {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const blobRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const state = {
      rawX: 0, rawY: 0,
      curX: 0, curY: 0,
      hoverEl: null,
      isHover: false,
    };

    const blob = blobRef.current;
    const dot = dotRef.current;
    if (!blob || !dot) return;

    const snap = (el) => {
      if (!el) return false;
      if (el.classList?.contains("cursor-can-hover")) return true;
      if (el.parentElement?.classList?.contains("cursor-can-hover")) return true;
      if (el.parentElement?.parentElement?.classList?.contains("cursor-can-hover")) return true;
      const tag = el.tagName;
      if (tag === "A" || tag === "BUTTON") return true;
      if (el.parentElement?.tagName === "A" || el.parentElement?.tagName === "BUTTON") return true;
      return false;
    };

    const getRect = (el) => {
      if (el.classList?.contains("cursor-can-hover")) return el.getBoundingClientRect();
      if (el.parentElement?.classList?.contains("cursor-can-hover")) return el.parentElement.getBoundingClientRect();
      if (el.parentElement?.parentElement?.classList?.contains("cursor-can-hover")) return el.parentElement.parentElement.getBoundingClientRect();
      const tag = el.tagName;
      if (tag === "A" || tag === "BUTTON") return el.getBoundingClientRect();
      if (el.parentElement?.tagName === "A") return el.parentElement.getBoundingClientRect();
      if (el.parentElement?.tagName === "BUTTON") return el.parentElement.getBoundingClientRect();
      return null;
    };

    const onMouseMove = (e) => {
      state.rawX = e.clientX;
      state.rawY = e.clientY;

      if (!visible) setVisible(true);

      const el = e.target;
      const shouldSnap = snap(el);

      if (shouldSnap && el !== state.hoverEl) {
        const rect = getRect(el);
        if (rect) {
          state.isHover = true;
          state.hoverEl = el;
          blob.style.transition = "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border-radius 0.35s cubic-bezier(0.16,1,0.3,1), background 0.25s";
          blob.style.width = `${rect.width + 12}px`;
          blob.style.height = `${rect.height + 12}px`;
          blob.style.borderRadius = "10px";
          blob.style.background = "rgba(255,255,255,0.12)";
          state.curX = rect.left + rect.width / 2;
          state.curY = rect.top + rect.height / 2;
        }
      } else if (!shouldSnap && state.isHover) {
        state.isHover = false;
        state.hoverEl = null;
        blob.style.transition = "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border-radius 0.3s cubic-bezier(0.16,1,0.3,1), background 0.25s";
        blob.style.width = `${BLOB_SIZE}px`;
        blob.style.height = `${BLOB_SIZE}px`;
        blob.style.borderRadius = "50%";
        blob.style.background = "rgba(255,255,255,0.15)";
      }
    };

    let prevX = 0, prevY = 0;

    const tick = () => {
      if (!state.isHover) {
        state.curX = lerp(state.curX, state.rawX, LERP_SPEED);
        state.curY = lerp(state.curY, state.rawY, LERP_SPEED);
      } else {
        const el = state.hoverEl;
        if (el) {
          const rect = getRect(el);
          if (rect) {
            const tx = rect.left + rect.width / 2;
            const ty = rect.top + rect.height / 2;
            state.curX = lerp(state.curX, tx, 0.14);
            state.curY = lerp(state.curY, ty, 0.14);
          }
        }
      }

      const vx = state.curX - prevX;
      const vy = state.curY - prevY;
      prevX = state.curX;
      prevY = state.curY;

      const dist = Math.sqrt(vx * vx + vy * vy);
      const scaleAmt = Math.min(dist / 80, 0.22);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);

      blob.style.transform = state.isHover
        ? `translate(calc(${state.curX}px - 50%), calc(${state.curY}px - 50%))`
        : `translate(calc(${state.curX}px - 50%), calc(${state.curY}px - 50%)) rotate(${angle}deg) scaleX(${1 + scaleAmt * 0.9}) scaleY(${1 - scaleAmt * 1.1})`;

      dot.style.transform = `translate(calc(${state.rawX}px - 50%), calc(${state.rawY}px - 50%))`;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Jelly blob */}
      <div
        ref={blobRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: BLOB_SIZE,
          height: BLOB_SIZE,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          mixBlendMode: "exclusion",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          backfaceVisibility: "hidden",
        }}
      />
      {/* Precise dot — zero latency */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          mixBlendMode: "exclusion",
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </>
  );
}

export default ElasticCursor;
