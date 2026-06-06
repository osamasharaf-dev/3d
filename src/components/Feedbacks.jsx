import React, { memo } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const professionalSkills = [
  {
    category: "Communication & Teamwork",
    icon: "🤝",
    color: "#8ec5ff",
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
    color: "#a78bfa",
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
    color: "#34d399",
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

const SkillCategoryCard = memo(({ index, category, icon, color, skills }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="bg-[#0f0f0f] p-10 rounded-3xl xs:w-[320px] w-full border border-white/[0.06] hover:border-white/[0.12] transition-all duration-400"
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="text-4xl">{icon}</span>
      <h3 className="font-bold text-[20px]" style={{ color }}>
        {category}
      </h3>
    </div>
    <ul className="mt-4 space-y-2">
      {skills.map((skill, i) => (
        <li key={i} className="flex items-center gap-2 text-secondary text-[15px]">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          {skill}
        </li>
      ))}
    </ul>
  </motion.div>
));

SkillCategoryCard.displayName = "SkillCategoryCard";

const Feedbacks = () => {
  return (
    <div className="mt-12 bg-[#0a0c14] rounded-[20px]">
      <div className={`bg-[#111522] rounded-2xl ${styles.padding} min-h-[300px]`}>
        <motion.div variants={textVariant()}>
          <p className={`text-[#8ec5ff] ${styles.sectionSubText}`}>
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
