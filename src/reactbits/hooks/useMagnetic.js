import { useEffect, useRef } from "react";

const useMagnetic = ({ radius = 80, strength = 0.4 } = {}) => {
  const elementRef = useRef(null);
  const stateRef = useRef({ nearEl: false, animating: false, targetX: 0, targetY: 0, curX: 0, curY: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const s = stateRef.current;

    const applyTransform = () => {
      s.curX += (s.targetX - s.curX) * 0.22;
      s.curY += (s.targetY - s.curY) * 0.22;

      const dx = Math.abs(s.curX - s.targetX);
      const dy = Math.abs(s.curY - s.targetY);

      element.style.transform = `translate(${s.curX.toFixed(2)}px, ${s.curY.toFixed(2)}px)`;

      if (dx > 0.05 || dy > 0.05) {
        rafRef.current = requestAnimationFrame(applyTransform);
      } else {
        s.animating = false;
        element.style.transform = `translate(${s.targetX}px, ${s.targetY}px)`;
      }
    };

    const startAnimation = () => {
      if (s.animating) return;
      s.animating = true;
      rafRef.current = requestAnimationFrame(applyTransform);
    };

    const handlePointerMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const pull = 1 - distance / radius;
        s.targetX = dx * strength * pull;
        s.targetY = dy * strength * pull;
        startAnimation();
      } else if (s.targetX !== 0 || s.targetY !== 0) {
        s.targetX = 0;
        s.targetY = 0;
        startAnimation();
      }
    };

    const handleLeave = () => {
      s.targetX = 0;
      s.targetY = 0;
      startAnimation();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    element.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [radius, strength]);

  return { ref: elementRef, style: {} };
};

export default useMagnetic;
