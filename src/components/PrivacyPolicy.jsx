import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn, textVariant } from "../utils/motion";

const Section = ({ title, children }) => (
  <motion.div
    variants={fadeIn("up", "spring", 0.1, 0.75)}
    className="mb-10"
  >
    <h2 className="text-[#8ec5ff] text-[22px] font-bold mb-3">{title}</h2>
    <div className="text-secondary text-[16px] leading-[30px] space-y-3">
      {children}
    </div>
  </motion.div>
);

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="relative z-0 min-h-screen"
      style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}
    >
      {/* Header */}
      <div className="w-full py-8 px-6 border-b border-white/[0.06] backdrop-blur-sm sticky top-0 z-20"
        style={{ background: "rgba(7,8,13,0.9)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-[#8ec5ff] hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
          <span className="text-secondary text-xs">Last updated: January 2026</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          variants={textVariant()}
          initial="hidden"
          animate="show"
          className="mb-12"
        >
          <p className="text-[#8ec5ff] text-sm uppercase tracking-widest mb-2">
            Legal
          </p>
          <h1 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
            Privacy Policy<span className="text-[#915EFF]">.</span>
          </h1>
          <p className="text-secondary mt-4 text-[16px] leading-[28px] max-w-2xl">
            This Privacy Policy explains how Osama Sharaf ("I", "me", or "my")
            collects, uses, and protects your personal information when you
            visit this portfolio website.
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn("up", "spring", 0.2, 0.8)}
          initial="hidden"
          animate="show"
        >
          <Section title="1. Information I Collect">
            <p>
              When you use the contact form on this website, I may collect the
              following information:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Your full name</li>
              <li>Your email address</li>
              <li>The content of your message</li>
            </ul>
            <p>
              I do not collect any other personal data. This website does not
              use cookies, tracking pixels, or analytics services that collect
              personal information.
            </p>
          </Section>

          <Section title="2. How I Use Your Information">
            <p>
              The information you provide through the contact form is used solely
              to respond to your inquiry or message. I will not:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Sell, rent, or share your data with third parties</li>
              <li>Use your data for marketing purposes without your consent</li>
              <li>Store your data beyond what is necessary to respond to your inquiry</li>
            </ul>
          </Section>

          <Section title="3. Third-Party Services">
            <p>
              This website uses <strong className="text-white">EmailJS</strong> to
              process contact form submissions. EmailJS transmits your form data
              to deliver it to my email inbox. Please refer to{" "}
              <a
                href="https://www.emailjs.com/legal/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8ec5ff] underline hover:text-white transition-colors"
              >
                EmailJS's Privacy Policy
              </a>{" "}
              for details on how they handle data.
            </p>
          </Section>

          <Section title="4. Data Security">
            <p>
              I take reasonable measures to protect your information from
              unauthorized access or disclosure. However, please be aware that
              no method of transmission over the Internet is 100% secure.
            </p>
          </Section>

          <Section title="5. External Links">
            <p>
              This website may contain links to external websites (e.g., GitHub,
              LinkedIn). I am not responsible for the privacy practices of those
              sites and encourage you to review their respective privacy policies.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              You have the right to request access to, correction of, or deletion
              of any personal information you have provided to me. To exercise
              these rights, please contact me directly at:
            </p>
            <p>
              <a
                href="mailto:osamaabdulhalimsharaf@gmail.com"
                className="text-[#8ec5ff] underline hover:text-white transition-colors"
              >
                osamaabdulhalimsharaf@gmail.com
              </a>
            </p>
          </Section>

          <Section title="7. Changes to This Policy">
            <p>
              I may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated revision date. I
              encourage you to review this page periodically.
            </p>
          </Section>

          <Section title="8. Contact">
            <p>
              If you have any questions about this Privacy Policy, you can
              reach me at:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Email:{" "}
                <a
                  href="mailto:osamaabdulhalimsharaf@gmail.com"
                  className="text-[#8ec5ff] underline hover:text-white transition-colors"
                >
                  osamaabdulhalimsharaf@gmail.com
                </a>
              </li>
              <li>Phone: +963 935 562 470</li>
            </ul>
          </Section>
        </motion.div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-10 text-secondary text-xs">
        © 2026 Eng. OSAMA SHARAF. All Rights Reserved.
      </div>
    </div>
  );
};

export default PrivacyPolicy;
