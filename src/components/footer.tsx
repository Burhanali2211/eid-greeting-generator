"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Heart, 
  Github, 
  Twitter, 
  Instagram, 
  Mail, 
  Smartphone, 
  Send,
  MoonStar
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative pt-16 pb-10 overflow-hidden bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-eid-gold-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-eid-emerald-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl mx-auto lantern-pattern-bg opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          {/* Logo and tagline */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block group">
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 mr-3 bg-gradient-to-tr from-eid-gold-300 to-eid-gold-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <MoonStar className="h-5 w-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-eid-emerald-600 to-eid-gold-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-eid-gold-500 group-hover:to-eid-emerald-600">
                  Eid Greeting Generator
                </h2>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mt-4 max-w-md">
              Create beautiful Eid greetings and share joy with interactive Eidi cards. Our platform makes collecting Eidi fun and engaging during the blessed Eid season.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4 mt-6">
              <Link href="https://github.com/yourusername/eid-greeting-generator" target="_blank" rel="noopener noreferrer">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Github size={18} />
                </motion.div>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Twitter size={18} />
                </motion.div>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F58529] to-[#DD2A7B] flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Instagram size={18} />
                </motion.div>
              </Link>
              <Link href="mailto:contact@eid-greeting.com" target="_blank" rel="noopener noreferrer">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-eid-emerald-500 to-eid-emerald-600 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Mail size={18} />
                </motion.div>
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
              <div className="w-5 h-0.5 bg-eid-gold-400 mr-2"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-eid-emerald-600 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-eid-emerald-500 mr-2 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-eid-emerald-600 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-eid-emerald-500 mr-2 transition-colors"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="#create-greeting" 
                  className="text-gray-600 hover:text-eid-emerald-600 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-eid-emerald-500 mr-2 transition-colors"></span>
                  Create Card
                </Link>
              </li>
            </ul>
        </div>
          
          {/* Legal Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
              <div className="w-5 h-0.5 bg-eid-gold-400 mr-2"></div>
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
          <Link 
            href="/privacy" 
                  className="text-gray-600 hover:text-eid-emerald-600 transition-colors flex items-center group"
          >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-eid-emerald-500 mr-2 transition-colors"></span>
            Privacy Policy
          </Link>
              </li>
              <li>
          <Link 
            href="/terms" 
                  className="text-gray-600 hover:text-eid-emerald-600 transition-colors flex items-center group"
          >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-eid-emerald-500 mr-2 transition-colors"></span>
            Terms of Service
          </Link>
              </li>
              <li>
                <Link 
                  href="https://github.com/yourusername/eid-greeting-generator" 
                  className="text-gray-600 hover:text-eid-emerald-600 transition-colors flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-eid-emerald-500 mr-2 transition-colors"></span>
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
              <div className="w-5 h-0.5 bg-eid-gold-400 mr-2"></div>
              Stay Connected
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for updates, new features and Eid celebrations
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-eid-emerald-500 focus:border-transparent transition-all duration-300 pr-10"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={16} />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 hover:from-eid-emerald-600 hover:to-eid-emerald-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium flex items-center justify-center sm:justify-start"
              >
                <span>Subscribe</span>
                <Send size={14} className="ml-2" />
              </button>
            </form>
            
            {/* Contact info */}
            <div className="mt-6 flex flex-col space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2 text-eid-emerald-500" />
                <a href="mailto:contact@eid-greeting.com" className="hover:text-eid-emerald-600 transition-colors">
                  contact@eid-greeting.com
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Smartphone size={14} className="mr-2 text-eid-emerald-500" />
                <span>+91 12345 67890</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="mr-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <MoonStar size={16} className="text-eid-gold-500" />
            </div>
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Eid Greeting Generator. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
            <p className="flex items-center text-sm text-gray-500">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse-soft" /> for the Eid celebration
            </p>
            
            {/* Arabic Greeting */}
            <div className="font-arabic text-lg text-eid-gold-600">
              عيد مبارك
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 