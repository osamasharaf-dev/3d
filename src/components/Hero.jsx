import { motion, useMotionValue, useSpring } from "framer-motion";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import useParallax from "../reactbits/hooks/useParallax";
import { styles } from "../styles";
import useMediaQuery from "../utils/useMediaQuery";
import { FloatingTechCanvas } from "./canvas";
import { useHero, HERO_FALLBACK } from "../lib/useHero";

/* ── Identity card ──────────────────────────────────────── */
const FloatingPortraitCard = memo(() => {
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 130, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 130, damping: 20 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      rawX.set(((e.clientY - r.top  - r.height / 2) / r.height) * 12);
      rawY.set(-((e.clientX - r.left - r.width  / 2) / r.width)  * 12);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="relative cursor-pointer select-none"
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(14,165,233,0.4) 0%, rgba(79,70,229,0.15) 60%, transparent 80%)" }}
      />

      {/* Card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1.5px solid rgba(14,165,233,0.2)",
          boxShadow: "0 20px 60px rgba(14,165,233,0.15), 0 4px 16px rgba(79,70,229,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
          width: "220px",
          padding: "28px 24px 24px",
        }}
      >
        {/* Top shimmer */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.6), rgba(79,70,229,0.4), transparent)" }}
        />

        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #4f46e5, #0ea5e9)" }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 50%, #dbeafe 100%)" }}
            >
              <span
                className="text-3xl font-black tracking-tight"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                OS
              </span>
            </div>
            <div
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2"
              style={{ background: "#22c55e", borderColor: "rgba(255,255,255,0.9)" }}
            />
          </div>

          {/* Name */}
          <div className="text-center">
            <p className="text-slate-800 font-bold text-[15px] tracking-wide">OSAMA SHARAF</p>
            <p className="text-sky-500 text-[11px] font-semibold tracking-wider uppercase mt-0.5">Software Engineer</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {["React", "Node.js", "Full-Stack"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(14,165,233,0.10)", color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.25)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div aria-hidden="true" className="w-full h-px" style={{ background: "rgba(14,165,233,0.12)" }} />

          {/* Status */}
          <div className="flex items-center gap-2">
            <div aria-hidden="true" className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
            <span className="text-[11px] text-slate-500 font-medium">Available for work</span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-16 h-16 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }}
        />
      </div>
    </motion.div>
  );
});

FloatingPortraitCard.displayName = "FloatingPortraitCard";

/* ── Hero ───────────────────────────────────────────────── */
const Hero = () => {
  const { data: heroData } = useHero();
  const typedItemsRef = useRef(HERO_FALLBACK.typed_items);

  const [typedText, setTypedText] = useState("");
  const [itemIndex, setItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { ref: parallaxRef } = useParallax({ strength: 0.03, maxOffset: 15, enabled: !isMobile });

  useEffect(() => {
    if (Array.isArray(heroData?.typed_items) && heroData.typed_items.length > 0) {
      typedItemsRef.current = heroData.typed_items;
    }
  }, [heroData]);

  useEffect(() => {
    const items = typedItemsRef.current;
    const current = items[itemIndex % items.length] || "";
    if (charIndex < current.length) {
      const t = setTimeout(() => { setTypedText((p) => p + current[charIndex]); setCharIndex((c) => c + 1); }, 100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setItemIndex((i) => (i + 1) % items.length); setCharIndex(0); setTypedText(""); }, 1400);
    return () => clearTimeout(t);
  }, [charIndex, itemIndex]);

  return (
    <section
      className="relative w-full h-screen mx-auto overflow-hidden"
      id="hero"
      aria-label="Hero — Osama Sharaf, Full-Stack Developer"
    >
      {/* 3D background — reduced opacity for light theme */}
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <FloatingTechCanvas />
      </div>

      {/* Light radial overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 90% at 50% 50%, rgba(248,250,255,0.3) 0%, rgba(240,247,255,0.6) 100%)" }}
      />

      {/* Content */}
      <div className={`absolute inset-0 top-[110px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10`}>
        {/* Left accent */}
        <div aria-hidden="true" className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-sky-500" />
          <div className="w-1 sm:h-80 h-40" style={{ background: "linear-gradient(to bottom, #0ea5e9, transparent)" }} />
        </div>

        {/* Text + card */}
        <div
          ref={parallaxRef}
          className="flex-1 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12"
        >
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sky-500 text-[13px] sm:text-[14px] font-semibold tracking-[0.2em] uppercase mb-2">
                Software Engineer & Full-Stack Developer
              </p>
              <h1 className={styles.heroHeadText}>
                {heroData.greeting || "Hi, I'm"}{" "}
                <span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 60%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {heroData.name || "Osama Sharaf"}
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={`${styles.heroSubText} mt-2`} aria-live="polite">
                I'm{" "}
                <span style={{ color: "#0ea5e9", fontWeight: "bold", borderBottom: "2px solid rgba(14,165,233,0.4)", paddingBottom: "2px", minWidth: "1ch", display: "inline-block" }}>
                  {typedText}
                </span>
                <span aria-hidden="true" style={{ color: "#0ea5e9", opacity: 0.7 }}>|</span>
              </p>
              <p className="mt-3 text-slate-500 text-[14px] sm:text-[15px] max-w-[480px] leading-[1.75] font-medium">
                {heroData.subtitle || "Building modern digital solutions, scalable web applications, and high-performance digital experiences."}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 mt-7"
            >
              <a href="#portfolio" aria-label="View my portfolio">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className="relative px-6 py-2.5 rounded-xl text-[13px] font-bold tracking-wide text-white overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)", boxShadow: "0 4px 22px rgba(14,165,233,0.30), inset 0 1px 0 rgba(255,255,255,0.2)" }}
                >
                  <span className="flex items-center gap-2">
                    {heroData.cta_primary || "View My Work"}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </motion.button>
              </a>

              <a href="#contact" aria-label="Contact me">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className="px-6 py-2.5 rounded-xl text-[13px] font-bold tracking-wide text-slate-700 border border-sky-200 hover:border-sky-400 transition-colors"
                  style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
                >
                  {heroData.cta_secondary || "Get In Touch"}
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* Portrait card — large screens */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0 mr-8 mt-4">
            <FloatingPortraitCard />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10" aria-hidden="true">
        <a href="#about" aria-label="Scroll to About section">
          <div className="w-[34px] h-[60px] rounded-3xl border-4 border-sky-300 flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 22, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-3 h-3 rounded-full mb-1 bg-sky-400"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
