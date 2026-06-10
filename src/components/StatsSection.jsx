import { motion, useInView } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { FiCode, FiCpu, FiClock, FiUsers } from "react-icons/fi";

const STATS = [
  { value: 20, suffix: "+", label: "Projects Completed",    icon: FiCode,  color: "#0ea5e9", glow: "rgba(14,165,233,0.15)" },
  { value: 15, suffix: "+", label: "Clients Served",        icon: FiUsers, color: "#4f46e5", glow: "rgba(79,70,229,0.12)"  },
  { value: 3,  suffix: "+", label: "Years of Experience",   icon: FiClock, color: "#06b6d4", glow: "rgba(6,182,212,0.12)"  },
  { value: 30, suffix: "+", label: "Technologies Mastered", icon: FiCpu,   color: "#0ea5e9", glow: "rgba(14,165,233,0.12)" },
];

const useCounter = (target, duration = 1000, start = false) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, duration]);

  return count;
};

const StatCard = memo(({ stat, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useCounter(stat.value, 900, inView);
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
        className="relative rounded-2xl p-6 flex flex-col items-center gap-3 text-center overflow-hidden cursor-default bg-white"
        style={{
          border: `1.5px solid ${stat.color}18`,
          boxShadow: "0 4px 24px rgba(14,165,233,0.07)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${stat.color}40`;
          e.currentTarget.style.boxShadow = `0 12px 40px ${stat.glow}, 0 0 0 1px ${stat.color}22`;
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = `${stat.color}18`;
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(14,165,233,0.07)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${stat.color}66, transparent)` }}
        />

        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: stat.glow, border: `1px solid ${stat.color}25` }}>
          <Icon size={22} style={{ color: stat.color }} />
        </div>

        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl font-black tabular-nums"
            style={{ background: `linear-gradient(135deg, ${stat.color}, #0f172a)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {count}
          </span>
          <span className="text-2xl font-black" style={{ color: stat.color }}>{stat.suffix}</span>
        </div>

        <p className="text-slate-500 text-[13px] font-medium leading-snug max-w-[120px]">{stat.label}</p>

        <div className="w-8 h-0.5 rounded-full mt-1 opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-400"
          style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
});
StatCard.displayName = "StatCard";

const StatsSection = () => (
  <section className="w-full py-14" aria-label="Statistics">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>
    </div>
  </section>
);

export default StatsSection;
