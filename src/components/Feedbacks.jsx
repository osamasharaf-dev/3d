import React, { memo } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useProfessionalSkills } from "../lib/useProfessionalSkills";

const SkillCategoryCard = memo(({ index, category, icon, color, skills }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="bg-white p-6 sm:p-8 rounded-3xl w-full transition-all duration-300"
    style={{
      border: `1.5px solid ${color}22`,
      boxShadow: `0 4px 24px rgba(0,0,0,0.05), 0 0 0 1px ${color}11`,
    }}
    whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(0,0,0,0.08), 0 0 0 1.5px ${color}33` }}
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="text-4xl">{icon}</span>
      <h3 className="font-bold text-[20px]" style={{ color }}>{category}</h3>
    </div>
    <ul className="mt-4 space-y-2">
      {(skills || []).map((skill, i) => (
        <li key={i} className="flex items-center gap-2 text-slate-600 text-[15px]">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          {skill}
        </li>
      ))}
    </ul>
  </motion.div>
));

SkillCategoryCard.displayName = "SkillCategoryCard";

const Feedbacks = () => {
  const { data: professionalSkills } = useProfessionalSkills();

  return (
    <div
      className="mt-12 rounded-[24px] overflow-hidden"
      style={{ background: "linear-gradient(135deg, #eef3ff 0%, #f0f7ff 100%)" }}
    >
      <div
        className={`rounded-2xl ${styles.padding} min-h-[300px]`}
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)" }}
      >
        <motion.div variants={textVariant()}>
          <p className="text-sky-100 text-[14px] sm:text-[18px] uppercase tracking-wider font-semibold">
            Soft skills & mindset
          </p>
          <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
            Professional Skills.
          </h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
        {professionalSkills.map((item, index) => (
          <SkillCategoryCard key={item.id || item.category} index={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "testimonials");
