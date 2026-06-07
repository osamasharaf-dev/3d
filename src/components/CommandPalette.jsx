import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCommand, FiHash, FiHome, FiInfo, FiMail, FiStar, FiUser } from "react-icons/fi";

const NAV_COMMANDS = [
  { id: "home",    label: "Home",            sub: "Jump to top",           icon: FiHome,         action: () => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }) },
  { id: "about",   label: "About Me",        sub: "Background & services", icon: FiUser,         action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
  { id: "skills",  label: "Skills",          sub: "Technologies & tools",  icon: FiHash,         action: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }) },
  { id: "certs",   label: "Certifications",  sub: "Credentials",           icon: FiStar,         action: () => document.getElementById("achievements")?.scrollIntoView({ behavior: "smooth" }) },
  { id: "port",    label: "Portfolio",       sub: "Completed projects",    icon: FiCommand,      action: () => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }) },
  { id: "contact", label: "Contact",         sub: "Get in touch",          icon: FiMail,         action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
];

const LINK_COMMANDS = [
  { id: "github",    label: "GitHub Profile",  sub: "github.com/osamasharaf",  icon: FiArrowUpRight, href: "https://github.com/osamasharaf"  },
  { id: "whatsapp",  label: "WhatsApp",        sub: "wa.me/963935562470",       icon: FiArrowUpRight, href: "https://wa.me/963935562470"       },
  { id: "instagram", label: "Instagram",       sub: "@osamasharaf",             icon: FiArrowUpRight, href: "https://instagram.com/osamasharaf"},
];

const ALL_COMMANDS = [
  { group: "Navigate", items: NAV_COMMANDS },
  { group: "Links",    items: LINK_COMMANDS },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = ALL_COMMANDS.map(g => ({
    ...g,
    items: g.items.filter(
      c => c.label.toLowerCase().includes(query.toLowerCase()) || c.sub.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(g => g.items.length > 0);

  const flatItems = filtered.flatMap(g => g.items);

  useEffect(() => {
    const handle = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(v => !v);
        setQuery("");
        setCursor(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  useEffect(() => {
    let focusTimer;
    if (open) {
      focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  const runCommand = (cmd) => {
    setOpen(false);
    setQuery("");
    if (cmd.href) {
      window.open(cmd.href, "_blank", "noopener noreferrer");
    } else if (cmd.action) {
      setTimeout(cmd.action, 80);
    }
  };

  const handleKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      if (flatItems[cursor]) runCommand(flatItems[cursor]);
    }
  };

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[cursor];
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9990]"
            style={{ background: "rgba(2,5,16,0.72)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Command palette"
            className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-[9995] w-full max-w-lg mx-4"
            style={{ maxWidth: "min(560px, calc(100vw - 32px))" }}
          >
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(7,8,16,0.94)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(145,94,255,0.12)",
              }}
            >
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <FiCommand className="text-[#915EFF] flex-shrink-0" size={16} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Search commands, sections, links…"
                  aria-label="Command search"
                  className="flex-1 bg-transparent text-white text-[14px] placeholder-white/30 outline-none"
                />
                <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white/30 border border-white/10 hidden sm:block">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[340px] overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-white/30 text-[13px]">
                    No results for "{query}"
                  </div>
                )}
                {filtered.map(group => (
                  <div key={group.group}>
                    <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/25">
                      {group.group}
                    </p>
                    {group.items.map(cmd => {
                      const Icon = cmd.icon;
                      const flatIdx = flatItems.indexOf(cmd);
                      const isActive = flatIdx === cursor;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => runCommand(cmd)}
                          onMouseEnter={() => setCursor(flatIdx)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100"
                          style={{
                            background: isActive ? "rgba(145,94,255,0.12)" : "transparent",
                            borderLeft: isActive ? "2px solid rgba(145,94,255,0.7)" : "2px solid transparent",
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: isActive ? "rgba(145,94,255,0.2)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                          >
                            <Icon size={14} style={{ color: isActive ? "#c4b5fd" : "#6b7280" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium" style={{ color: isActive ? "#fff" : "#d1d5db" }}>
                              {cmd.label}
                            </p>
                            <p className="text-[11px] truncate" style={{ color: "#6b7280" }}>
                              {cmd.sub}
                            </p>
                          </div>
                          {cmd.href && (
                            <FiArrowUpRight size={12} className="flex-shrink-0 opacity-30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.05] text-[10px] text-white/20">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
