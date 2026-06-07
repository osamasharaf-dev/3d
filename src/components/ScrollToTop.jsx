import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 400);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollUp}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-6 z-50 w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(7,8,16,0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1.5px solid rgba(145,94,255,0.35)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35), 0 0 20px rgba(145,94,255,0.14)",
          }}
        >
          {/* Inner glow on hover handled by whileHover scale */}
          <div aria-hidden="true" className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: "radial-gradient(circle at center, rgba(145,94,255,0.2), transparent 70%)" }}
          />
          <FiArrowUp size={17} className="text-[#c4b5fd] relative z-10" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
