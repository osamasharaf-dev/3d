import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PictureImg from "./ui/PictureImg";

import { useProjects } from "../lib/useProjects";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

const TAG_COLORS = {
  "blue-text-gradient":   { bg: "rgba(14,165,233,0.10)",  text: "#0ea5e9",  border: "rgba(14,165,233,0.22)"  },
  "green-text-gradient":  { bg: "rgba(16,185,129,0.10)",  text: "#059669",  border: "rgba(16,185,129,0.22)"  },
  "pink-text-gradient":   { bg: "rgba(236,72,153,0.10)",  text: "#db2777",  border: "rgba(236,72,153,0.22)"  },
  "violet-text-gradient": { bg: "rgba(79,70,229,0.10)",   text: "#4f46e5",  border: "rgba(79,70,229,0.22)"   },
  "orange-text-gradient": { bg: "rgba(249,115,22,0.10)",  text: "#ea580c",  border: "rgba(249,115,22,0.22)"  },
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
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(10px)" }}
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
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white"
        style={{
          border: "1.5px solid rgba(14,165,233,0.2)",
          boxShadow: "0 32px 80px rgba(14,165,233,0.18), 0 0 0 1px rgba(14,165,233,0.08)",
          scrollbarWidth: "none",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, #0ea5e9, #4f46e5, #06b6d4)" }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-sky-50"
          style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)" }}
        >
          <FiX size={16} className="text-sky-600" />
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
            />
          </AnimatePresence>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />

          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 bg-white/90 border border-slate-200">
                <FiChevronLeft size={16} className="text-slate-700" />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)} aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 bg-white/90 border border-slate-200">
                <FiChevronRight size={16} className="text-slate-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} aria-label={`Image ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ background: i === imgIdx ? "#0ea5e9" : "rgba(14,165,233,0.3)", width: i === imgIdx ? "20px" : "6px" }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-slate-900 font-bold text-[22px] sm:text-[26px] leading-tight mb-2">{project.name}</h2>
          <p className="text-slate-500 text-[14px] leading-relaxed mb-5">{project.description}</p>

          {project.features && (
            <div className="mb-5">
              <p className="text-sky-500 text-[11px] font-bold uppercase tracking-widest mb-3">Key Features</p>
              <ul className="space-y-1.5">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

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

          <div className="flex flex-wrap gap-3">
            <a href={project.source_code_link} target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                <FiGithub size={15} />
                View Code
              </motion.button>
            </a>
            {project.live_demo_link && project.live_demo_link !== "#" && (
              <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #4f46e5)", boxShadow: "0 4px 18px rgba(14,165,233,0.28)" }}>
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
  const tiltRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x =  ((e.clientY - rect.top  - rect.height / 2) / rect.height) * 5;
    const y = -((e.clientX - rect.left - rect.width  / 2) / rect.width)  * 5;
    el.style.transform = `perspective(1100px) rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg) translateZ(6px)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (tiltRef.current) tiltRef.current.style.transition = "transform 0.08s ease-out";
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = tiltRef.current;
    if (el) {
      el.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
    setHovered(false);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.name} details`}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      style={{ cursor: "pointer" }}
      className="group relative rounded-2xl overflow-hidden"
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="rounded-2xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: hovered ? "0 20px 48px rgba(14,165,233,0.15)" : "0 4px 24px rgba(14,165,233,0.07)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Image */}
        <div className="relative h-[200px] overflow-hidden">
          <PictureImg
            src={project.image}
            alt={`${project.name} preview`}
            loading="lazy"
            decoding="async"
            width={400}
            height={200}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="px-4 py-2 rounded-xl text-[12px] font-bold text-white backdrop-blur-sm"
              style={{ background: "rgba(14,165,233,0.85)", border: "1px solid rgba(14,165,233,0.5)" }}
            >
              View Details
            </motion.div>
          </div>

          <div className="absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-sky-600 bg-white/90 border border-sky-100">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Card body */}
        <div className="p-5 bg-white"
          style={{
            borderLeft: hovered ? "1.5px solid rgba(14,165,233,0.28)" : "1.5px solid rgba(14,165,233,0.12)",
            borderRight: hovered ? "1.5px solid rgba(14,165,233,0.28)" : "1.5px solid rgba(14,165,233,0.12)",
            borderBottom: hovered ? "1.5px solid rgba(14,165,233,0.28)" : "1.5px solid rgba(14,165,233,0.12)",
            transition: "border-color 0.3s ease",
          }}
        >
          <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400"
            style={{ background: "linear-gradient(90deg, transparent, #0ea5e9, #4f46e5, transparent)", opacity: hovered ? 1 : 0 }}
          />
          <h3 className="text-slate-900 font-bold text-[17px] leading-snug mb-2 tracking-tight">{project.name}</h3>
          <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 mb-4">{project.description}</p>
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
            style={{ background: "linear-gradient(90deg, #0ea5e9, #4f46e5)" }}
          />
        </div>
      </div>
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
        className="mt-4 text-slate-500 text-[16px] max-w-2xl leading-[28px]"
      >
        A selection of real-world applications built with modern technologies —
        each project demonstrates clean architecture, performance, and thoughtful UX.
        <span className="text-sky-400 text-[13px] ml-2">Click any card to explore.</span>
      </motion.p>

      {loading ? (
        <div className="mt-14 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
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

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Projects, "portfolio");
