import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export interface ParallaxItem {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

interface ZoomParallaxProps {
  /** Up to 7 items for the parallax zoom effect */
  items: ParallaxItem[];
}

const positionClasses = [
  '', // index 0 — center default
  '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
  '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
  '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
  '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
  '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
  '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
];

export function ZoomParallax({ items }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {items.map((item, index) => {
          const scale = scales[index % scales.length];
          return (
            <motion.div
              key={`${item.title}-${index}`}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClasses[index] ?? ''}`}
            >
              <div className="relative h-[25vh] w-[25vw] min-w-[140px] max-w-[420px] rounded-luxury overflow-hidden shadow-luxury-lg ring-1 ring-white/10">
                <img
                  src={item.src}
                  alt={item.alt || item.title || `Feature ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {(item.title || item.description) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/90 via-brand-black/50 to-transparent p-3 sm:p-4">
                    {item.title && (
                      <p className="text-white font-semibold text-xs sm:text-sm md:text-base leading-tight">
                        {item.title}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-white/75 text-[10px] sm:text-xs mt-1 line-clamp-2 leading-snug">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
                <div className="absolute top-2 left-2 h-6 w-1 rounded-full bg-brand-pink" aria-hidden />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
