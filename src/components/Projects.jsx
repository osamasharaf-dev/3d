import { motion } from "framer-motion";
import React, { memo, useCallback, useRef, useState } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

import { projects } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

const TAG_COLORS = {
  "blue-text-gradient":   { bg: "rgba(59,130,246,0.13)",  text: "#60a5fa",  border: "rgba(59,130,246,0.28)"  },
  "green-text-gradient":  { bg: "rgba(34,197,94,0.11)",   text: "#4ade80",  border: "rgba(34,197,94,0.28)"   },
  "pink-text-gradient":   { bg: "rgba(236,72,153,0.11)",  text: "#f472b6",  border: "rgba(236,72,153,0.28)"  },
  "violet-text-gradient": { bg: "rgba(145,94,255,0.14)",  text: "#c4b5fd",  border: "rgba(145,94,255,0.28)"  },
  "orange-text-gradient": { bg: "rgba(249,115,22,0.11)",  text: "#fb923c",  border: "rgba(249,115,22,0.28)"  },
};

const ProjectCard = memo(({ project, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({
      x:  ((e.clientY - rect.top  - rect.height / 2) / rect.height) * 7,
      y: -((e.clientX - rect.left - rect.width  / 2) / rect.width)  * 7,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px)`,
        transition: hovered
          ? "transform 0.08s ease-out"
          : "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-2xl overflow-hidden cursor-default"
      aria-label={`Project: ${project.name}`}
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ filter: "brightness(0.82) saturate(1.08)" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/45 to-transparent" />

        {/* Action buttons — appear on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <a
            href={project.source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} GitHub`}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                background: "rgba(5,8,22,0.88)",
                border: "1.5px solid rgba(255,255,255,0.22)",
              }}
            >
              <FaGithub className="text-white text-lg" />
            </motion.div>
          </a>

          {project.live_demo_link && project.live_demo_link !== "#" && (
            <a
              href={project.live_demo_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} live demo`}
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(145,94,255,0.88)",
                  border: "1.5px solid rgba(145,94,255,0.5)",
                }}
              >
                <FaExternalLinkAlt className="text-white text-sm" />
              </motion.div>
            </a>
          )}
        </div>

        {/* Index badge */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white/70 backdrop-blur-sm"
          style={{ background: "rgba(7,8,13,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Card body */}
      <div
        className="p-5"
        style={{
          background: hovered ? "rgba(17,21,34,0.98)" : "rgba(10,12,20,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1.5px solid",
          borderColor: hovered ? "rgba(145,94,255,0.32)" : "rgba(255,255,255,0.07)",
          borderTop: "none",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Top line shimmer on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(145,94,255,0.7), rgba(142,197,255,0.5), transparent)",
            opacity: hovered ? 1 : 0,
          }}
        />

        <h3 className="text-white font-bold text-[17px] leading-snug mb-2 tracking-tight group-hover:text-blue-50 transition-colors duration-300">
          {project.name}
        </h3>

        <p className="text-[#aaa6c3] text-[13px] leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => {
            const c = TAG_COLORS[tag.color] || TAG_COLORS["violet-text-gradient"];
            return (
              <span
                key={tag.name}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
              >
                {tag.name}
              </span>
            );
          })}
        </div>

        {/* Bottom accent bar */}
        <div
          className="mt-4 h-[1.5px] w-0 group-hover:w-10 rounded-full transition-all duration-500 ease-out"
          style={{ background: "linear-gradient(90deg, #915EFF, #8ec5ff)" }}
        />
      </div>

      {/* Outer glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-600"
        style={{ boxShadow: "0 0 44px rgba(145,94,255,0.13) inset" }}
      />
    </motion.article>
  );
});

ProjectCard.displayName = "ProjectCard";

const Projects = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>What I have built</p>
      <h2 className={styles.sectionHeadText}>Portfolio.</h2>
    </motion.div>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-4 text-secondary text-[16px] max-w-2xl leading-[28px]"
    >
      A selection of real-world applications built with modern technologies —
      each project demonstrates clean architecture, performance, and thoughtful UX.
    </motion.p>

    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.name} project={project} index={index} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Projects, "portfolio");
