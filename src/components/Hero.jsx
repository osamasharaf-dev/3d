import { motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";

import { styles } from "../styles";
import useMediaQuery from "../utils/useMediaQuery";
import { FloatingTechCanvas } from "./canvas";
import { useHero, HERO_FALLBACK } from "../lib/useHero";
import PictureImg from "./ui/PictureImg";

/* ─────────────────────────────────────────────────────────────
   CLEAN PORTRAIT  — rounded rectangle, head + upper body
───────────────────────────────────────────────────────────── */
const Portrait = memo(({ mobile = false, photoSrc = "/my-photo.webp" }) => (
  <div
    className={`relative flex-shrink-0 select-none ${mobile ? "mx-auto" : ""}`}
    aria-hidden="true"
  >
    {/* Ambient glow */}
    <div
      className="absolute -inset-6 rounded-[28px] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse, rgba(14,165,233,0.20) 0%, rgba(79,70,229,0.09) 55%, transparent 75%)",
        filter: "blur(20px)",
      }}
    />

    {/* Gradient border */}
    <div
      className="relative rounded-[20px] p-[2px]"
      style={{
        background: "linear-gradient(135deg, #0ea5e9, #4f46e5, #06b6d4)",
        boxShadow: "0 8px 40px rgba(14,165,233,0.22), 0 2px 12px rgba(79,70,229,0.14)",
      }}
    >
      {/* Inner white buffer */}
      <div className="rounded-[18px] p-[2px] bg-white">
        {/* Photo — portrait ratio, showing head + upper body */}
        <div
          className={`overflow-hidden rounded-[16px] ${
            mobile
              ? "w-32 h-40"
              : "w-44 h-56 lg:w-52 lg:h-64 xl:w-56 xl:h-72"
          }`}
        >
          <PictureImg
            src={photoSrc}
            alt="Osama Sharaf"
            fetchpriority="high"
            decoding="sync"
            width={mobile ? 128 : 224}
            height={mobile ? 160 : 288}
            className="w-full h-full object-cover object-top"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </div>

    {/* Online badge */}
    <div
      className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(34,197,94,0.3)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
      />
      <span className="text-[10px] font-semibold text-slate-600">Available</span>
    </div>
  </div>
));

Portrait.displayName = "Portrait";

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
const Hero = () => {
  const { data: heroData } = useHero();
  const typedItemsRef = useRef(HERO_FALLBACK.typed_items);

  const [typedText, setTypedText] = useState("");
  const [itemIndex, setItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    if (Array.isArray(heroData?.typed_items) && heroData.typed_items.length > 0) {
      typedItemsRef.current = heroData.typed_items;
    }
  }, [heroData]);

  useEffect(() => {
    const items = typedItemsRef.current;
    const current = items[itemIndex % items.length] || "";

    if (charIndex < current.length) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        setTypedText(current);
        setCharIndex(current.length);
        return;
      }
      const t = setTimeout(() => {
        setTypedText((p) => p + current[charIndex]);
        setCharIndex((c) => c + 1);
      }, 90);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setItemIndex((i) => (i + 1) % items.length);
      setCharIndex(0);
      setTypedText("");
    }, 1600);
    return () => clearTimeout(t);
  }, [charIndex, itemIndex]);

  return (
    <section
      className="relative w-full h-screen mx-auto overflow-hidden"
      id="hero"
      aria-label="Hero — Osama Sharaf, Full-Stack Developer"
    >
      {/* 3D background — reduced opacity for performance */}
      <div className="absolute inset-0 opacity-25" aria-hidden="true">
        <FloatingTechCanvas />
      </div>

      {/* Light radial overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, rgba(248,250,255,0.3) 0%, rgba(240,247,255,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div
        className={`absolute inset-0 top-[110px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10`}
      >
        {/* Left accent line */}
        <div aria-hidden="true" className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-sky-500" />
          <div
            className="w-1 sm:h-80 h-40"
            style={{ background: "linear-gradient(to bottom, #0ea5e9, transparent)" }}
          />
        </div>

        {/* Text + portrait — row on desktop, column on mobile */}
        <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-14">

          {/* Portrait — CSS order: above text on mobile, right side on desktop */}
          <motion.div
            className="order-first lg:order-last flex-shrink-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Portrait mobile={isMobile} photoSrc={heroData.photo_url || "/my-photo.webp"} />
          </motion.div>

          {/* Text column — left on desktop, below image on mobile */}
          <div className="flex-1 min-w-0 order-last lg:order-first">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sky-500 text-[13px] sm:text-[14px] font-semibold tracking-[0.2em] uppercase mb-2">
                Software Engineer &amp; Full-Stack Developer
              </p>
              <h1 className={styles.heroHeadText}>
                {heroData.greeting || "Hi, I'm"}{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 60%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {heroData.name || "Osama Sharaf"}
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={`${styles.heroSubText} mt-2`} aria-live="polite">
                I&apos;m{" "}
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: "bold",
                    borderBottom: "2px solid rgba(14,165,233,0.4)",
                    paddingBottom: "2px",
                    minWidth: "1ch",
                    display: "inline-block",
                  }}
                >
                  {typedText}
                </span>
                <span aria-hidden="true" style={{ color: "#0ea5e9", opacity: 0.7 }}>
                  |
                </span>
              </p>

              <p className="mt-3 text-slate-500 text-[14px] sm:text-[15px] max-w-[480px] leading-[1.75] font-medium">
                {heroData.subtitle ||
                  "Building modern digital solutions, scalable web applications, and high-performance digital experiences."}
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 mt-7"
            >
              <a href="#portfolio" aria-label="View my portfolio">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className="relative px-6 py-2.5 rounded-xl text-[13px] font-bold tracking-wide text-white overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)",
                    boxShadow: "0 4px 22px rgba(14,165,233,0.30), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    {heroData.cta_primary || "View My Work"}
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
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

        </div>
      </div>


      {/* Scroll indicator */}
      <div
        className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10"
        aria-hidden="true"
      >
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
