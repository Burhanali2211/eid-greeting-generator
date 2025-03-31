"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Gift, Star, Sparkles } from "lucide-react";

interface EidiCardProps {
  index: number;
  amount: number;
  isSelected: boolean;
  isRevealed: boolean;
  isLocked: boolean;
  onClick: (index: number) => void;
  isPaid?: boolean;
  onlyViewable?: boolean;
}

// Card theme colors
const CARD_COLORS = [
  { from: 'from-amber-400', to: 'to-amber-600', text: 'text-amber-600' },
  { from: 'from-emerald-400', to: 'to-emerald-600', text: 'text-emerald-600' },
  { from: 'from-purple-400', to: 'to-purple-600', text: 'text-purple-600' },
  { from: 'from-blue-400', to: 'to-blue-600', text: 'text-blue-600' },
  { from: 'from-rose-400', to: 'to-rose-600', text: 'text-rose-600' },
  { from: 'from-orange-400', to: 'to-orange-600', text: 'text-orange-600' },
];

export function EidiCard({
  index,
  amount,
  isSelected,
  isRevealed,
  isLocked,
  onClick,
  isPaid = false,
  onlyViewable = false,
}: EidiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Get color theme based on index
  const colorTheme = CARD_COLORS[index % CARD_COLORS.length];
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle click with mobile support
  const handleClick = useCallback(() => {
    if (isLocked || onlyViewable) return;
    
    if (isMobile) {
      setIsTapped(true);
      setTimeout(() => setIsTapped(false), 300);
      
      // Add haptic feedback for mobile
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(50);
        } catch (e) {
          // Silently fail if vibration API not supported
        }
      }
    }
    
    onClick(index);
  }, [isLocked, onlyViewable, isMobile, onClick, index]);

  return (
    <div className="relative w-full aspect-[3/4] cursor-pointer perspective">
      <motion.div
        className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br
          ${isRevealed ? 'from-eid-emerald-500 to-eid-emerald-600' : `${colorTheme.from} ${colorTheme.to}`}
          shadow-lg hover:shadow-xl transition-shadow duration-300
          ${isLocked ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}
          ${isTapped ? 'scale-95' : ''}
        `}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        whileHover={!onlyViewable && !isLocked ? { scale: 1.05 } : {}}
        whileTap={!onlyViewable && !isLocked ? { scale: 0.95 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div
          className={`
            relative h-full w-full rounded-2xl overflow-hidden
            transition-transform duration-300
          `}
          onClick={handleClick}
        >
          {/* Card decorations - visible on both sides */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-white/20 to-transparent"></div>
          
          {/* Front face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90 flex flex-col items-center justify-center p-6 text-center"
            initial={false}
            animate={{ 
              rotateY: isRevealed ? 180 : 0,
              scale: isSelected && !isRevealed ? 0.95 : 1
            }}
            transition={{ duration: 0.6 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative">
              <Gift className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 ${colorTheme.text}`} />
              {isHovered && !onlyViewable && !isLocked && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </motion.div>
              )}
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Eidi Card {index + 1}</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {onlyViewable 
                ? "Preview only" 
                : isLocked 
                  ? "Card locked"
                  : "Click to reveal your gift amount"}
            </p>
            
            {/* Selection indicator */}
            {isSelected && !isRevealed && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Back face */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{ rotateY: isRevealed ? 0 : -180 }}
            transition={{ duration: 0.6 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative text-center">
              <motion.div
                className="relative text-3xl sm:text-4xl font-bold text-white"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              >
                <div className="relative z-10">
                  {amount === 0 ? (
                    <span className="text-white/50">₹---</span>
                  ) : (
                    `₹${amount}`
                  )}
                </div>
                
                {/* Background shimmer effect */}
                <motion.div 
                  className="absolute inset-0 bg-white/20 blur-sm"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>
              
              {/* Status text */}
              {isPaid && (
                <motion.div
                  className="mt-2 text-sm text-white flex items-center justify-center gap-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="bg-green-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Payment received
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-4 right-4 text-white/30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Gift className="w-6 h-6" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-4 left-4 text-white/30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Star className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Touch indicator for mobile */}
      {isMobile && !onlyViewable && !isLocked && !isSelected && !isRevealed && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center">
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            Tap to select
          </div>
        </div>
      )}
    </div>
  );
} 