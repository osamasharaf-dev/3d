import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiCode, FiCpu, FiClock, FiUsers } from "react-icons/fi";

const STATS = [
  { value: 20, suffix: "+", label: "Projects Completed",   icon: FiCode,  color: "#915EFF", glow: "rgba(145,94,255,0.25)" },
  { value: 15, suffix: "+", label: "Clients Served",       icon: FiUsers, color: "#8ec5ff", glow: "rgba(142,197,255,0.22)" },
  { value: 3,  suffix: "+", label: "Years of Experience",  icon: FiClock, color: "#a78bfa", glow: "rgba(167,139,250,0.22)" },
  { value: 30, suffix: "+", label: "Technologies Mastered",icon: FiCpu,   color: "#67e8f9", glow: "rgba(103,232,249,0.18)" },
];

const useCounter = (target, duration = 1200, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let cur = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(cur));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);

  return count;
};

const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useCounter(stat.value, 1100, inView);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div
        className="relative rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all duration-400 overflow-hidden cursor-default"
        style={{
          background: "rgba(10,12,20,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1.5px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${stat.color}44`;
          e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 30px ${stat.glow}`;
          e.currentTarget.style.background = "rgba(17,21,34,0.92)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
          e.currentTarget.style.background = "rgba(10,12,20,0.75)";
        }}
      >
        {/* Top shimmer */}
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${stat.color}88, transparent)` }}
        />

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${stat.glow}`, border: `1px solid ${stat.color}33` }}
        >
          <Icon size={22} style={{ color: stat.color }} />
        </div>

        {/* Number */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl font-black tabular-nums"
            style={{ background: `linear-gradient(135deg, ${stat.color}, #fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {count}
          </span>
          <span className="text-2xl font-black" style={{ color: stat.color }}>{stat.suffix}</span>
        </div>

        {/* Label */}
        <p className="text-[#aaa6c3] text-[13px] font-medium leading-snug max-w-[120px]">
          {stat.label}
        </p>

        {/* Bottom bar */}
        <div className="w-8 h-0.5 rounded-full mt-1 opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-400"
          style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
};

const StatsSection = () => (
  <section className="w-full py-14" aria-label="Statistics">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
