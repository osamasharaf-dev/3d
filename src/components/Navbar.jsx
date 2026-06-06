import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

const NAV_LINKS = [
  { title: "Home", href: "#hero", id: "hero" },
  { title: "About", href: "#about", id: "about" },
  { title: "Skills", href: "#skills", id: "skills" },
  { title: "Certifications", href: "#achievements", id: "achievements" },
  { title: "Portfolio", href: "#projects", id: "projects" },
  { title: "Contact", href: "#contact", id: "contact" },
];

const SOCIAL_LINKS = [
  {
    icon: FaFacebook,
    href: "https://facebook.com/osamasharaf",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/963935562470",
    label: "WhatsApp",
    color: "#25D366",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com/osamasharaf",
    label: "Instagram",
    color: "#E4405F",
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  const floatY = useMotionValue(0);
  const springFloatY = useSpring(floatY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        setScrolled(scrollTop > 30);

        const delta = scrollTop - lastScrollY.current;
        floatY.set(Math.max(-5, Math.min(5, delta * 0.25)));
        setTimeout(() => floatY.set(0), 400);
        lastScrollY.current = scrollTop;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [floatY]);

  useEffect(() => {
    const observers = [];

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.2, rootMargin: "-60px 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <motion.header
      style={{ y: springFloatY }}
      className="fixed top-0 left-0 right-0 z-30 flex justify-center px-4 pt-4"
    >
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-between w-full max-w-6xl px-5 py-3 rounded-2xl border transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(7, 8, 13, 0.80)"
            : "rgba(7, 8, 13, 0.45)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: scrolled
            ? "rgba(255,255,255,0.09)"
            : "rgba(255,255,255,0.05)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Brand */}
        <a href="#hero" className="flex-shrink-0 group">
          <motion.span
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-xs font-bold tracking-[0.18em] uppercase select-none"
          >
            <span className="text-white group-hover:text-[#c8d8ff] transition-colors duration-300">
              OSAMA
            </span>
            <span className="text-[#915EFF] ml-1">SHARAF</span>
          </motion.span>
        </a>

        {/* Desktop nav links — centered absolutely */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <motion.a
                key={link.id}
                href={link.href}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] rounded-xl transition-colors duration-200"
                style={{
                  color: isActive ? "#fff" : "rgba(142, 173, 255, 0.75)",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActive"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(145,94,255,0.22), rgba(142,197,255,0.12))",
                      border: "1px solid rgba(145,94,255,0.35)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.title}</span>
              </motion.a>
            );
          })}
        </div>

        {/* Right side: social icons + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Social icons */}
          <div className="flex items-center gap-1.5">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.18, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color,
                }}
              >
                <Icon className="text-sm" />
              </motion.a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden ml-2 w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-[1.5px] bg-white block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-[1.5px] bg-white block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-[1.5px] bg-white block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[68px] left-4 right-4 rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{
              background: "rgba(7, 8, 13, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex flex-col p-3 gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-colors duration-200"
                    style={{
                      background: isActive
                        ? "rgba(145,94,255,0.15)"
                        : "transparent",
                      color: isActive ? "#fff" : "rgba(142,173,255,0.75)",
                      borderLeft: isActive
                        ? "2px solid rgba(145,94,255,0.7)"
                        : "2px solid transparent",
                    }}
                  >
                    {link.title}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
