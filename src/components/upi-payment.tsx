"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { 
  QrCode, 
  CreditCard, 
  Send, 
  AlertCircle, 
  Copy, 
  CheckCircle, 
  Loader2, 
  Share2, 
  Smartphone, 
  RotateCcw,
  Wallet,
  ShieldCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface UpiPaymentProps {
  amount: number;
  upiId: string;
  recipientName?: string;
  onSuccess?: () => void;
  greetingId?: string; // To identify the greeting for notification purposes
}

export function UpiPayment({ amount, upiId, recipientName, onSuccess, greetingId }: UpiPaymentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copiedUpiId, setCopiedUpiId] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  
  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Generate QR code URL
  useEffect(() => {
    if (!upiId || !amount) {
      setQrError(true);
      return;
    }
    
    try {
      // Encode UPI data for QR code
      const upiData = {
        pa: upiId, // Payee address (UPI ID)
        pn: recipientName || "Eid Gift", // Payee name
        am: amount.toString(), // Amount
        cu: "INR", // Currency
        tn: `Eid Gift of ₹${amount}` // Transaction note
      };
      
      // Create URL-encoded string of UPI parameters
      const upiParams = Object.entries(upiData)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      // Build the UPI URL
      const upiUrl = `upi://pay?${upiParams}`;
      
      // Generate QR code using Google Charts API
      const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiUrl)}&choe=UTF-8`;
      
      setQrCodeUrl(qrUrl);
      setQrLoading(true); // Will turn false when image loads
      setQrError(false);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setQrError(true);
      setQrLoading(false);
      toast.error("Failed to generate QR code");
    }
  }, [upiId, amount, recipientName]);
  
  // Track when QR code is loaded
  const handleQrLoaded = useCallback(() => {
    setQrLoading(false);
  }, []);
  
  // Handle QR code loading error
  const handleQrError = useCallback(() => {
    setQrLoading(false);
    setQrError(true);
    toast.error("Could not load QR code");
  }, []);
  
  // Copy UPI ID to clipboard
  const copyUpiId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpiId(true);
      toast.success("UPI ID copied to clipboard");
      
      // Reset copy state after 3 seconds
      setTimeout(() => {
        setCopiedUpiId(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy UPI ID:", error);
      toast.error("Failed to copy UPI ID");
    }
  }, [upiId]);
  
  // Generate payment app deep links
  const getPaymentAppLink = useCallback((app: string): string => {
    try {
      // Base data for UPI payment
      const upiData = {
        pa: upiId, // Payee address (UPI ID)
        pn: recipientName || "Eid Gift", // Payee name
        am: amount.toString(), // Amount
        cu: "INR", // Currency
        tn: `Eid Gift of ₹${amount}` // Transaction note
      };
      
      // Create URL-encoded string of UPI parameters
      const upiParams = Object.entries(upiData)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      // Build the UPI URL
      const upiUrl = `upi://pay?${upiParams}`;
      
      // App-specific deep links
      switch (app.toLowerCase()) {
        case 'googlepay':
        case 'gpay':
          return `gpay://upi/pay?${upiParams}`;
        
        case 'phonepe':
          return `phonepe://pay?${upiParams}`;
        
        case 'paytm':
          return `paytmmp://pay?${upiParams}`;
          
        case 'bhim':
          return `upi://pay?${upiParams}`;
        
        default:
          return upiUrl; // Default UPI URL for other apps
      }
    } catch (error) {
      console.error(`Error generating ${app} payment link:`, error);
      // Return a basic UPI URL as fallback
      return `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount}&cu=INR`;
    }
  }, [upiId, amount, recipientName]);
  
  // Open payment app
  const openPaymentApp = useCallback((app: string) => {
    try {
      setSelectedApp(app);
      const link = getPaymentAppLink(app);
      
      // Create and click a temporary link to open the app
      const tempLink = document.createElement('a');
      tempLink.href = link;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      // Show toast notification
      toast.success(`Opening ${app}...`, {
        icon: '📱',
      });
      
      // Simulate a delay before allowing marking payment as complete
      setTimeout(() => {
        setSelectedApp(null);
      }, 2000);
    } catch (error) {
      console.error(`Error opening ${app}:`, error);
      toast.error(`Failed to open ${app}`);
      setSelectedApp(null);
    }
  }, [getPaymentAppLink]);
  
  // Share UPI details
  const shareUpiDetails = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Eid Gift Payment',
          text: `Please pay ₹${amount} to ${upiId} for Eid Gift.`,
          url: `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount}&cu=INR`
        });
        toast.success('Shared payment details successfully');
      } else {
        // Fallback for browsers that don't support native sharing
        copyUpiId();
      }
    } catch (error) {
      console.error('Error sharing UPI details:', error);
      toast.error('Failed to share payment details');
    }
  }, [amount, upiId, copyUpiId]);
  
  // Notify sender of payment
  const notifySender = useCallback(async () => {
    if (!greetingId) return;
    
    setIsNotifying(true);
    
    try {
      // We would implement the notification logic here
      // For example, calling a serverless function or API endpoint
      // For demo, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Payment notification sent to sender');
    } catch (error) {
      console.error('Error notifying sender:', error);
      toast.error('Failed to notify sender');
    } finally {
      setIsNotifying(false);
    }
  }, [greetingId]);
  
  // Mark payment as complete
  const handlePaymentComplete = useCallback(async () => {
    setPaymentSuccessful(true);
    toast.success('Payment marked as complete', {
      icon: '🎉',
    });
    
    // Trigger confetti effect
    try {
      const confetti = require('canvas-confetti');
      if (qrContainerRef.current) {
        const rect = qrContainerRef.current.getBoundingClientRect();
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
    } catch (error) {
      console.error('Error with confetti:', error);
      // Continue even if confetti fails
    }
    
    // Notify sender if greeting ID is provided
    if (greetingId) {
      await notifySender();
    }
    
    // Call the onSuccess callback if provided
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  }, [onSuccess, greetingId, notifySender]);
  
  // Retry generating QR code
  const retryQrCode = useCallback(() => {
    setQrLoading(true);
    setQrError(false);
    
    // Re-generate the QR code URL
    const upiData = {
      pa: upiId,
      pn: recipientName || "Eid Gift",
      am: amount.toString(),
      cu: "INR",
      tn: `Eid Gift of ₹${amount}`
    };
    
    const upiParams = Object.entries(upiData)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const upiUrl = `upi://pay?${upiParams}`;
    const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiUrl)}&choe=UTF-8`;
    
    setQrCodeUrl(qrUrl);
  }, [upiId, amount, recipientName]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* QR Code Section - Improved card styling and responsive layout */}
      <div 
        ref={qrContainerRef}
        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-md border border-gray-200 transition-all duration-300"
      >
        <div className="text-center mb-3 md:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" />
            <span>Scan QR Code</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Use any UPI app to scan and pay
          </p>
        </div>
        
        <div className="relative w-36 h-36 xs:w-44 xs:h-44 sm:w-56 sm:h-56 mb-3">
          {qrLoading && !qrError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="sr-only">Loading QR code...</span>
            </div>
          )}
          
          {qrError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 rounded-lg border border-red-100 p-4">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-sm text-red-600 font-medium text-center mb-3">
                Failed to load QR code
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={retryQrCode}
                className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-red-600 text-sm font-medium shadow-sm hover:bg-red-50 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try again
              </motion.button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!qrLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative qr-container glass-card bg-white shadow-lg rounded-lg p-3 border border-gray-200"
                >
                  <Image
                    src={qrCodeUrl}
                    alt="UPI Payment QR Code"
                    fill
                    className="object-contain p-1"
                    onLoad={handleQrLoaded}
                    onError={handleQrError}
                    priority
                  />
                  
                  {/* Amount overlay with improved styling */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 shadow-md rounded-full border border-purple-200 text-sm text-purple-800 font-medium">
                    ₹{amount}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        
        <div className="mt-3 md:mt-4 w-full">
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 mb-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate px-2 max-w-[calc(100%-90px)]">
              {upiId}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyUpiId}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 shadow-sm transition-colors"
            >
              {copiedUpiId ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy ID</span>
                </>
              )}
            </motion.button>
          </div>
          
          {/* Mobile-specific share button for better mobile UX */}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareUpiDetails}
              disabled={paymentSuccessful}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 text-sm shadow-sm transition-colors ${
                paymentSuccessful ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Share Payment Details</span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Payment Apps Section with improved styling and layout */}
      <div className="flex flex-col">
        <div className="text-center mb-3 md:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-500" />
            <span>Pay Using Apps</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Click on an app to pay
          </p>
        </div>
        
        {/* More responsive grid layout for payment apps */}
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3 mb-4 md:mb-6">
          {/* Google Pay */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openPaymentApp('googlepay')}
            disabled={paymentSuccessful}
            className={`p-2 xs:p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition-all ${
              paymentSuccessful ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mb-2">
                <Image
                  src="/images/payment/gpay.png"
                  alt="Google Pay"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/48x48/5F6368/FFFFFF?text=GPay";
                  }}
                />
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700">Google Pay</span>
            </div>
          </motion.button>
          
          {/* PhonePe */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openPaymentApp('phonepe')}
            disabled={paymentSuccessful}
            className={`p-2 xs:p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition-all ${
              paymentSuccessful ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mb-2">
                <Image
                  src="/images/payment/phonepe.png"
                  alt="PhonePe"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/48x48/5F259F/FFFFFF?text=PhonePe";
                  }}
                />
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700">PhonePe</span>
            </div>
          </motion.button>
          
          {/* Paytm */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openPaymentApp('paytm')}
            disabled={paymentSuccessful}
            className={`p-2 xs:p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition-all ${
              paymentSuccessful ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mb-2">
                <Image
                  src="/images/payment/paytm.png"
                  alt="Paytm"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/48x48/00BAF2/FFFFFF?text=Paytm";
                  }}
                />
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700">Paytm</span>
            </div>
          </motion.button>
          
          {/* BHIM UPI */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openPaymentApp('bhim')}
            disabled={paymentSuccessful}
            className={`p-2 xs:p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition-all ${
              paymentSuccessful ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mb-2">
                <Image
                  src="/images/payment/bhim.png"
                  alt="BHIM UPI"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/48x48/1560bd/FFFFFF?text=BHIM";
                  }}
                />
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700">BHIM UPI</span>
            </div>
          </motion.button>
        </div>
        
        {/* Payment status and action buttons */}
        <div className="mt-auto space-y-3">
          {/* Payment details - Enhanced UX element */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center">
              <Wallet className="w-4 h-4 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-gray-800">Amount to pay:</span>
            </div>
            <span className="text-base font-semibold text-amber-600">₹{amount}</span>
          </div>
          
          {/* Share button - desktop only */}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareUpiDetails}
              disabled={paymentSuccessful}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 shadow-sm transition-colors ${
                paymentSuccessful ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Share Payment Details</span>
            </motion.button>
          )}
          
          {/* Payment complete button - enhanced with notification status */}
          <motion.button
            whileHover={{ scale: paymentSuccessful ? 1 : 1.02, boxShadow: paymentSuccessful ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: paymentSuccessful ? 1 : 0.98 }}
            onClick={handlePaymentComplete}
            disabled={paymentSuccessful || isNotifying}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white shadow-md transition-all ${
              isNotifying 
                ? "bg-purple-600 cursor-wait"
                : paymentSuccessful
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            }`}
          >
            {isNotifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Notifying Sender...</span>
              </>
            ) : paymentSuccessful ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Payment Completed!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>I've Made the Payment</span>
              </>
            )}
          </motion.button>
          
          {/* Payment status - show after success */}
          {paymentSuccessful && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-green-700 bg-green-50 rounded-lg p-3 border border-green-100"
            >
              <p className="flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                {greetingId ? "Sender has been notified of your payment" : "Payment marked as complete"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 