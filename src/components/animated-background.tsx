"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 1], [1, 1, 0.8, 0.3]);
  
  // Random positions for stars
  const starPositions = [
    { top: "5%", left: "10%", delay: 0 },
    { top: "15%", right: "15%", delay: 0.5 },
    { top: "25%", left: "20%", delay: 1 },
    { top: "40%", right: "5%", delay: 1.5 },
    { top: "60%", left: "15%", delay: 2 },
    { top: "75%", right: "30%", delay: 2.5 },
    { top: "85%", left: "35%", delay: 3 },
    { top: "10%", left: "50%", delay: 3.5 },
    { top: "30%", left: "65%", delay: 4 },
    { top: "50%", left: "75%", delay: 4.5 },
    { top: "70%", left: "90%", delay: 5 },
    { top: "90%", left: "25%", delay: 5.5 },
  ];
  
  // Moon positions
  const moonPosition = { top: "15%", right: "10%" };
  
  useEffect(() => {
    setIsMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    
    const handleMediaChange = () => {
      setIsReducedMotion(mediaQuery.matches);
    };
    
    // Update viewport size
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateSize();
    
    // Add event listeners
    mediaQuery.addEventListener("change", handleMediaChange);
    window.addEventListener("resize", updateSize);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.addEventListener("resize", updateSize);
    };
  }, []);
  
  // Optimize rendering on smaller screens
  const shouldRenderFullBackground = viewportSize.width > 768;
  const starsToRender = viewportSize.width < 768 ? starPositions.slice(0, 6) : starPositions;
  
  // Create randomized blobs
  interface Blob {
    size: number;
    left: number;
    top: number;
    hue: number;
    delay: number;
    duration: number;
    id: number;
  }

  const generateBlobs = (count: number): Blob[] => {
    const blobs: Blob[] = [];
    
    for (let i = 0; i < count; i++) {
      const size = 20 + Math.random() * 15; // Size between 20-35vmin
      const left = Math.random() * 85; // Position between 0-85%
      const top = Math.random() * 85;
      const hue = 220 + Math.random() * 60; // Blue to purple hues
      const delay = Math.random() * 5;
      const duration = 20 + Math.random() * 15; // Animation duration 20-35s
      
      blobs.push({ size, left, top, hue, delay, duration, id: i });
    }
    
    return blobs;
  };

  const blobs = useRef(generateBlobs(6)).current;
  
  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-100"
      style={{ opacity }}
    >
      {/* Gradient Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-indigo-50/50 to-blue-100/70"
        animate={{
          background: [
            "linear-gradient(to bottom right, rgba(216, 180, 254, 0.2), rgba(165, 180, 252, 0.1), rgba(191, 219, 254, 0.2))",
            "linear-gradient(to bottom right, rgba(191, 219, 254, 0.2), rgba(216, 180, 254, 0.1), rgba(165, 180, 252, 0.2))",
            "linear-gradient(to bottom right, rgba(165, 180, 252, 0.2), rgba(191, 219, 254, 0.1), rgba(216, 180, 254, 0.2))",
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
      
      {/* Large decorative circle/moon */}
      <motion.div
        className="absolute w-[30vmin] h-[30vmin] rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-100 shadow-2xl opacity-70 hidden sm:block"
        style={{
          top: moonPosition.top,
          right: moonPosition.right,
          filter: "blur(2px)",
        }}
        animate={!isReducedMotion ? {
          scale: [1, 1.03, 1],
          opacity: [0.7, 0.75, 0.7]
        } : {}}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* Moon craters */}
        <div className="absolute w-[6vmin] h-[6vmin] rounded-full bg-amber-100/40 blur-sm top-[30%] left-[20%]"></div>
        <div className="absolute w-[4vmin] h-[4vmin] rounded-full bg-amber-100/40 blur-sm bottom-[25%] right-[30%]"></div>
        <div className="absolute w-[3vmin] h-[3vmin] rounded-full bg-amber-100/40 blur-sm top-[15%] right-[25%]"></div>
      </motion.div>
      
      {/* Animated stars */}
      <AnimatePresence>
        {isMounted && starsToRender.map((position, index) => (
          <motion.div
            key={`star-${index}`}
            className="absolute w-2 h-2 sm:w-3 sm:h-3"
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={!isReducedMotion ? {
              scale: [0, 1, 0.8, 1],
              opacity: [0, 0.9, 0.7, 0.9],
              rotate: [0, 45, 0, 45]
            } : { scale: 1, opacity: 0.9 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: position.delay,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L14.4 9.6H22L15.6 14.4L18 22L12 17.2L6 22L8.4 14.4L2 9.6H9.6L12 2Z"
                fill="url(#starGradient)"
              />
              <defs>
                <linearGradient id="starGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FCD34D" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Animated Blobs */}
      {shouldRenderFullBackground && blobs.map(blob => (
        <motion.div
          key={`blob-${blob.id}`}
          className="absolute rounded-full opacity-30 mix-blend-multiply filter blur-2xl"
          style={{
            width: `${blob.size}vmin`,
            height: `${blob.size}vmin`,
            left: `${blob.left}%`,
            top: `${blob.top}%`,
            backgroundColor: `hsl(${blob.hue}, 70%, 80%)`,
          }}
          animate={!isReducedMotion ? {
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 50, -20, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          } : {}}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}
      
      {/* Eid Mubarak decorative text (in Arabic) */}
      <div className="absolute bottom-5 right-5 font-arabic text-4xl sm:text-6xl text-amber-500/10 rotate-12 select-none hidden md:block">
        عيد مبارك
      </div>
      
      {/* Decorative lantern silhouettes */}
      <motion.div
        className="absolute bottom-0 left-0 w-[15vmin] h-[25vmin] opacity-10 hidden lg:block"
        style={{ y: y1 }}
      >
        <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0V30M30 30H70M30 30V130M70 30V130M30 130H70M40 130L40 150H60L60 130" 
                stroke="#7C3AED" strokeWidth="5" />
          <rect x="35" y="50" width="30" height="5" fill="#7C3AED" />
          <rect x="35" y="80" width="30" height="5" fill="#7C3AED" />
          <rect x="35" y="110" width="30" height="5" fill="#7C3AED" />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute bottom-0 right-0 w-[12vmin] h-[20vmin] opacity-10 hidden lg:block"
        style={{ y: y2, rotate: rotate1 }}
      >
        <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0V30M30 30H70M30 30V130M70 30V130M30 130H70M40 130L40 150H60L60 130" 
                stroke="#8B5CF6" strokeWidth="5" />
          <rect x="35" y="50" width="30" height="5" fill="#8B5CF6" />
          <rect x="35" y="80" width="30" height="5" fill="#8B5CF6" />
          <rect x="35" y="110" width="30" height="5" fill="#8B5CF6" />
        </svg>
      </motion.div>
      
      {/* Geometric pattern band (Islamic-inspired) */}
      <div className="absolute top-1/3 left-0 right-0 h-[3px] bg-pattern-islamic opacity-5"></div>
      <div className="absolute top-2/3 left-0 right-0 h-[3px] bg-pattern-islamic opacity-5"></div>
      
      {/* Optimized for performance on small screens */}
      {!shouldRenderFullBackground && (
        <div className="absolute inset-0 pattern-dots-xl pattern-indigo-500 pattern-opacity-[0.03] pattern-size-4"></div>
      )}
    </motion.div>
  );
} 