import { motion } from "framer-motion";
import React, { memo, useCallback, useRef, useState } from "react";

import { useCertifications } from "../lib/useCertifications";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

const CertCard = memo(({ Achievement, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - rect.top - rect.height / 2) / rect.height) * 8,
      y: -((e.clientX - rect.left - rect.width / 2) / rect.width) * 8,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => { setTilt({ x: 0, y: 0 }); setHovered(false); }, []);

  const title    = Array.isArray(Achievement.title) ? Achievement.title[0] : Achievement.title;
  const iconBg   = Achievement.icon_bg || Achievement.iconBg || "rgba(14,165,233,0.12)";
  const iconSrc  = Achievement.icon_url || Achievement.icon || null;
  const dateLabel = Achievement.date_range || Achievement.date || "";
  const creds    = Achievement.credentials || Achievement.credential || [];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? "8px" : "0px"})`,
        transition: hovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
      }}
      className="relative rounded-2xl overflow-hidden cursor-default"
    >
      <div
        className="relative h-full p-6 bg-white"
        style={{
          border: hovered ? "1.5px solid rgba(14,165,233,0.30)" : "1.5px solid rgba(14,165,233,0.12)",
          boxShadow: hovered
            ? "0 16px 48px rgba(14,165,233,0.15), 0 0 0 1px rgba(79,70,229,0.06)"
            : "0 4px 24px rgba(14,165,233,0.07)",
          borderRadius: 16,
          transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
      >
        {/* Top accent line on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 rounded-t-2xl"
          style={{
            background: "linear-gradient(90deg, #0ea5e9, #4f46e5, #06b6d4)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: iconBg, border: "1.5px solid rgba(14,165,233,0.18)" }}
          >
            {iconSrc ? (
              <img src={iconSrc} alt={title} className="w-8 h-8 object-contain" loading="lazy" decoding="async" />
            ) : (
              <span className="text-sky-600 font-bold text-lg">{title?.[0]?.toUpperCase()}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-slate-800 font-bold text-[16px] leading-snug">{title}</h3>
            {Achievement.company_name && (
              <p className="text-sky-500 text-[12px] font-semibold mt-0.5 uppercase tracking-wide">
                {Achievement.company_name}
              </p>
            )}
          </div>

          {dateLabel && (
            <div
              className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap"
              style={{ background: "rgba(14,165,233,0.08)", color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.20)" }}
            >
              {dateLabel}
            </div>
          )}
        </div>

        <div className="w-full h-px mb-4" style={{ background: "rgba(14,165,233,0.10)" }} />

        {/* Points */}
        <ul className="space-y-2.5">
          {(Achievement.points || []).map((point, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px] bg-sky-400" />
              <div className="flex-1">
                <p className="text-slate-500 text-[13px] leading-relaxed">{point}</p>
                {creds?.[i] && (
                  <a
                    href={creds[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-sky-500 hover:text-sky-700 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Credential
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div
          className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl transition-opacity duration-300"
          style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)", opacity: hovered ? 1 : 0 }}
        />
      </div>
    </motion.div>
  );
});

CertCard.displayName = "CertCard";

const Achievement = () => {
  const { data: certifications } = useCertifications();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          Professional credentials &amp; accomplishments
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Certifications.</h2>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <CertCard key={cert.id || index} Achievement={cert} index={index} />
        ))}
      </div>

      <span id="skills" />
    </>
  );
};

export default SectionWrapper(Achievement, "achievements");
