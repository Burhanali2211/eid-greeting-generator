"use client";

import { useEffect, useRef, useState } from "react";

// Define different confetti shapes
type ConfettiShape = "square" | "circle" | "star" | "crescent" | "triangle";

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: ConfettiShape;
  drift: number; // Horizontal drift factor
  tilt: number; // Tilt angle
}

interface ConfettiConfig {
  colors: string[];
  particleCount: number;
  particleSize: number;
  gravity: number;
  spread: number;
  startVelocity: number;
  duration: number;
  decay: number;
  drift?: number;
  shapes?: ConfettiShape[];
  ticks?: number;
}

interface ConfettiProps {
  isActive?: boolean;
  config?: Partial<ConfettiConfig>;
}

const defaultConfig: ConfettiConfig = {
  colors: [
    "#FDE68A", // gold
    "#F59E0B", // amber
    "#22C55E", // emerald
    "#16A34A", // green
    "#A855F7", // purple
    "#FFFFFF", // white
    "#F43F5E", // rose
    "#3B82F6", // blue
    "#FB923C", // orange
  ],
  particleCount: 60,
  particleSize: 6,
  gravity: 0.5,
  spread: 70,
  startVelocity: 30,
  duration: 2500,
  decay: 0.94,
  drift: 0.1,
  shapes: ["square", "circle", "star", "crescent", "triangle"],
  ticks: 200
};

export function Confetti({ isActive = false, config = {} }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);
  const ticksRef = useRef<number>(0);

  // Merged config
  const mergedConfig = { ...defaultConfig, ...config };

  // Initialize confetti when active
  useEffect(() => {
    if (isActive && !isPlaying) {
      setIsPlaying(true);
      endTimeRef.current = Date.now() + mergedConfig.duration;
      ticksRef.current = 0;
      initConfetti();
    }
  }, [isActive, isPlaying, mergedConfig.duration]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw different shapes
  const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, shape: ConfettiShape, color: string) => {
    ctx.fillStyle = color;
    
    switch (shape) {
      case "square":
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
        
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case "star":
        drawStar(ctx, 0, 0, 5, size/2, size/4);
        break;
        
      case "crescent":
        drawCrescent(ctx, 0, 0, size/2);
        break;
        
      case "triangle":
        drawTriangle(ctx, 0, 0, size);
        break;
        
      default:
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }
  };
  
  // Helper function to draw a star
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };
  
  // Helper function to draw a crescent
  const drawCrescent = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx - radius/3, cy, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };
  
  // Helper function to draw a triangle
  const drawTriangle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    const height = size * 0.866; // Equilateral triangle height
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - height/2);
    ctx.lineTo(cx - size/2, cy + height/2);
    ctx.lineTo(cx + size/2, cy + height/2);
    ctx.closePath();
    ctx.fill();
  };

  // Initialize confetti particles
  const initConfetti = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const particles: ConfettiParticle[] = [];
    const shapes = mergedConfig.shapes || ["square"];
    
    for (let i = 0; i < mergedConfig.particleCount; i++) {
      // Distribute particles more naturally across the screen
      const startX = canvas.width * (0.25 + Math.random() * 0.5); // Middle 50% of screen width
      
      particles.push({
        x: startX + ((Math.random() - 0.5) * mergedConfig.spread * 2),
        y: canvas.height * (Math.random() * 0.3), // Top 30% of screen
        size: Math.random() * mergedConfig.particleSize + 3,
        color: mergedConfig.colors[Math.floor(Math.random() * mergedConfig.colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * mergedConfig.spread / 10,
          y: Math.random() * mergedConfig.startVelocity,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        drift: (Math.random() - 0.5) * mergedConfig.drift!,
        tilt: Math.random() * 10
      });
    }
    particlesRef.current = particles;

    // Start animation
    animateConfetti();
  };

  // Animate confetti particles
  const animateConfetti = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let stillActive = false;
    ticksRef.current++;
    
    // Create a bit of wind effect that changes over time
    const windFactor = Math.sin(ticksRef.current / 50) * 0.2;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      
      // Apply physics
      p.velocity.y += mergedConfig.gravity;
      p.x += p.velocity.x + p.drift + windFactor; // Add drift and wind
      p.y += p.velocity.y;
      p.rotation += p.rotationSpeed;
      
      // Fade effect - faster for particles that have fallen further
      p.opacity -= 0.01 + Math.max(0, p.y / (canvas.height * 2)) * 0.01;
      
      // Apply decay
      p.velocity.y *= mergedConfig.decay;
      p.velocity.x *= mergedConfig.decay;
      
      // Draw the confetti
      if (p.opacity > 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        
        // Draw the specific shape
        drawShape(ctx, 0, 0, p.size, p.rotation, p.shape, p.color);
        
        ctx.restore();
        
        // Check if particle is still active and in view
        if (p.y < canvas.height + p.size) {
          stillActive = true;
        }
      }
    }

    // Continue animation if particles are active and within duration and max ticks
    if (stillActive && Date.now() < endTimeRef.current && 
        (mergedConfig.ticks === undefined || ticksRef.current < mergedConfig.ticks)) {
      animationRef.current = requestAnimationFrame(animateConfetti);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full"
      style={{ display: isPlaying ? "block" : "none" }}
      aria-hidden="true"
    />
  );
} 