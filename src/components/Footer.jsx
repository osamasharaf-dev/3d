import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaFacebook, FaInstagram } from "react-icons/fa";

const SOCIAL_LINKS = [
  { icon: FaLinkedin,  label: "LinkedIn",  href: "https://linkedin.com/in/osamasharaf",  color: "#0A66C2" },
  { icon: FaGithub,    label: "GitHub",    href: "https://github.com/osamasharaf",       color: "#1e293b" },
  { icon: FaFacebook,  label: "Facebook",  href: "https://facebook.com/osamasharaf",    color: "#1877F2" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/osamasharaf",   color: "#E4405F" },
];

const Footer = () => (
  <footer
    className="relative z-10 w-full px-6 py-10"
    style={{
      background: "linear-gradient(135deg, #f0f7ff 0%, #eef0ff 100%)",
      borderTop: "1px solid rgba(14,165,233,0.12)",
    }}
  >
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
      {/* Social */}
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
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md flex items-center justify-center transition-all duration-300"
            style={{ color, boxShadow: "0 2px 8px rgba(14,165,233,0.06)" }}
          >
            <Icon className="text-lg" />
          </motion.a>
        ))}
      </div>

      <div className="w-full max-w-xs h-px" style={{ background: "rgba(14,165,233,0.12)" }} />

      <div className="text-center space-y-1">
        <p className="text-slate-400 text-sm">© 2026 All Rights Reserved.</p>
        <p className="text-slate-400 text-sm">
          Developed by{" "}
          <span className="text-sky-500 font-semibold">Eng. OSAMA SHARAF</span>{" "}
          <span className="text-indigo-500 font-mono">&lt;/&gt;</span>
        </p>
      </div>

      <Link
        to="/privacy-policy"
        className="text-slate-400 text-xs hover:text-sky-500 transition-colors duration-200 underline underline-offset-2"
      >
        Privacy Policy
      </Link>
    </div>
  </footer>
);

export default Footer;
