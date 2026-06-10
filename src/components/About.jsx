import { motion } from "framer-motion";
import React, { memo } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Tilt } from "react-tilt";
import { SectionWrapper } from "../hoc";
import useMagnetic from "../reactbits/hooks/useMagnetic";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { useAbout } from "../lib/useAbout";
import { web, mobile, backend, creator } from "../assets";

const ICON_MAP = { web, mobile, backend, creator };

const ServiceCard = memo(({ index, title, icon_name, icon }) => {
  const resolvedIcon = ICON_MAP[icon_name] || icon || web;
  return (
    <Tilt className="xs:w-[255px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{ max: 45, scale: 1, speed: 450 }}
          className="bg-[#111522] rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
        >
          <img
            src={resolvedIcon}
            alt={title}
            className="w-16 h-16 object-contain"
            loading="lazy"
            decoding="async"
          />
          <h3 className="text-white text-[20px] font-bold text-center">
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
});

ServiceCard.displayName = "ServiceCard";

const About = () => {
  const { data } = useAbout();
  const { ref: resumeButtonRef } = useMagnetic({ radius: 100, strength: 0.3 });

  const bio = data.bio_paragraphs || [];
  const services = data.services || [];
  const resumeUrl = data.resume_url || "";

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        {bio.length > 0 ? (
          bio.map((para, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>{para}</p>
          ))
        ) : (
          <>
            <p>
              I am a Software Engineer and Full-Stack Web Developer passionate about
              building modern digital solutions, scalable web applications, and
              high-performance digital experiences.
            </p>
            <p className="mt-4">
              With expertise spanning front-end development, back-end systems,
              databases, and cloud-based deployment, I transform ideas into reliable
              and impactful products that help businesses grow and succeed in the
              digital world.
            </p>
            <p className="mt-4">
              My goal is not only to write code, but to create meaningful solutions
              that combine functionality, performance, and exceptional user experience.
            </p>
          </>
        )}
      </motion.div>

      {resumeUrl && (
        <a
          ref={resumeButtonRef}
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-10 px-6 py-3 text-white rounded-md shadow-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          style={{
            background: "linear-gradient(135deg, #1591DC, #2C5EAD)",
            boxShadow: "0 4px 18px rgba(21,145,220,0.3)",
            textDecoration: "none",
          }}
        >
          <FiExternalLink className="w-4 h-4" />
          <span className="font-semibold">See my Resume</span>
        </a>
      )}

      <div className="mt-12 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title || index} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
