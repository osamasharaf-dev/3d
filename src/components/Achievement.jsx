import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

import { achievements } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

const CertCard = ({ Achievement, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 10,
      y: -((e.clientX - cx) / rect.width) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const title = Array.isArray(Achievement.title)
    ? Achievement.title[0]
    : Achievement.title;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? "8px" : "0px"})`,
        transition: hovered
          ? "transform 0.1s ease-out"
          : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
      }}
      className="relative rounded-2xl overflow-hidden cursor-default"
    >
      {/* Dark glass card */}
      <div
        className="relative h-full p-6"
        style={{
          background: hovered
            ? "rgba(17, 21, 34, 0.95)"
            : "rgba(11, 13, 22, 0.80)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: hovered
            ? "1.5px solid rgba(145,94,255,0.35)"
            : "1.5px solid rgba(255,255,255,0.07)",
          boxShadow: hovered
            ? "0 20px 50px rgba(0,0,0,0.55), 0 0 30px rgba(145,94,255,0.12)"
            : "0 8px 30px rgba(0,0,0,0.35)",
          transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Shimmer on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(145,94,255,0.7), rgba(142,197,255,0.5), transparent)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: Achievement.iconBg || "rgba(145,94,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={Achievement.icon}
              alt={title}
              className="w-8 h-8 object-contain"
              loading="lazy"
            />
          </div>

          {/* Title + company */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[#8eadff] font-bold text-[16px] leading-snug">
              {title}
            </h3>
            {Achievement.company_name && (
              <p className="text-[#915EFF] text-[12px] font-semibold mt-0.5 uppercase tracking-wide">
                {Achievement.company_name}
              </p>
            )}
          </div>

          {/* Date badge */}
          {Achievement.date && (
            <div
              className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap"
              style={{
                background: "rgba(145,94,255,0.15)",
                color: "#c4b5fd",
                border: "1px solid rgba(145,94,255,0.25)",
              }}
            >
              {Achievement.date}
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-4"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        {/* Points */}
        <ul className="space-y-2.5">
          {Achievement.points.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]"
                style={{ background: "#915EFF" }}
              />
              <div className="flex-1">
                <p className="text-[#aaa6c3] text-[13px] leading-relaxed">
                  {point}
                </p>
                {Achievement.credential?.[i] && (
                  <a
                    href={Achievement.credential[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold transition-colors duration-200 text-blue-400 hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Credential
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Bottom glow line on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(145,94,255,0.5), transparent)",
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};

const Achievement = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          Professional credentials & accomplishments
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Certifications.
        </h2>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <CertCard key={index} Achievement={achievement} index={index} />
        ))}
      </div>

      <span id="skills" />
    </>
  );
};

export default SectionWrapper(Achievement, "achievements");
