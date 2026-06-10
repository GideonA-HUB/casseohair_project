import { motion } from 'framer-motion';

const LOGO_SRC = `${import.meta.env.BASE_URL}logo.png`;

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <img
          src={LOGO_SRC}
          alt="CasseoHair"
          className="w-full h-full object-contain"
        />
      </motion.div>
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-pink"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
      <p className="text-sm text-brand-accent/60 font-medium tracking-widest uppercase">
        Loading Luxury
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-20">{content}</div>;
}
