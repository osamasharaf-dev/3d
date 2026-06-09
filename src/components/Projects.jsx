import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useProjects } from "../lib/useProjects";
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

/* ── Project Modal ────────────────────────────────────────── */
const ProjectModal = memo(({ project, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = project.images || [project.image];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImgIdx(i => (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setImgIdx(i => (i - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, images.length]);

  return (
    <motion.div
      key="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[9980] flex items-center justify-center p-4"
      style={{ background: "rgba(2,5,16,0.80)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl"
        style={{
          background: "rgba(8,10,20,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(145,94,255,0.22)",
          boxShadow: "0 32px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(145,94,255,0.08)",
          scrollbarWidth: "none",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top shimmer */}
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(145,94,255,0.7), rgba(142,197,255,0.5), transparent)" }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <FiX size={16} className="text-white/70" />
        </button>

        {/* Image gallery */}
        <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIdx}
              src={images[imgIdx]}
              alt={`${project.name} screenshot ${imgIdx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ filter: "brightness(0.88) saturate(1.05)" }}
            />
          </AnimatePresence>
          {/* Gradient overlay */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#08090f] via-transparent to-transparent" />

          {/* Gallery nav — show only if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105"
                style={{ background: "rgba(7,8,13,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <FiChevronLeft size={16} className="text-white" />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105"
                style={{ background: "rgba(7,8,13,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <FiChevronRight size={16} className="text-white" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Image ${i + 1}`}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i === imgIdx ? "#915EFF" : "rgba(255,255,255,0.35)",
                      width: i === imgIdx ? "20px" : "6px",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-white font-bold text-[22px] sm:text-[26px] leading-tight mb-2">
            {project.name}
          </h2>
          <p className="text-[#aaa6c3] text-[14px] leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Features if available */}
          {project.features && (
            <div className="mb-5">
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-3">
                Key Features
              </p>
              <ul className="space-y-1.5">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#aaa6c3]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#915EFF] mt-1.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => {
              const c = TAG_COLORS[tag.color] || TAG_COLORS["violet-text-gradient"];
              return (
                <span key={tag.name} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                  {tag.name}
                </span>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <a href={project.source_code_link} target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.14)" }}
              >
                <FiGithub size={15} />
                View Code
              </motion.button>
            </a>
            {project.live_demo_link && project.live_demo_link !== "#" && (
              <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)", boxShadow: "0 4px 18px rgba(145,94,255,0.28)" }}
                >
                  <FiExternalLink size={15} />
                  Live Preview
                </motion.button>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
ProjectModal.displayName = "ProjectModal";

/* ── Project Card ─────────────────────────────────────────── */
const ProjectCard = memo(({ project, index, onClick }) => {
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
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.name} details`}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px)`,
        transition: hovered ? "transform 0.08s ease-out" : "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
        transformStyle: "preserve-3d",
        cursor: "pointer",
      }}
      className="group relative rounded-2xl overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={project.image}
          alt={`${project.name} preview`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ filter: "brightness(0.82) saturate(1.08)" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/40 to-transparent" />

        {/* Click to open hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="px-4 py-2 rounded-xl text-[12px] font-bold text-white backdrop-blur-sm"
            style={{ background: "rgba(145,94,255,0.75)", border: "1px solid rgba(145,94,255,0.5)" }}
          >
            View Details
          </motion.div>
        </div>

        {/* Index badge */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white/70 backdrop-blur-sm"
          style={{ background: "rgba(7,8,13,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5"
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
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(145,94,255,0.7), rgba(142,197,255,0.5), transparent)",
            opacity: hovered ? 1 : 0,
          }}
        />
        <h3 className="text-white font-bold text-[17px] leading-snug mb-2 tracking-tight">
          {project.name}
        </h3>
        <p className="text-[#aaa6c3] text-[13px] leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => {
            const c = TAG_COLORS[tag.color] || TAG_COLORS["violet-text-gradient"];
            return (
              <span key={tag.name} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                {tag.name}
              </span>
            );
          })}
        </div>
        <div className="mt-4 h-[1.5px] w-0 group-hover:w-10 rounded-full transition-all duration-500 ease-out"
          style={{ background: "linear-gradient(90deg, #915EFF, #8ec5ff)" }}
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "0 0 44px rgba(145,94,255,0.12) inset" }}
      />
    </motion.article>
  );
});
ProjectCard.displayName = "ProjectCard";

/* ── Projects Section ──────────────────────────────────────── */
const Projects = () => {
  const [selected, setSelected] = useState(null);
  const { projects, loading } = useProjects();

  return (
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
        <span className="text-[#915EFF]/60 text-[13px] ml-2">Click any card to explore.</span>
      </motion.p>

      {loading ? (
        <div className="mt-14 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#915EFF] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || project.name}
              project={project}
              index={index}
              onClick={() => setSelected(project)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Projects, "portfolio");
