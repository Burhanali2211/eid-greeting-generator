import React from 'react';

export const EidLampIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M9 2h6" />
    <path d="M12 2v3" />
    <path d="M8 5h8l-1 9c0 2-1.5 3-3 3s-3-1-3-3Z" />
    <path d="M7 14c-1.5-1-2-3.5-2-6 0-3.5 3-4 3-4" />
    <path d="M17 14c1.5-1 2-3.5 2-6 0-3.5-3-4-3-4" />
    <path d="M8 21h8" />
    <path d="M9 18v3" />
    <path d="M15 18v3" />
  </svg>
);

export const EidMoonIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M19 3v4" />
    <path d="M21 5h-4" />
  </svg>
);

export const EidMosqueIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M4 22V7c0-1 .7-1.9 1.5-2.8C6.8 3 9 2 12 2s5.2 1 6.5 2.2c.8.9 1.5 1.8 1.5 2.8v15" />
    <path d="M12 22v-9.3" />
    <path d="M4 9v6c0-6 8-6 8-6s8 0 8 6V9" />
    <path d="M16 22v-5a2 2 0 1 0-4 0" />
    <path d="M4 17c0-3 3-5 8-5s8 2 8 5" />
    <path d="M15 22h4" />
    <path d="M5 22h4" />
  </svg>
);

export const EidGiftBoxIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

export const EidPrayerMatIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M18 5V3" />
    <path d="M6 5V3" />
    <path d="M12 5V3" />
    <path d="M18 21v-2" />
    <path d="M6 21v-2" />
    <path d="M12 21v-2" />
    <path d="M2 12h20" />
  </svg>
);

// Islamic geometric pattern background
export const PatternBackground = ({ className = "", ...props }) => (
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M10,0L0,10L10,20L20,10L10,0z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="20" cy="0" r="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="0" cy="20" r="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="20" cy="20" r="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
  </svg>
); 