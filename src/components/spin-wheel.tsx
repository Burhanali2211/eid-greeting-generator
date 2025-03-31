"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface SpinWheelProps {
  onResult: (discount: number) => void;
  onClose: () => void;
}

const DISCOUNTS = [5, 10, 15, 20, 25, 30];
const SPIN_DURATION = 4000; // 4 seconds

export default function SpinWheel({ onResult, onClose }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Calculate random rotation (minimum 5 full spins + random segment)
    const minSpins = 5;
    const randomSegment = Math.floor(Math.random() * DISCOUNTS.length);
    const segmentAngle = 360 / DISCOUNTS.length;
    const targetRotation = (minSpins * 360) + (randomSegment * segmentAngle);
    
    // Animate wheel
    setRotation(targetRotation);

    // Get result after animation
    setTimeout(() => {
      setIsSpinning(false);
      onResult(DISCOUNTS[randomSegment]);
    }, SPIN_DURATION);
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Spin & Win!</h3>
        <p className="text-gray-600">Spin the wheel to get a discount on your Eidi amounts</p>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* Wheel */}
        <motion.div
          ref={wheelRef}
          className="absolute inset-0"
          animate={{ rotate: rotation }}
          transition={{ duration: SPIN_DURATION / 1000, ease: "easeOut" }}
        >
          <div className="relative w-full h-full">
            {DISCOUNTS.map((discount, index) => {
              const rotation = (index * (360 / DISCOUNTS.length));
              return (
                <div
                  key={discount}
                  className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom w-2 h-1/2"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex items-center justify-center transform -rotate-90">
                    <div className={`text-lg font-bold ${index % 2 === 0 ? 'text-eid-gold-600' : 'text-eid-emerald-600'}`}>
                      {discount}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Wheel segments */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            {DISCOUNTS.map((_, index) => {
              const startAngle = (index * (360 / DISCOUNTS.length));
              const endAngle = ((index + 1) * (360 / DISCOUNTS.length));
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={index % 2 === 0 ? '#FEF3C7' : '#D1FAE5'}
                  stroke={index % 2 === 0 ? '#F59E0B' : '#059669'}
                  strokeWidth="0.5"
                  className="transition-colors duration-300"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-gray-200 z-10" />
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 bg-red-500 rotate-45 transform origin-bottom z-20" />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 
                   text-white font-medium shadow-lg transition-all duration-200 
                   flex items-center justify-center
                   ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:from-eid-emerald-600 hover:to-eid-emerald-700'}`}
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
    </div>
  );
} 