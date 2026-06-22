import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ScrollButton({
  direction,
  onClick,
  label,
}: {
  direction: 'up' | 'down';
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={label}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink text-white shadow-[0_8px_24px_rgba(230,46,114,0.35)] ring-1 ring-white/20 transition-colors hover:bg-brand-pink-dark"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {direction === 'up' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
        )}
      </svg>
    </motion.button>
  );
}

export default function ScrollToTop() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  const updateVisibility = useCallback(() => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    setShowUp(scrollY > 240);
    setShowDown(scrollY < maxScroll - 80);
  }, []);

  useEffect(() => {
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [updateVisibility]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  if (!showUp && !showDown) return null;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2 sm:right-5">
      <AnimatePresence>
        {showUp && (
          <ScrollButton key="scroll-up" direction="up" onClick={scrollToTop} label="Scroll to top" />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDown && (
          <ScrollButton
            key="scroll-down"
            direction="down"
            onClick={scrollToBottom}
            label="Scroll to bottom"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
