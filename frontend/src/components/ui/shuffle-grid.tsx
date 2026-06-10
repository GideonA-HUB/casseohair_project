"use client"

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-brand-pink font-medium">
          Luxury Hair Collection
        </span>
        <h3 className="text-4xl md:text-6xl font-semibold text-brand-black">
          Discover Your Perfect Style
        </h3>
        <p className="text-base md:text-lg text-brand-accent my-4 md:my-6">
          Explore our premium collection of authentic luxury wigs and hair extensions. 
          Sourced globally for the discerning customer who demands excellence.
        </p>
        <Link 
          to="/shop"
          className={cn(
            "inline-block bg-brand-pink text-brand-white font-medium py-3 px-6 rounded-luxury",
            "transition-all hover:bg-brand-pink/90 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
          )}
        >
          Shop Now
        </Link>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array: HeroImage[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

interface HeroImage {
  id: number;
  src: string;
  alt?: string;
}

const defaultHeroImages: HeroImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Luxury Hair Collection",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Premium Wigs",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hair Extensions",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Bone Straight Hair",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Deep Wave",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Water Wave",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Body Wave",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Curly Hair",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Luxury Wigs",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Premium Hair",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hair Styling",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hair Care",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hair Accessories",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hair Products",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hair Salon",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Beautiful Hair",
  },
];

const generateSquares = (images: HeroImage[]) => {
  return shuffle([...images]).map((img) => (
    <motion.div
      key={img.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-luxury overflow-hidden bg-brand-gray-100"
      style={{
        backgroundImage: `url(${img.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label={img.alt || "Hero image"}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState<React.ReactNode[]>(generateSquares(defaultHeroImages));
  const [heroImages, setHeroImages] = useState<HeroImage[]>(defaultHeroImages);

  useEffect(() => {
    // Fetch hero images from Django API
    fetchHeroImages();
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await fetch('/api/v1/site/hero-images/');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const images: HeroImage[] = data.map((img: any) => ({
            id: img.id,
            src: img.image,
            alt: img.alt_text || 'Hero image',
          }));
          setHeroImages(images);
          setSquares(generateSquares(images));
        }
      }
    } catch (error) {
      console.error('Failed to fetch hero images:', error);
      // Keep using default images if fetch fails
    }
  };

  const shuffleSquares = () => {
    setSquares(generateSquares(heroImages));

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};
