import { useEffect, useRef } from "react";

const useParallax = ({
  strength = 0.015,
  maxOffset = 10,
  smoothing = 0.1,
  enabled = true,
  disableOnMobile = true,
} = {}) => {
  const elementRef = useRef(null);
  const stateRef = useRef({ curX: 0, curY: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const isEnabled = enabled && !(disableOnMobile && isMobile) && !prefersReducedMotion;

  useEffect(() => {
    if (!isEnabled || !elementRef.current) return;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const s = stateRef.current;

    const handleMove = (e) => {
      s.targetX = clamp((e.movementX || 0) * strength * 80, -maxOffset, maxOffset);
      s.targetY = clamp((e.movementY || 0) * strength * 80, -maxOffset, maxOffset);
    };

    const tick = () => {
      s.curX += (s.targetX - s.curX) * smoothing;
      s.curY += (s.targetY - s.curY) * smoothing;
      s.targetX *= 0.88;
      s.targetY *= 0.88;

      if (elementRef.current) {
        elementRef.current.style.transform =
          `translate(${s.curX.toFixed(2)}px, ${s.curY.toFixed(2)}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
      if (elementRef.current) elementRef.current.style.transform = "";
    };
  }, [isEnabled, strength, maxOffset, smoothing]);

  return { ref: elementRef, style: {} };
};

export default useParallax;
