"use client";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, ArrowRight, ArrowLeft, MoonStar, Info, AlertCircle, 
  Share2, Wallet, Calculator, Volume2, VolumeX, Sparkles, X, Clipboard 
} from "lucide-react";
import confetti from "canvas-confetti";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import dynamic from "next/dynamic";
import { EidiCard as EidiCardComponent } from "@/components/eidi-card";
import type { SpinWheelProps } from "@/components/spin-wheel";
import { toast } from "react-hot-toast";

// Lazy load components
const EidiCard = dynamic(() => Promise.resolve(EidiCardComponent), {
  loading: () => <div className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
});

const SpinWheel = dynamic<SpinWheelProps>(() => import("@/components/spin-wheel").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="w-64 h-64 bg-gray-100 rounded-full animate-pulse" />
});

// Define the constants for initial card amounts
const CARD_COUNT = 6;
const INITIAL_AMOUNT_RANGE = [51, 101, 151, 201, 251, 501];

// Suggested total budgets
const SUGGESTED_BUDGETS = [2000, 5000, 10000];

export default function DesignCardPage() {
  const router = useRouter();
  const confettiRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get form data from previous step
  const [formData] = useLocalStorage("eid-greeting-form", {
    yourName: "",
    recipientName: "",
    message: "",
    upiId: "",
  });
  
  // Card state
  const [cardAmounts, setCardAmounts] = useLocalStorage("eid-card-amounts", Array(CARD_COUNT).fill(0));
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom amount inputs
  const [customAmounts, setCustomAmounts] = useState<string[]>(Array(CARD_COUNT).fill(""));
  const [errors, setErrors] = useState<Record<number, string>>({});
  
  // Additional state
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize random amounts only on client side
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      // Only generate random amounts if they're all still 0
      if (cardAmounts.every(amount => amount === 0)) {
        const amounts = INITIAL_AMOUNT_RANGE.map((baseAmount) => {
          const variance = Math.floor(baseAmount * 0.2); // 20% variance
          return baseAmount - variance + Math.floor(Math.random() * (variance * 2));
        });
        setCardAmounts(amounts);
      }
      setIsInitialized(true);
    }
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [cardAmounts, setCardAmounts, isInitialized]);
  
  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/chime.mp3');
    }
  }, []);
  
  // Handle custom amount change
  const handleAmountChange = (index: number, value: string) => {
    const newCustomAmounts = [...customAmounts];
    newCustomAmounts[index] = value;
    setCustomAmounts(newCustomAmounts);
    
    // Clear error when typing
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };
  
  // Handle amount save
  const handleAmountSave = (index: number) => {
    const value = customAmounts[index];
    
    // Validate amount
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setErrors({ ...errors, [index]: "Please enter a valid amount" });
      return;
    }
    
    // Update card amount
    const newCardAmounts = [...cardAmounts];
    newCardAmounts[index] = Math.round(Number(value));
    setCardAmounts(newCardAmounts);
    
    // Clear custom amount and errors
    const newCustomAmounts = [...customAmounts];
    newCustomAmounts[index] = "";
    setCustomAmounts(newCustomAmounts);
    
    // Trigger confetti
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { 
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#16a34a', '#f59e0b', '#7c3aed', '#ef4444'],
        disableForReducedMotion: true
      });
    }
  };
  
  // Check if all required data is available
  const isDataComplete = () => {
    return (
      formData.yourName && 
      formData.recipientName && 
      formData.message && 
      formData.upiId && 
      cardAmounts.length === CARD_COUNT
    );
  };
  
  // Handle navigation back
  const handleBack = () => {
    router.push("/create-card");
  };
  
  // Handle navigation to next step
  const handleNext = () => {
    if (isDataComplete()) {
      router.push("/create-card/preview");
    }
  };
  
  // Play sound effect
  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore errors - user might not have interacted with the page yet
      });
    }
  };
  
  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Eid Collection Cards',
          text: 'Check out my Eid collection cards!',
          url: window.location.href
        });
      } else {
        setShowShareModal(true);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Handle smart suggestions
  const handleSuggestAmounts = () => {
    if (!totalBudget || totalBudget <= 0) return;

    // Calculate balanced amounts based on total budget
    const baseAmount = Math.floor(totalBudget / CARD_COUNT);
    const variance = Math.floor(baseAmount * 0.2); // 20% variance

    const amounts = Array.from({ length: CARD_COUNT }).map(() => {
      return baseAmount - variance + Math.floor(Math.random() * (variance * 2));
    });

    setCardAmounts(amounts);
    playSound();
  };
  
  // Handle spin wheel result
  const handleSpinResult = (discount: number) => {
    const discountedAmounts = cardAmounts.map(amount => 
      Math.round(amount * (1 - discount / 100))
    );
    setCardAmounts(discountedAmounts);
    setShowSpinWheel(false);
    
    // Show confetti
    if (confettiRef.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };
  
  // Generate cards
  const renderCards = () => {
    return Array.from({ length: CARD_COUNT }).map((_, index) => (
      <motion.div 
        key={index} 
        className="flex flex-col"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-eid-gold-300 to-eid-emerald-300 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <div className="relative">
            <EidiCard
              index={index}
              amount={cardAmounts[index] || 0}
              isSelected={selectedCardIndex === index}
              isRevealed={revealedCardIndex === index}
              isLocked={false}
              onClick={() => {}}
              onlyViewable={true}
            />
          </div>
        </div>
        
        <div className="mt-2 px-1 text-center">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-medium text-gray-600">Card {index + 1} Amount:</span>
            <span className="text-sm font-semibold text-emerald-600">₹{cardAmounts[index] || "—"}</span>
          </div>
          
          <div className="flex gap-1">
            <input
              type="number"
              value={customAmounts[index]}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              placeholder="Custom"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors[index] ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-emerald-200"
              } focus:outline-none focus:ring-2 transition-all`}
              min="1"
            />
            <button
              onClick={() => handleAmountSave(index)}
              className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 active:bg-emerald-700 transition-colors shadow-sm"
            >
              Set
            </button>
          </div>
          
          {errors[index] && (
            <p className="mt-1.5 text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-0.5 flex-shrink-0" />
              {errors[index]}
            </p>
          )}
        </div>
      </motion.div>
    ));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
      {/* Floating lantern animation */}
      <div className="absolute top-20 right-20 animate-float-lantern">
        <svg width="40" height="60" viewBox="0 0 40 60" className="text-eid-gold-400">
          {/* Add lantern SVG path here */}
        </svg>
      </div>

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-72 h-72 bg-eid-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-eid-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-eid-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Animated stars */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-eid-gold-300 rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-eid-gold-300 rounded-full animate-twinkle animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-eid-gold-300 rounded-full animate-twinkle animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative">
        {/* Arabic greeting with shimmer */}
        <div className="relative mb-6 text-center">
          <h1 className="text-4xl font-arabic text-eid-gold-600 opacity-90 animate-float">
            عيد مبارك
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 font-display bg-clip-text text-transparent bg-gradient-to-r from-eid-emerald-600 via-eid-gold-500 to-eid-purple-600">
            Design Your Eid Cards
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Customize the gift amounts for each card. Recipients will pick one to reveal their Eidi amount.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Progress indicator - improved for mobile */}
          <div className="absolute -top-4 sm:-top-6 left-0 right-0 flex justify-center">
            <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-eid-emerald-500"></div>
                <span className="ml-1.5 text-xs text-gray-500 hidden sm:inline">Details</span>
              </div>
              <div className="w-6 h-0.5 bg-gray-200"></div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-eid-emerald-500"></div>
                <span className="ml-1.5 text-xs text-gray-700 font-medium hidden sm:inline">Design</span>
              </div>
              <div className="w-6 h-0.5 bg-gray-200"></div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                <span className="ml-1.5 text-xs text-gray-500 hidden sm:inline">Preview</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-4 sm:p-8 border border-eid-gold-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                <Gift className="text-white" size={24} />
              </div>
              <div className="sm:ml-4 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Step 2: Customize Card Amounts</h3>
                <p className="text-sm text-gray-500">Each card has a default amount already set. You can customize these amounts to your preference.</p>
              </div>
            </div>

            {/* Smart suggestions section - improved for mobile */}
            <div className="mb-6 p-4 bg-eid-gold-50 rounded-xl border border-eid-gold-100">
              <h4 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">Quick Budget Distribution</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={totalBudget || ''}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      placeholder="Enter total budget"
                      className="flex-1 px-3 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-eid-emerald-500 focus:border-transparent focus:outline-none"
                    />
                    <button
                      onClick={handleSuggestAmounts}
                      className="px-3 py-2 bg-eid-gold-500 text-white rounded-lg hover:bg-eid-gold-600 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Calculator className="w-4 h-4" />
                      <span className="hidden sm:inline">Suggest</span>
                      <span className="sm:hidden">Set</span>
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SUGGESTED_BUDGETS.map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setTotalBudget(budget)}
                        className="px-3 py-1 text-sm bg-white border border-eid-gold-200 rounded-full hover:bg-eid-gold-50 transition-colors"
                      >
                        ₹{budget}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setShowSpinWheel(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-eid-purple-500 text-white rounded-lg hover:bg-eid-purple-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Spin & Win</span>
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <VolumeX className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Cards grid - improved for mobile */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" ref={confettiRef}>
              {renderCards()}
            </div>

            {/* Action buttons - improved for mobile */}
            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 
                            font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  <span className="hidden xs:inline">Back to Details</span>
                  <span className="xs:hidden">Back</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isDataComplete()}
                  className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 
                            text-white font-medium hover:from-eid-emerald-600 hover:to-eid-emerald-700 shadow-lg 
                            hover:shadow-emerald-200/30 transition-all duration-200 flex items-center justify-center
                            ${!isDataComplete() ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <span className="hidden xs:inline">Continue to Preview</span>
                  <span className="xs:hidden">Continue</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 rounded-xl border border-eid-purple-200 bg-eid-purple-50 
                            text-eid-purple-700 font-medium hover:bg-eid-purple-100 transition-all duration-200 
                            flex items-center justify-center"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  <span className="hidden xs:inline">Share Preview</span>
                  <span className="xs:hidden">Share</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 px-4 rounded-xl border border-eid-gold-200 bg-eid-gold-50 
                            text-eid-gold-700 font-medium hover:bg-eid-gold-100 transition-all duration-200 
                            flex items-center justify-center"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  <span className="hidden xs:inline">View Dashboard</span>
                  <span className="xs:hidden">Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modals - improved for mobile */}
        <AnimatePresence>
          {showSpinWheel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-5 max-w-md w-full mx-auto shadow-2xl"
              >
                <SpinWheel onResult={handleSpinResult} onClose={() => setShowSpinWheel(false)} />
              </motion.div>
            </motion.div>
          )}

          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-5 max-w-md w-full mx-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Share Your Cards</h3>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3 flex-wrap">
                    <button className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 min-w-[100px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                      </svg>
                      <span>WhatsApp</span>
                    </button>
                    <button className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 min-w-[100px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </button>
                    <button className="flex-1 py-2 px-3 bg-pink-500 text-white rounded-lg flex items-center justify-center gap-2 min-w-[100px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      <span>Instagram</span>
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Or copy this link:</p>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={typeof window !== 'undefined' ? window.location.href : ''}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-l-lg focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied!");
                        }}
                        className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200"
                      >
                        <Clipboard className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 