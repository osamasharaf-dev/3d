import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Ring = ({ delay, size }) => (
  <motion.div
    aria-hidden="true"
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      border: "1px solid rgba(145,94,255,0.22)",
      top: "50%",
      left: "50%",
      x: "-50%",
      y: "-50%",
    }}
    initial={{ scale: 0.6, opacity: 0.7 }}
    animate={{ scale: 2.8, opacity: 0 }}
    transition={{
      duration: 1.6,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const CinematicIntro = () => {
  const [phase, setPhase] = useState("in"); // in | out | done
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    const t1 = setTimeout(() => setPhase("out"), 720);
    const t2 = setTimeout(() => {
      doneRef.current = true;
      setPhase("done");
    }, 1180);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      key="cinematic-intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020510 0%, #050816 60%, #0a0522 100%)" }}
    >
      {/* Expanding rings */}
      <Ring delay={0}    size={130} />
      <Ring delay={0.22} size={130} />
      <Ring delay={0.44} size={130} />

      {/* Subtle noise grain */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px" }}
      />

      {/* Logo container */}
      <motion.div
        className="relative flex flex-col items-center gap-5 z-10"
        initial={{ scale: 0.82, opacity: 0, y: 10 }}
        animate={{ scale: phase === "out" ? 1.08 : 1, opacity: phase === "out" ? 0 : 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow halo */}
        <div aria-hidden="true" className="absolute -inset-12 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(145,94,255,0.22) 0%, transparent 70%)", filter: "blur(20px)" }}
        />

        {/* Monogram circle */}
        <div className="relative">
          {/* Gradient ring */}
          <div aria-hidden="true" className="absolute -inset-[3px] rounded-full"
            style={{ background: "linear-gradient(135deg, #915EFF, #8ec5ff, #915EFF)", filter: "blur(2px)", opacity: 0.7 }}
          />
          <div className="relative w-[86px] h-[86px] rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #1a0533 0%, #2a0e5c 50%, #0c1d3a 100%)",
              border: "1.5px solid rgba(145,94,255,0.4)",
              boxShadow: "0 0 40px rgba(145,94,255,0.28), 0 0 80px rgba(145,94,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-[26px] font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #c4b5fd, #8ec5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >OS</span>
          </div>
        </div>

        {/* Name + title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.38 }}
        >
          <p className="text-white text-[14px] font-bold tracking-[0.22em] uppercase select-none">
            Osama Sharaf
          </p>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div className="h-px w-6 opacity-30"
              style={{ background: "linear-gradient(90deg, transparent, #915EFF)" }}
            />
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase select-none"
              style={{ color: "#9b72ff", opacity: 0.75 }}>
              Software Engineer
            </p>
            <div className="h-px w-6 opacity-30"
              style={{ background: "linear-gradient(90deg, #8ec5ff, transparent)" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CinematicIntro;
