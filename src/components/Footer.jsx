import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/osamasharaf",
    color: "#0A66C2",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/osamasharaf",
    color: "#1e293b",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "https://facebook.com/osamasharaf",
    color: "#1877F2",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://instagram.com/osamasharaf",
    color: "#E4405F",
  },
];

const Footer = () => {
  return (
    <footer
      className="relative z-10 w-full px-6 py-10"
      style={{
        background: "#eaecf5",
        borderTop: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        {/* Social links */}
        <div className="flex gap-4">
          {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:shadow-md"
              style={{
                background: "rgba(255,255,255,0.85)",
                borderColor: "rgba(0,0,0,0.08)",
                color,
              }}
            >
              <Icon className="text-lg" />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div
          className="w-full max-w-xs h-px"
          style={{ background: "rgba(0,0,0,0.08)" }}
        />

        {/* Copyright */}
        <div className="text-center space-y-1">
          <p className="text-secondary text-sm">© 2026 All Rights Reserved.</p>
          <p className="text-secondary text-sm">
            Developed by{" "}
            <span className="text-[#7c3aed] font-semibold">
              Eng. OSAMA SHARAF
            </span>{" "}
            <span className="text-[#915EFF] font-mono">&lt;/&gt;</span>
          </p>
        </div>

        {/* Privacy Policy link */}
        <Link
          to="/privacy-policy"
          className="text-secondary text-xs hover:text-[#7c3aed] transition-colors duration-200 underline underline-offset-2"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
