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
    color: "#ffffff",
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
    <footer className="relative z-10 w-full border-t border-white/[0.06] bg-[#07080d] px-6 py-10">
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
              className="w-10 h-10 rounded-xl bg-[#111522] border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition-all duration-300"
              style={{ color }}
            >
              <Icon className="text-lg" />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs h-px bg-white/[0.06]" />

        {/* Copyright */}
        <div className="text-center space-y-1">
          <p className="text-secondary text-sm">
            © 2026 All Rights Reserved.
          </p>
          <p className="text-secondary text-sm">
            Developed by{" "}
            <span className="text-[#8ec5ff] font-semibold">
              Eng. OSAMA SHARAF
            </span>{" "}
            <span className="text-[#915EFF] font-mono">&lt;/&gt;</span>
          </p>
        </div>

        {/* Privacy Policy link */}
        <Link
          to="/privacy-policy"
          className="text-secondary text-xs hover:text-[#8ec5ff] transition-colors duration-200 underline underline-offset-2"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
