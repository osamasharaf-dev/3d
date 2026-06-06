import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import useParallax from "../reactbits/hooks/useParallax";
import { styles } from "../styles";
import useMediaQuery from "../utils/useMediaQuery";
import { ComputersCanvas } from "./canvas";

const FloatingPortraitCard = () => {
  const cardRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 120, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set(((e.clientY - cy) / rect.height) * 14);
    rawY.set(-((e.clientX - cx) / rect.width) * 14);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative cursor-pointer select-none"
    >
      {/* Glow orb behind card */}
      <div
        className="absolute -inset-6 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(145,94,255,0.55) 0%, rgba(142,197,255,0.2) 60%, transparent 80%)",
        }}
      />

      {/* Dark glass card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(7, 8, 13, 0.72)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1.5px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(145,94,255,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
          width: "220px",
          padding: "28px 24px 24px",
        }}
      >
        {/* Shimmer top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(145,94,255,0.7), rgba(142,197,255,0.5), transparent)",
          }}
        />

        <div className="flex flex-col items-center gap-4">
          {/* Avatar ring + circle */}
          <div className="relative">
            <div
              className="absolute -inset-1.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #915EFF, #8ec5ff, #915EFF)",
              }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #1a0533 0%, #2d1060 50%, #0d1f40 100%)",
              }}
            >
              <span
                className="text-3xl font-black tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #915EFF, #8ec5ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                OS
              </span>
            </div>
            {/* Online dot */}
            <div
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2"
              style={{
                background: "#22c55e",
                borderColor: "rgba(7,8,13,0.9)",
              }}
            />
          </div>

          {/* Name & title */}
          <div className="text-center">
            <p className="text-white font-bold text-[15px] tracking-wide">
              OSAMA SHARAF
            </p>
            <p className="text-[#915EFF] text-[11px] font-semibold tracking-wider uppercase mt-0.5">
              Software Engineer
            </p>
          </div>

          {/* Skill badges */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {["React", "Node.js", "Full-Stack"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(145,94,255,0.15)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(145,94,255,0.30)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          {/* Status */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#22c55e" }}
            />
            <span className="text-[11px] text-[#aaa6c3] font-medium">
              Available for work
            </span>
          </div>
        </div>

        {/* Corner accent */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #915EFF 0%, transparent 70%)",
          }}
        />
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const typedItems = [
    "Full-Stack Developer",
    "Software Engineer",
    "Web Architect",
    "Problem Solver",
  ];
  const [itemIndex, setItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { style: parallaxStyle } = useParallax({
    strength: 0.03,
    maxOffset: 15,
    enabled: !isMobile,
  });

  useEffect(() => {
    const typeItem = () => {
      if (charIndex < typedItems[itemIndex].length) {
        setTypedText((prev) => prev + typedItems[itemIndex][charIndex]);
        setCharIndex((c) => c + 1);
      } else {
        setTimeout(() => {
          setItemIndex((i) => (i + 1) % typedItems.length);
          setCharIndex(0);
          setTypedText("");
        }, 1000);
      }
    };

    const interval = setInterval(typeItem, 100);
    return () => clearInterval(interval);
  }, [charIndex, itemIndex]);

  return (
    <section className="relative w-full h-screen mx-auto" id="hero">
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        {/* Left accent line */}
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        {/* Text content */}
        <div
          className="flex-1 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12"
          style={parallaxStyle}
        >
          <div className="flex-1">
            <h1 className={styles.heroHeadText}>
              Hi, I'm{" "}
              <span className="text-[#915EFF]">Osama Sharaf</span>
            </h1>
            <p className={`${styles.heroSubText} mt-2`}>
              I'm{" "}
              <span
                className="typed"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(245, 202, 153, 0.5), rgba(245, 202, 153, 0.5))",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 8px",
                  backgroundPosition: "0 100%",
                  color: "#915EFF",
                  display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                {typedText}
              </span>
              <span
                className="typed-cursor"
                aria-hidden="true"
                style={{ color: "#915EFF" }}
              >
                |
              </span>
              <br />
              <b>
                Building modern digital solutions, scalable web applications,
                and high-performance digital experiences.
              </b>
            </p>
          </div>

          {/* Portrait card — desktop only */}
          {!isMobile && (
            <div className="hidden lg:flex items-center justify-center flex-shrink-0 mr-8 mt-4">
              <FloatingPortraitCard />
            </div>
          )}
        </div>
      </div>

      <ComputersCanvas />

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
