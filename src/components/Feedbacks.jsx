import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const professionalSkills = [
  {
    category: "Communication & Teamwork",
    icon: "🤝",
    color: "#3b82f6",
    skills: [
      "Effective Communication",
      "Team Collaboration",
      "Client Interaction",
      "Leadership & Coordination",
    ],
  },
  {
    category: "Problem Solving",
    icon: "🧠",
    color: "#7c3aed",
    skills: [
      "Analytical Thinking",
      "Technical Troubleshooting",
      "Strategic Planning",
      "Decision Making",
    ],
  },
  {
    category: "Work Excellence",
    icon: "⚡",
    color: "#059669",
    skills: [
      "Time Management",
      "Adaptability",
      "Working Under Pressure",
      "Attention to Detail",
      "Continuous Learning",
      "Fast Problem Resolution",
    ],
  },
];

const SkillCategoryCard = ({ index, category, icon, color, skills }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="xs:w-[320px] w-full rounded-3xl overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1.5px solid rgba(255,255,255,0.9)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)",
    }}
  >
    <div
      className="p-10"
      style={{
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{icon}</span>
        <h3 className="font-bold text-[20px]" style={{ color }}>
          {category}
        </h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {skills.map((skill, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-[#475569] text-[15px]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <div
      className="mt-12 rounded-[20px]"
      style={{ background: "#eaecf5" }}
    >
      <div
        className={`rounded-2xl ${styles.padding} min-h-[300px]`}
        style={{
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <motion.div variants={textVariant()}>
          <p
            className={styles.sectionSubText}
            style={{ color: "#7c3aed" }}
          >
            Soft skills & mindset
          </p>
          <h2 className={styles.sectionHeadText}>Professional Skills.</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {professionalSkills.map((item, index) => (
          <SkillCategoryCard key={item.category} index={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "testimonials");
