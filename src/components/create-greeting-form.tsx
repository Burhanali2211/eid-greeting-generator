"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Send, Gift, Sparkles, MoonStar, MessageCircle, CreditCard, Check, Info, AlertCircle } from "lucide-react";
import { EidiCard } from "./eidi-card";
import { UpiPayment } from "./upi-payment";
import confetti from "canvas-confetti";

// Enhanced validation schema with more helpful error messages
const formSchema = z.object({
  yourName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  recipientName: z
    .string()
    .min(2, { message: "Recipient name must be at least 2 characters" })
    .max(50, { message: "Recipient name cannot exceed 50 characters" }),
  message: z
    .string()
    .min(5, { message: "Please write a message with at least 5 characters" })
    .max(200, { message: "Message cannot exceed 200 characters" }),
  upiId: z
    .string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, {
      message: "Please enter a valid UPI ID (e.g., name@upi)",
    }),
});

type FormData = z.infer<typeof formSchema>;

const CARD_COUNT = 6;
const INITIAL_AMOUNT_RANGE = [51, 101, 151, 201, 251, 501];

export function CreateGreetingForm() {
  const router = useRouter();
  const confettiRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Form state with improved error handling
  const [formData, setFormData] = useState<Partial<FormData>>({
    yourName: "",
      recipientName: "",
    message: "",
    upiId: "",
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  
  // Card selection state
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(null);
  const [cardAmounts, setCardAmounts] = useState<number[]>([]);
  
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Initialize random amounts
  useEffect(() => {
    // Randomize within ranges to make it more interesting
    const amounts = INITIAL_AMOUNT_RANGE.map((baseAmount) => {
      const variance = Math.floor(baseAmount * 0.2); // 20% variance
      return baseAmount - variance + Math.floor(Math.random() * (variance * 2));
    });
    setCardAmounts(amounts);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle form field changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormTouched((prev) => ({ ...prev, [name]: true }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate a specific field
  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = z.object({ [name]: formSchema.shape[name as keyof FormData] });
      fieldSchema.parse({ [name]: value });
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === name);
        return fieldError?.message || "Invalid input";
      }
      return "Validation error";
    }
  };

  // Validate form on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!formTouched[name]) return;
    
    const error = validateField(name, value);
      if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle card selection
  const handleCardSelect = (index: number) => {
    if (revealedCardIndex !== null) return;
    
    setSelectedCardIndex(index);
    
    // Trigger confetti on selection
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
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

  // Validate entire form
  const validateForm = () => {
    try {
      formSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle the "Next" button in the form
  const handleNext = () => {
    // Mark all fields as touched
    const fields = Object.keys(formSchema.shape);
    const newTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setFormTouched(newTouched);
    
    if (validateForm()) {
      setStep(2);
      
      // Scroll to top on mobile
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      } else {
      // Focus the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && formRef.current) {
        const element = formRef.current.elements.namedItem(firstErrorField);
        if (element instanceof HTMLElement) {
          element.focus();
        }
      }
    }
  };

  // Handle card reveal
  const handleRevealCard = () => {
    if (selectedCardIndex === null) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setRevealedCardIndex(selectedCardIndex);
      setIsLoading(false);
      
      // After revealing, show payment after a short delay
      setTimeout(() => {
        setShowPayment(true);
      }, 1000);
    }, 1500);
  };

  // Go back to form step
  const handleBack = () => {
    setStep(1);
    setSelectedCardIndex(null);
    setRevealedCardIndex(null);
    setShowPayment(false);
  };

  // Reset the entire form (to start over)
  const handleReset = () => {
    setFormData({
      yourName: "",
      recipientName: "",
      message: "",
      upiId: "",
    });
    setErrors({});
    setFormTouched({});
    setSelectedCardIndex(null);
    setRevealedCardIndex(null);
    setShowPayment(false);
    setStep(1);
    
    // Regenerate amounts
    const amounts = INITIAL_AMOUNT_RANGE.map((baseAmount) => {
      const variance = Math.floor(baseAmount * 0.2);
      return baseAmount - variance + Math.floor(Math.random() * (variance * 2));
    });
    setCardAmounts(amounts);
  };
  
  // Calculate character count for message
  const messageLength = formData.message?.length || 0;
  const messageMaxLength = 200;
  const messageWarning = messageLength > messageMaxLength - 30 && messageLength <= messageMaxLength;
  const messageExceeded = messageLength > messageMaxLength;

  return (
    <div ref={confettiRef} className="w-full max-w-3xl mx-auto relative">
      {/* Progress indicator */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <motion.div 
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full 
                       ${step === 1 ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg" : "bg-emerald-500"}
                       text-white font-medium transition-all`}
            animate={{ 
              scale: step === 1 ? [1, 1.05, 1] : 1,
            }}
            transition={{ 
              duration: 2, 
              repeat: step === 1 ? Infinity : 0, 
              repeatType: "reverse" 
            }}
          >
            <MessageCircle size={16} className={step === 1 ? "" : "opacity-70"} />
          </motion.div>
          
          <div className={`h-0.5 w-8 sm:w-12 ${step > 1 ? "bg-emerald-500" : "bg-gray-300"} transition-colors duration-500`}></div>
          
          <motion.div 
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full 
                       ${step === 2 ? "bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg" : 
                                    step > 2 ? "bg-purple-500" : "bg-gray-300"}
                       text-white font-medium transition-all`}
            animate={{ 
              scale: step === 2 ? [1, 1.05, 1] : 1,
            }}
            transition={{ 
              duration: 2, 
              repeat: step === 2 ? Infinity : 0, 
              repeatType: "reverse" 
            }}
          >
            <Gift size={16} className={step >= 2 ? "" : "opacity-70"} />
          </motion.div>
          
          <div className={`h-0.5 w-8 sm:w-12 ${step > 2 ? "bg-amber-500" : "bg-gray-300"} transition-colors duration-500`}></div>
          
          <motion.div 
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full 
                       ${step === 3 ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg" : "bg-gray-300"}
                       text-white font-medium transition-all`}
            animate={{ 
              scale: step === 3 ? [1, 1.05, 1] : 1,
            }}
            transition={{ 
              duration: 2, 
              repeat: step === 3 ? Infinity : 0, 
              repeatType: "reverse" 
            }}
          >
            <CreditCard size={16} className={step >= 3 ? "" : "opacity-70"} />
          </motion.div>
                </div>
              </div>
              
      {/* Form container with animated transitions */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-2xl p-5 sm:p-8 transition-all glass-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            <div className="flex items-center mb-6">
              <MoonStar className="text-emerald-500 mr-3" size={24} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Create Your Eid Greeting</h2>
      </div>
      
            <div className="text-sm text-gray-600 mb-6 flex items-start space-x-2">
              <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p>
                Fill in the details below to create a personalized Eid greeting. 
                Recipients will pick a mystery card to reveal their Eidi amount!
              </p>
                  </div>
                  
            <div className="space-y-5">
              <div className="form-group">
                <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="yourName"
                  name="yourName"
                  value={formData.yourName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1
                            ${errors.yourName 
                              ? "border-red-300 focus:ring-red-200" 
                              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"}`}
                />
                {errors.yourName && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                    {errors.yourName}
                      </p>
                    )}
                  </div>
                  
              <div className="form-group">
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient&apos;s Name
            </label>
                <input
                  type="text"
              id="recipientName"
                  name="recipientName"
                  value={formData.recipientName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
              placeholder="Enter recipient's name"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1
                            ${errors.recipientName 
                              ? "border-red-300 focus:ring-red-200" 
                              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"}`}
            />
            {errors.recipientName && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                    {errors.recipientName}
                      </p>
            )}
          </div>

              <div className="form-group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
                <textarea
              id="message"
                  name="message"
                  rows={3}
                  value={formData.message || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Write your Eid greeting message"
                  className={`w-full px-4 py-2.5 rounded-lg border resize-none transition-all focus:ring-2 focus:ring-offset-1
                            ${errors.message 
                              ? "border-red-300 focus:ring-red-200" 
                              : messageExceeded
                                ? "border-red-300 focus:ring-red-200"
                                : messageWarning
                                  ? "border-amber-300 focus:ring-amber-200"
                                  : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.message ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                      {errors.message}
                    </p>
                  ) : (
                    <span></span>
                  )}
                  <span 
                    className={`text-xs font-medium transition-colors
                              ${messageExceeded 
                                ? "text-red-500" 
                                : messageWarning
                                  ? "text-amber-500"
                                  : "text-gray-500"}`}
                  >
                    {messageLength}/{messageMaxLength}
                  </span>
                </div>
          </div>

              <div className="form-group">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                  Your UPI ID
              </label>
                <div className="relative">
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@upi"
                    className={`w-full px-4 py-2.5 pl-8 rounded-lg border transition-all focus:ring-2 focus:ring-offset-1
                              ${errors.upiId 
                                ? "border-red-300 focus:ring-red-200" 
                                : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"}`}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  </div>
                  
                {errors.upiId ? (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                    {errors.upiId}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    This is where the Eidi amount will be sent to
                                </p>
                              )}
                            </div>
                  </div>
                  
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white 
                          font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-lg 
                          hover:shadow-emerald-200/30 transition-all duration-200 flex items-center justify-center"
              >
                Continue to Select Cards
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
                      </div>
          </motion.form>
        )}
        
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-2xl p-5 sm:p-8 transition-all glass-card"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Gift className="mr-2 text-purple-500" size={24} />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Select a Mystery Card</h2>
                            </div>
              <p className="text-gray-600 text-sm">
                Choose one card below. Each card contains a random Eidi amount!
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
              {Array.from({ length: CARD_COUNT }).map((_, index) => (
                <div key={index} className="aspect-[3/4]">
                  <EidiCard
                    index={index}
                    amount={cardAmounts[index]}
                    isSelected={selectedCardIndex === index}
                    isRevealed={revealedCardIndex === index}
                    isLocked={revealedCardIndex !== null}
                    onClick={handleCardSelect}
                  />
                              </div>
              ))}
                  </div>
                  
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium 
                         hover:bg-gray-50 shadow-sm transition-all duration-200 w-full sm:w-1/3 flex-shrink-0"
                disabled={isLoading}
              >
                Back to Form
              </button>
              
              <motion.button
                    type="button"
                onClick={handleRevealCard}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white 
                         font-medium hover:from-purple-600 hover:to-purple-700 shadow-lg 
                         hover:shadow-purple-200/30 transition-all duration-200 w-full sm:w-2/3 
                         flex items-center justify-center disabled:opacity-70"
                disabled={selectedCardIndex === null || isLoading || revealedCardIndex !== null}
                whileHover={{ scale: selectedCardIndex !== null && !isLoading && revealedCardIndex === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedCardIndex !== null && !isLoading && revealedCardIndex === null ? 0.98 : 1 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Revealing Card...
                  </>
                ) : revealedCardIndex !== null ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Card Revealed!
                  </>
                ) : selectedCardIndex !== null ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Reveal Card
                      </>
                    ) : (
                  "Select a Card First"
                    )}
              </motion.button>
                </div>
          </motion.div>
            )}
            
        {step === 2 && showPayment && (
              <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 bg-white shadow-lg rounded-2xl p-5 sm:p-8 transition-all glass-card"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="mr-2 text-amber-500" size={24} />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Payment Details</h2>
              </div>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Your Eidi card is ready to send to{" "}
                <span className="font-medium text-purple-600">{formData.recipientName}</span>!
                Complete the payment below.
              </p>
            </div>

            {selectedCardIndex !== null && (
              <UpiPayment 
                amount={cardAmounts[selectedCardIndex]} 
                upiId={formData.upiId || ""} 
                recipientName={formData.yourName || ""}
                onSuccess={() => setStep(3)}
              />
            )}
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-2xl p-5 sm:p-8 text-center glass-card"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Complete!</h2>
              <p className="text-gray-600">
                Your Eidi greeting has been sent to {formData.recipientName}.
                They'll receive a message with a link to play your card game!
                    </p>
                  </div>
            
            <div className="py-4 px-6 bg-purple-50 rounded-xl mb-6">
              <h3 className="font-medium text-purple-800 mb-2">Your message:</h3>
              <p className="text-gray-700 italic">"{formData.message}"</p>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white 
                         font-medium hover:from-amber-600 hover:to-amber-700 shadow-lg 
                         hover:shadow-amber-200/30 transition-all duration-200"
              >
                Create Another Greeting
              </button>
                </div>
              </motion.div>
            )}
      </AnimatePresence>
    </div>
  );
} 