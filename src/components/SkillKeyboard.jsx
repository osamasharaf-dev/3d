import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useSkills } from "../lib/useSkills";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const FALLBACK_GROUPS = [
  { category: "Frontend",       icon: "🎨", skillList: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 & CSS3"] },
  { category: "Backend",        icon: "⚙️", skillList: ["Node.js", "Express.js", "Python", "Django", "REST APIs"] },
  { category: "Database",       icon: "🗄️", skillList: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Redis"] },
  { category: "Cloud & DevOps", icon: "🚀", skillList: ["Docker", "Vercel", "Netlify", "GitHub Actions", "CI/CD"] },
  { category: "Tools",          icon: "🛠️", skillList: ["Git & GitHub", "VS Code", "Figma", "Postman", "Linux"] },
  { category: "AI & Modern",    icon: "🤖", skillList: ["OpenAI API", "LangChain", "Prompt Engineering", "Machine Learning"] },
];

const CARD_COLORS = [
  { accent: "#0ea5e9", bg: "rgba(14,165,233,0.06)",  border: "rgba(14,165,233,0.15)" },
  { accent: "#4f46e5", bg: "rgba(79,70,229,0.06)",   border: "rgba(79,70,229,0.15)"  },
  { accent: "#06b6d4", bg: "rgba(6,182,212,0.06)",   border: "rgba(6,182,212,0.15)"  },
  { accent: "#10b981", bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.15)" },
  { accent: "#f59e0b", bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.15)" },
  { accent: "#8b5cf6", bg: "rgba(139,92,246,0.06)",  border: "rgba(139,92,246,0.15)" },
];

const SkillCard = ({ index, category, icon, skillList }) => {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.08, 0.6)}
      className="relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden bg-white"
      style={{
        border: `1.5px solid ${color.border}`,
        boxShadow: "0 4px 24px rgba(14,165,233,0.07)",
        transition: "all 0.3s ease",
      }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(14,165,233,0.12), 0 0 0 1.5px ${color.accent}33` }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color.accent}, transparent)` }}
      />
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: color.bg, border: `1px solid ${color.border}` }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-[17px] text-slate-800">{category}</h3>
      </div>
      <ul className="space-y-2">
        {skillList.map((skill, i) => (
          <li key={i} className="flex items-center gap-2.5 text-slate-500 text-[13px]">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color.accent }} />
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
