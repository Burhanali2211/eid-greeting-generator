"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Info, AlertCircle, MoonStar, User, MessageSquare, Wallet, Star, Sparkles } from "lucide-react";
import { z } from "zod";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

// Enhanced validation schema
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

// Suggested Eid messages for quick selection
const SUGGESTED_MESSAGES = [
  "Eid Mubarak! May this blessed day bring joy to your life.",
  "Wishing you and your family a joyous Eid celebration!",
  "May the magic of Eid bring love and happiness to you.",
  "Sending warm Eid greetings and best wishes your way!",
];

type FormData = z.infer<typeof formSchema>;

export default function CreateCardPage() {
  const router = useRouter();
  const [formData, setFormData] = useLocalStorage<Partial<FormData>>("eid-greeting-form", {
    yourName: "",
    recipientName: "",
    message: "",
    upiId: "",
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Handle form field changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
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
  
  // Handle message suggestion selection
  const handleSuggestionSelect = (message: string) => {
    setFormData({ ...formData, message });
    setShowSuggestions(false);
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
  
  // Validate the entire form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value as string);
      if (error) {
        newErrors[name] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // All fields are valid, proceed to next step
      router.push("/create-card/design");
    }
  };
  
  // Calculate character count for message
  const messageLength = formData.message?.length || 0;
  const messageMaxLength = 200;
  const messageWarning = messageLength > messageMaxLength - 30 && messageLength <= messageMaxLength;
  const messageExceeded = messageLength > messageMaxLength;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
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

      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        <div className="text-center mb-12">
          {/* Arabic Eid greeting */}
          <div className="mb-6 text-4xl font-arabic text-eid-gold-600 opacity-90 animate-float">
            عيد مبارك
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-eid-emerald-600 via-eid-gold-500 to-eid-purple-600">
            Create Your Eid Collection Card
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start by filling out your details below. After this, you'll create your interactive card experience.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Progress indicator */}
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-eid-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-8 border border-eid-gold-100">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 flex items-center justify-center shadow-lg">
                <MoonStar className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Step 1: Your Details</h3>
                <p className="text-sm text-gray-500">Fill in the information to create your Eid greeting</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Name field */}
                <div className="form-group">
                  <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="yourName"
                      name="yourName"
                      value={formData.yourName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your name"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2
                                ${errors.yourName 
                                  ? "border-red-300 focus:border-red-300 focus:ring-red-100" 
                                  : "border-gray-200 focus:border-eid-emerald-500 focus:ring-eid-emerald-100"}`}
                    />
                  </div>
                  {errors.yourName && (
                    <p className="mt-1.5 text-red-500 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                      {errors.yourName}
                    </p>
                  )}
                </div>

                {/* Recipient Name field */}
                <div className="form-group">
                  <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient's Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      value={formData.recipientName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter recipient's name"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2
                                ${errors.recipientName 
                                  ? "border-red-300 focus:border-red-300 focus:ring-red-100" 
                                  : "border-gray-200 focus:border-eid-emerald-500 focus:ring-eid-emerald-100"}`}
                    />
                  </div>
                  {errors.recipientName && (
                    <p className="mt-1.5 text-red-500 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                      {errors.recipientName}
                    </p>
                  )}
                </div>
              </div>

              {/* Message field */}
              <div className="form-group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <MessageSquare size={18} />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Write your Eid greeting message"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 resize-none
                              ${errors.message 
                                ? "border-red-300 focus:border-red-300 focus:ring-red-100" 
                                : messageExceeded
                                  ? "border-red-300 focus:border-red-300 focus:ring-red-100"
                                  : messageWarning
                                    ? "border-amber-300 focus:border-amber-300 focus:ring-amber-100"
                                    : "border-gray-200 focus:border-eid-emerald-500 focus:ring-eid-emerald-100"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-eid-emerald-500 transition-colors"
                  >
                    <Sparkles size={18} />
                  </button>
                </div>
                
                {/* Message suggestions */}
                {showSuggestions && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-600 mb-2">Suggested Messages:</div>
                    <div className="space-y-2">
                      {SUGGESTED_MESSAGES.map((msg, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionSelect(msg)}
                          className="w-full text-left text-sm p-2 rounded hover:bg-white hover:shadow-sm transition-all duration-200"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-1.5">
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

              {/* UPI ID field */}
              <div className="form-group">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                  Your UPI ID
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Wallet size={18} />
                  </div>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@upi"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2
                              ${errors.upiId 
                                ? "border-red-300 focus:border-red-300 focus:ring-red-100" 
                                : "border-gray-200 focus:border-eid-emerald-500 focus:ring-eid-emerald-100"}`}
                  />
                </div>
                
                {errors.upiId ? (
                  <p className="mt-1.5 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                    {errors.upiId}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                    <Info size={12} className="mr-1" />
                    This is where the Eidi amount will be sent to
                  </p>
                )}
              </div>

              {/* Submit button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 
                            text-white font-medium shadow-lg shadow-eid-emerald-100 hover:shadow-eid-emerald-200 
                            transform hover:translate-y-[-1px] transition-all duration-200 
                            flex items-center justify-center group"
                >
                  <span className="mr-2">Continue to Design Cards</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 right-4 text-eid-gold-400 animate-float">
          <Star className="w-6 h-6 fill-current opacity-40" />
        </div>
        <div className="absolute top-4 left-4 text-eid-emerald-400 animate-float animation-delay-2000">
          <MoonStar className="w-5 h-5 fill-current opacity-30" />
        </div>
      </div>
    </div>
  );
} 