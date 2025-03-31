"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Gift, Github, Star, Menu, X, MoonStar, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    // Set up scroll listener
    window.addEventListener("scroll", handleScroll);
    
    // On first render, check if we should highlight dashboard
    const storedVisitStatus = localStorage.getItem("hasVisitedBefore");
    if (storedVisitStatus === "true") {
      setHasVisited(true);
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  // Record that the user has visited
  const markAsVisited = () => {
    if (!hasVisited) {
      localStorage.setItem("hasVisitedBefore", "true");
      setHasVisited(true);
    }
  };

  return (
    <header 
      className={`py-4 border-b backdrop-blur-md sticky top-0 z-30 transition-all duration-300 ${
        scrolled 
          ? "border-gray-200 bg-white/90 shadow-sm"
          : "border-transparent bg-white/80"
      }`}
    >
      {/* Rainbow gradient bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-eid-emerald-500 via-eid-gold-500 to-eid-purple-500"></div>
      
      {/* Decorative elements with improved visibility */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-dashed border-eid-gold-300 rounded-full animate-spin-slow"></div>
        <div className="absolute top-4 right-10 w-24 h-24 border-2 border-dashed border-eid-emerald-300 rounded-full"></div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 border-2 border-dashed border-eid-purple-300 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center group">
          <motion.div 
            className="h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3 relative overflow-hidden flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-eid-gold-300 to-eid-gold-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <Image
                src="/images/crescent-moon.svg"
                alt="Eid Greeting Generator"
                width={32}
                height={32}
                className="animate-float drop-shadow-md"
              />
            </div>
            
            {/* Decorative stars */}
            <motion.div 
              className="absolute top-1 right-1 text-eid-gold-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Star className="h-2 w-2 fill-current" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-1 left-1 text-eid-gold-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
            >
              <Star className="h-2 w-2 fill-current" />
            </motion.div>
          </motion.div>
          
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">
              <span className="bg-gradient-to-r from-eid-emerald-600 via-eid-gold-500 to-eid-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                Eid Greeting Generator
              </span>
            </h1>
            <p className="text-xs text-gray-500 -mt-1 hidden sm:flex items-center">
              <span className="mr-1">Share joy this Eid season</span>
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-eid-gold-400"></span>
              </motion.span>
            </p>
          </div>
        </Link>
        
        {/* Mobile menu button with animation */}
        <div className="block sm:hidden">
          <motion.button 
            className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        
        {/* Desktop navigation with enhanced styling */}
        <nav className="hidden sm:flex space-x-1">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1.5 transition-all duration-300 rounded-full px-4 hover:bg-eid-emerald-50 hover:text-eid-emerald-700"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
          </Link>
          <Link href="/dashboard" onClick={markAsVisited}>
            <Button 
              variant="ghost" 
              className="flex items-center gap-1.5 transition-all duration-300 rounded-full px-4 hover:bg-eid-gold-50 hover:text-eid-gold-700 relative"
            >
              <Gift className="w-4 h-4" />
              <span>My Greetings</span>
              
              {/* New badge for first-time users */}
              {!hasVisited && (
                <motion.span 
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-eid-gold-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </Button>
          </Link>
          <Link href="https://github.com/yourusername/eid-greeting-generator" target="_blank">
            <Button 
              variant="outline" 
              className="flex items-center gap-1.5 ml-2 transition-all duration-300 rounded-full px-4 border-gray-200 hover:border-gray-300 hover:bg-white"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </Link>
          <Link href="#create-greeting">
            <Button 
              className="flex items-center gap-1.5 ml-2 transition-all duration-300 rounded-full bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 hover:shadow-md text-white px-4 group"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-pulse-soft" />
              <span>Create Card</span>
            </Button>
          </Link>
        </nav>
      </div>
      
      {/* Mobile navigation menu with animations */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div 
            className="sm:hidden bg-white border-t border-gray-100 shadow-lg absolute left-0 right-0 z-20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              className="flex flex-col p-3 space-y-1"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
            >
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -10 }
                }}
              >
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start py-3 flex items-center gap-2 hover:bg-eid-emerald-50 hover:text-eid-emerald-700 rounded-xl">
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -10 }
                }}
              >
                <Link href="/dashboard" onClick={() => { setIsMenuOpen(false); markAsVisited(); }}>
                  <Button variant="ghost" className="w-full justify-start py-3 flex items-center gap-2 hover:bg-eid-gold-50 hover:text-eid-gold-700 rounded-xl relative">
                    <Gift className="w-5 h-5" />
                    <span>My Greetings</span>
                    
                    {/* New badge for first-time users */}
                    {!hasVisited && (
                      <motion.div 
                        className="absolute top-3 right-3 flex items-center"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Star className="w-4 h-4 text-eid-gold-500 fill-current" />
                        <span className="text-xs font-medium ml-1 text-eid-gold-600">New</span>
                      </motion.div>
                    )}
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -10 }
                }}
              >
                <Link href="#create-greeting" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-2 justify-start py-3 flex items-center gap-2 bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 text-white rounded-xl">
                    <Sparkles className="w-5 h-5" />
                    <span>Create Collection Card</span>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -10 }
                }}
              >
                <Link href="https://github.com/yourusername/eid-greeting-generator" target="_blank" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start py-3 flex items-center gap-2 hover:bg-gray-50 rounded-xl">
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                variants={{
                  open: { opacity: 1 },
                  closed: { opacity: 0 }
                }}
                className="pt-3 mt-2 border-t border-gray-100 flex justify-center"
              >
                <div className="flex items-center text-xs text-gray-500">
                  <Heart className="h-3 w-3 mr-1 text-eid-emerald-500" />
                  <span>Share the joy of Eid</span>
                  <MoonStar className="h-3 w-3 ml-2 text-eid-gold-500" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 