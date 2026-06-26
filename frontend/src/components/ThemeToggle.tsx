import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export default function ThemeToggle({ className = '', compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative inline-flex items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/50 ${className}`}
    >
      <span
        className={`relative flex items-center rounded-full border transition-all duration-300 ${
          compact
            ? 'h-8 w-[3.25rem] border-white/20 bg-white/10'
            : 'h-9 w-[4.25rem] border-slate-200 bg-slate-100 dark:border-white/15 dark:bg-white/10'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`absolute flex items-center justify-center rounded-full shadow-md ${
            compact
              ? 'h-6 w-6'
              : 'h-7 w-7'
          } ${
            isDark
              ? 'left-[calc(100%-1.625rem)] bg-gradient-to-br from-brand-pink to-brand-pink-dark text-white'
              : 'left-0.5 bg-white text-amber-500'
          }`}
        >
          {isDark ? (
            <Moon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.25} />
          ) : (
            <Sun className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.25} />
          )}
        </motion.span>

        {!compact && (
          <>
            <Sun
              className={`absolute left-2 h-3 w-3 transition-opacity ${
                isDark ? 'opacity-30 text-white/50' : 'opacity-0'
              }`}
            />
            <Moon
              className={`absolute right-2 h-3 w-3 transition-opacity ${
                isDark ? 'opacity-0' : 'opacity-40 text-slate-500'
              }`}
            />
          </>
        )}
      </span>
    </button>
  );
}
