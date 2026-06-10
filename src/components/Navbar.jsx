import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

const NAV_LINKS = [
  { title: "Home",           href: "#hero",         id: "hero"         },
  { title: "About",          href: "#about",        id: "about"        },
  { title: "Skills",         href: "#skills",       id: "skills"       },
  { title: "Certifications", href: "#achievements", id: "achievements" },
  { title: "Portfolio",      href: "#portfolio",    id: "portfolio"    },
  { title: "Contact",        href: "#contact",      id: "contact"      },
];

const SOCIAL_LINKS = [
  { icon: FaFacebook,  href: "https://facebook.com/osamasharaf",  label: "Facebook",  color: "#1877F2" },
  { icon: FaWhatsapp,  href: "https://wa.me/963935562470",        label: "WhatsApp",  color: "#25D366" },
  { icon: FaInstagram, href: "https://instagram.com/osamasharaf", label: "Instagram", color: "#E4405F" },
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
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
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
      role="banner"
    >
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-between w-full max-w-6xl px-5 py-3 rounded-2xl border transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: scrolled ? "rgba(14,165,233,0.18)" : "rgba(14,165,233,0.10)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "0 4px 16px rgba(14,165,233,0.07), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <a href="#hero" className="flex-shrink-0 group" aria-label="Home">
          <motion.span
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-xs font-bold tracking-[0.18em] uppercase select-none"
          >
            <span className="text-slate-800 group-hover:text-slate-600 transition-colors duration-300">OSAMA</span>
            <span className="text-sky-500 ml-1">SHARAF</span>
          </motion.span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5" aria-label="Site sections">
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
                style={{ color: isActive ? "#0f172a" : "#64748b" }}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActive"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(79,70,229,0.08))",
                      border: "1px solid rgba(14,165,233,0.25)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.title}</span>
              </motion.a>
            );
          })}
        </nav>

        {/* Right: social + hamburger */}
        <div className="flex items-center gap-2">
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
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 hover:border-sky-300 transition-all duration-300"
                style={{ background: "rgba(248,250,255,0.8)", color }}
              >
                <Icon className="text-sm" />
              </motion.a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden ml-2 w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-slate-200 bg-white/80 hover:bg-sky-50 transition-all duration-200"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="w-4 h-[1.5px] bg-slate-700 block" />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }} className="w-4 h-[1.5px] bg-slate-700 block" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="w-4 h-[1.5px] bg-slate-700 block" />
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
            className="absolute top-[68px] left-4 right-4 rounded-2xl border border-sky-100 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 16px 48px rgba(14,165,233,0.12)",
            }}
            role="menu"
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
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-colors duration-200"
                    style={{
                      background: isActive ? "rgba(14,165,233,0.08)" : "transparent",
                      color: isActive ? "#0ea5e9" : "#475569",
                      borderLeft: isActive ? "2px solid rgba(14,165,233,0.6)" : "2px solid transparent",
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
