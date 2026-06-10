import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useSkills } from "../lib/useSkills";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const FALLBACK_GROUPS = [
  { category: "Frontend", icon: "🎨", skillList: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 & CSS3"] },
  { category: "Backend", icon: "⚙️", skillList: ["Node.js", "Express.js", "Python", "Django", "REST APIs"] },
  { category: "Database", icon: "🗄️", skillList: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Redis"] },
  { category: "DevOps & Cloud", icon: "🚀", skillList: ["Docker", "Vercel", "Netlify", "GitHub Actions", "CI/CD"] },
  { category: "Tools", icon: "🛠️", skillList: ["Git & GitHub", "VS Code", "Figma", "Postman", "Linux"] },
  { category: "AI & Modern", icon: "🤖", skillList: ["OpenAI API", "LangChain", "Prompt Engineering", "Machine Learning"] },
];

const CARD_COLORS = [
  { accent: "#915EFF", glow: "rgba(145,94,255,0.12)" },
  { accent: "#8ec5ff", glow: "rgba(142,197,255,0.12)" },
  { accent: "#34d399", glow: "rgba(52,211,153,0.12)" },
  { accent: "#f472b6", glow: "rgba(244,114,182,0.12)" },
  { accent: "#fb923c", glow: "rgba(251,146,60,0.12)" },
  { accent: "#a78bfa", glow: "rgba(167,139,250,0.12)" },
];

const SkillCard = ({ index, category, icon, skillList }) => {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.08, 0.6)}
      className="relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden"
      style={{
        background: "rgba(10,12,22,0.82)",
        border: `1.5px solid ${color.accent}22`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color.accent}11`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color.accent}, transparent)` }}
      />
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: color.glow, border: `1px solid ${color.accent}33` }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-[17px] text-white">{category}</h3>
      </div>
      <ul className="space-y-2">
        {skillList.map((skill, i) => (
          <li key={i} className="flex items-center gap-2.5 text-[#aaa6c3] text-[13px]">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: color.accent }}
            />
            {skill}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const SkillKeyboard = () => {
  const { skills: rawSkills } = useSkills();

  const groups = useMemo(() => {
    if (!rawSkills || rawSkills.length === 0) return FALLBACK_GROUPS;
    const map = {};
    rawSkills.forEach((s) => {
      const cat = s.category || "General";
      if (!map[cat]) map[cat] = { category: cat, icon: s.icon || "💡", skillList: [] };
      const name = s.name || s.title || s.label || "";
      if (name) map[cat].skillList.push(name);
    });
    const result = Object.values(map);
    return result.length > 0 ? result : FALLBACK_GROUPS;
  }, [rawSkills]);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>What I work with</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Technical Skills.</h2>
      </motion.div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group, i) => (
          <SkillCard key={group.category} index={i} {...group} />
        ))}
      </div>
      <span id="projects" />
    </>
  );
};

export default SectionWrapper(SkillKeyboard, "skills-section");
