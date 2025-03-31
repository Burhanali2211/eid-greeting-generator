"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { EidiCard } from "@/components/eidi-card";
import { UpiPayment } from "@/components/upi-payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGreetingById, updateSelectedCard, expireGreeting, type Greeting } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { Confetti } from "@/components/ui/confetti";
import { motion } from "framer-motion";
import { 
  ChevronsUpDown, Share2, Gift, Heart, Copy, Download, Twitter, 
  Facebook, MessageCircle, Wallet, LayoutDashboard, Link2, ChevronRight,
  CheckCircle, QrCode, Send, CreditCard, AlertCircle, Info, Lock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

interface GreetingDisplayProps {
  initialGreeting: Greeting;
  isCreator?: boolean;
}

export function GreetingDisplay({ initialGreeting, isCreator = false }: GreetingDisplayProps) {
  const [greeting, setGreeting] = useState<Greeting>(initialGreeting);
  const [selectedCard, setSelectedCard] = useState<number | null>(
    initialGreeting.selected_card
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSuccessActions, setShowSuccessActions] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentNotified, setPaymentNotified] = useState(false);
  const [hasAccessed, setHasAccessed] = useState<boolean>(!!initialGreeting.viewed_by);
  const [isAccessExpired, setIsAccessExpired] = useState<boolean>(!!initialGreeting.is_expired);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isOneTimeView, setIsOneTimeView] = useState<boolean>(false);
  
  // Generate a stable user identifier if not already stored
  const [userIdentifier, setUserIdentifier] = useState<string>(() => {
    // Try to get from localStorage first to maintain consistency across visits
    const storedId = typeof localStorage !== 'undefined' ? localStorage.getItem('eid_user_id') : null;
    if (storedId) return storedId;
    
    // Otherwise generate a new one
    const newId = `user-${uuidv4()}`;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('eid_user_id', newId);
    }
    return newId;
  });

  // Subscribe to realtime updates for this greeting
  useEffect(() => {
    // Check if this is a one-time view greeting
    setIsOneTimeView(!isCreator && greeting.viewed_by !== null && greeting.viewed_by !== userIdentifier);
    
    const subscription = supabase
      .channel(`greeting:${greeting.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "greetings",
          filter: `id=eq.${greeting.id}`,
        },
        (payload) => {
          const updatedGreeting = payload.new as Greeting;
          setGreeting(updatedGreeting);
          // Update payment status if it has been marked as paid
          if (updatedGreeting && 'is_paid' in updatedGreeting && updatedGreeting.is_paid) {
            setIsPaid(true);
          }
          
          // Check if this is now a one-time view greeting
          setIsOneTimeView(!isCreator && updatedGreeting.viewed_by !== null && updatedGreeting.viewed_by !== userIdentifier);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [greeting.id, greeting.viewed_by, userIdentifier, isCreator]);

  // Show success actions after card reveal with a slight delay
  useEffect(() => {
    if (isRevealed && selectedCard !== null) {
      const timer = setTimeout(() => {
        setShowSuccessActions(true);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [isRevealed, selectedCard]);

  // Initialize the revealed state based on whether a card is already selected
  useEffect(() => {
    if (greeting.selected_card !== null) {
      setIsRevealed(true);
      setSelectedCard(greeting.selected_card);
      
      // Check if this greeting has already been viewed/accessed
      setHasAccessed(!!greeting.viewed_by);
      setIsAccessExpired(!!greeting.is_expired);
      // If there's a payment status, update it
      if ('is_paid' in greeting) {
        setIsPaid(!!greeting.is_paid);
      }
      
      // Add a small delay before showing success actions if card is already selected
      const timer = setTimeout(() => {
        setShowSuccessActions(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [greeting.selected_card, greeting.viewed_by, greeting.is_expired, greeting.is_paid]);

  // Refresh greeting data from the server with better error handling
  const refreshGreeting = useCallback(async () => {
    try {
      const { data, error } = await getGreetingById(greeting.id, userIdentifier);
      if (error) {
        console.error("Error refreshing greeting:", error);
        toast.error("Failed to refresh greeting data.");
        return;
      }
      
      if (data) {
        setGreeting(data);
        setSelectedCard(data.selected_card);
        
        // Update access status
        setHasAccessed(!!data.viewed_by);
        setIsAccessExpired(!!data.is_expired);
      }
    } catch (err) {
      console.error("Exception refreshing greeting:", err);
    }
  }, [greeting.id, userIdentifier]);

  // Handle card selection
  const handleCardSelect = async (index: number) => {
    // Prevent selection if not allowed (already selected, card is locked, or user is creator)
    if (greeting.selected_card !== null || isCreator || isOneTimeView) {
      if (isCreator) {
        toast.error("As the creator, you can't select a card. Share this link with the recipient.");
      } else if (isOneTimeView) {
        toast.error("This greeting has already been viewed by someone else.");
      }
      return;
    }

    // Provide immediate feedback by updating UI state
    setSelectedCard(index);
    
    // Add a small delay before the reveal animation
    setTimeout(() => {
      setIsRevealed(true);
      // Trigger confetti
      setShowConfetti(true);
      // Reset confetti after animation
      setTimeout(() => setShowConfetti(false), 5000);
    }, 300);

    setIsUpdating(true);
    try {
      // Update the selected card and mark the greeting as accessed
      const { data, error } = await updateSelectedCard(greeting.id, index, userIdentifier);
      
      if (error) {
        console.error("Error updating selection:", error);
        toast.error("Failed to update selection. Please try again.");
        setSelectedCard(null);
        setIsRevealed(false);
        return;
      }
      
      // Mark the greeting as one-time accessed
      if (!isCreator) {
        try {
          // Only expire after successful selection to ensure user can see their card
          await expireGreeting(greeting.id);
        } catch (expireError) {
          console.error("Error marking greeting as expired:", expireError);
          // Non-critical error, don't reset the UI
        }
      }
      
      toast.success("Your card has been revealed! 🎉");
      
      // Update local state with server response
      if (data) {
        setGreeting(prev => ({
          ...prev,
          selected_card: data.selected_card,
          viewed_by: data.viewed_by || prev.viewed_by,
          is_expired: true // Set locally even if the server operation failed
        }));
        setHasAccessed(true);
        setIsAccessExpired(true);
      }
      
      // Refresh to get the latest data
      refreshGreeting();
    } catch (error) {
      console.error("Exception updating card selection:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setSelectedCard(null);
      setIsRevealed(false);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle payment completion and notify sender
  const handlePaymentComplete = async () => {
    setPaymentCompleted(true);
    setPaymentNotified(true);
    
    // Attempt to update the database with payment status
    try {
      // For demo purposes, we'll use the existing APIs
      // In a real implementation, you would have an API endpoint for marking payments
      const { error } = await supabase
        .from('greetings')
        .update({ is_paid: true })
        .eq('id', greeting.id);
        
      if (error) {
        console.error("Error updating payment status:", error);
        // Continue anyway since we've updated the UI locally
      }
      
      toast.success("Thank you for completing your Eidi payment! 🎉");
    } catch (error) {
      console.error("Exception updating payment status:", error);
      // Continue with local UI update even if server update fails
    }
  };

  // Share greeting
  const handleShare = () => {
    const url = `${window.location.origin}/greeting/${greeting.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Eid Collection Card",
          text: "I've sent you an Eid greeting card! Pick a card to see how much you owe me!",
          url,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  // Copy link to clipboard
  const copyLink = () => {
    const url = `${window.location.origin}/greeting/${greeting.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard! 📋");
    setShowShareMenu(false);
  };

  // Share on social media
  const shareOnSocial = (platform: string) => {
    const url = `${window.location.origin}/greeting/${greeting.id}`;
    const text = `I've sent you an Eid greeting card! Pick a card to see how much you owe me!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  // Get the selected amount
  const getSelectedAmount = () => {
    if (selectedCard !== null) {
      return greeting.amounts[selectedCard];
    }
    return 0;
  };

  // Is the greeting locked (card already selected)
  const isLocked = greeting.selected_card !== null;

  // Simplified animations to avoid unit conversion errors
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Check if UPI payment is enabled
  const isUpiEnabled = greeting.enable_upi_payment && greeting.upi_id;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Confetti effect when card is revealed */}
      <Confetti 
        isActive={showConfetti}
        config={{
          particleCount: 50,
          spread: 70,
          colors: [
            "#3B82F6", // blue
            "#10B981", // emerald
            "#A855F7", // purple
            "#EC4899", // pink
            "#FFFFFF", // white
            "#FCD34D", // yellow
          ]
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-eid-emerald-50 to-eid-gold-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-eid-emerald-600 to-eid-gold-500 font-display">
                  Eid Mubarak,
                </span> 
                <span className="font-medium">{greeting.recipient_name}!</span>
                <span className="animate-pulse">✨</span>
              </h1>
              <p className="text-gray-600 mt-1 text-base sm:text-lg leading-relaxed">
            {greeting.message}
          </p>
            </div>
            
            {/* Share button for creators */}
            {isCreator && !isLocked && (
              <div className="flex-shrink-0">
                <Button
                  onClick={handleShare}
                  className="relative bg-gradient-to-r from-eid-gold-500 to-eid-gold-600 hover:from-eid-gold-600 hover:to-eid-gold-700 text-white flex items-center gap-2 px-4 py-2 shadow-md"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                  
                  {/* Share menu */}
                  {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={copyLink}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy link
                        </button>
                        <button
                          onClick={() => shareOnSocial('twitter')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </button>
                        <button
                          onClick={() => shareOnSocial('facebook')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </button>
                        <button
                          onClick={() => shareOnSocial('whatsapp')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-5 sm:p-6">
          {/* Card selection section with improved instructions */}
          {!isRevealed ? (
            <div className="mb-6 text-center">
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-eid-gold-700">
                  {isCreator 
                    ? "Share this card with the recipient" 
                    : "Select a card to reveal your Eidi amount"}
                </h2>
              </div>
              {isCreator && (
                <div className="bg-yellow-50 p-4 border border-yellow-100 rounded-xl text-sm text-yellow-800 mb-4 max-w-lg mx-auto">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>As the creator, you cannot pick a card. Share this link with the recipient so they can select a card and view their payment amount.</p>
                  </div>
                </div>
              )}
              <p className="text-gray-500 max-w-lg mx-auto">
                Each card contains a different amount between ₹200 and ₹4000. The recipient will need to pay the amount revealed on their selected card.
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                {isCreator 
                  ? `${greeting.recipient_name} selected Card ${selectedCard! + 1}`
                  : "You selected a card!"}
              </h2>
              {isRevealed && (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="flex flex-col items-center gap-3 mt-4"
                >
                  <div className="bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 text-white text-3xl sm:text-4xl font-bold py-4 px-8 rounded-xl shadow-lg">
                    ₹{getSelectedAmount().toLocaleString('en-IN')}
                  </div>
                  <div>
                    <span className="text-gray-600 text-lg">
                      {isCreator 
                        ? `${greeting.recipient_name} needs to pay you this amount`
                        : "This is how much you need to pay"}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Card grid with better responsive layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-8">
        {greeting.amounts.map((amount, index) => (
              <motion.div 
                key={index} 
                className="aspect-[3/4]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
          <EidiCard
            index={index}
            amount={amount}
            isSelected={selectedCard === index}
                  isRevealed={isRevealed && selectedCard === index}
            isLocked={isLocked}
            onClick={handleCardSelect}
          />
              </motion.div>
        ))}
      </div>

          {/* Success actions after card reveal with UPI payment */}
          {showSuccessActions && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInFromBottom}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              {!isCreator && isUpiEnabled && (
                <div className="mb-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Complete Your Eidi Payment
                    </h3>
                    <p className="text-gray-600 max-w-lg mx-auto">
                      You need to pay <span className="font-semibold text-eid-emerald-700">₹{getSelectedAmount().toLocaleString('en-IN')}</span> to complete your Eidi. Choose any payment method below.
                    </p>
                  </div>
                  
                  <UpiPayment 
                    amount={getSelectedAmount()} 
                    upiId={greeting.upi_id || ""}
                    recipientName={greeting.recipient_name}
                  />
                </div>
              )}
              
              {(!isUpiEnabled || isCreator) && (
                <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    {isCreator ? 
                      <><Wallet className="w-5 h-5 text-eid-emerald-500" /> Payment details</> : 
                      <><Wallet className="w-5 h-5 text-eid-emerald-500" /> Complete your Eidi payment</>
                    }
                  </h3>
                  <p className="text-gray-600 mb-5 text-base">
                    {isCreator 
                      ? "Share these payment details with the recipient:"
                      : "Please complete your payment using one of these methods:"}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-eid-gold-300 hover:shadow-gold-glow transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-eid-gold-100 flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-eid-gold-700" />
                        </div>
                        <h4 className="font-semibold text-gray-800">UPI Payment</h4>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                        <span className="text-gray-600 font-mono text-sm">user@upi</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs bg-white border border-gray-200 hover:bg-eid-emerald-50 hover:text-eid-emerald-700"
                          onClick={() => {
                            navigator.clipboard.writeText("user@upi");
                            toast.success("UPI ID copied!");
                          }}
                        >
                          <Copy className="w-3 h-3 mr-1" /> Copy
                        </Button>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500 bg-eid-gold-50 p-2 rounded-md">
                        <p>Amount: <span className="font-medium">₹{getSelectedAmount().toLocaleString('en-IN')}</span></p>
                        <p className="mt-1 text-eid-gold-700">Use any UPI app like Google Pay, PhonePe, or Paytm</p>
                      </div>
                    </div>
                    
                    <div 
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-eid-emerald-300 hover:shadow-glow transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-eid-emerald-100 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-eid-emerald-700" />
                        </div>
                        <h4 className="font-semibold text-gray-800">Bank Transfer</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Account Name:</span>
                          <span className="font-medium text-gray-700">User Name</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Account Number:</span>
                          <span className="font-medium text-gray-700">123456789012</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">IFSC Code:</span>
                          <span className="font-medium text-gray-700">ABCD0001234</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-eid-emerald-600 bg-eid-emerald-50 p-2 rounded-md">
                            Amount: <span className="font-medium">₹{getSelectedAmount().toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!isCreator && !paymentCompleted && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={handlePaymentComplete}
                    className="bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 hover:from-eid-emerald-600 hover:to-eid-emerald-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] flex items-center gap-2 mx-auto text-base"
                  >
                    <CheckCircle className="w-5 h-5" /> I've Completed the Payment
        </Button>
      </div>
              )}
              
              {paymentCompleted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 bg-gradient-to-r from-eid-emerald-50 to-eid-emerald-100 border border-eid-emerald-200 rounded-lg p-6 text-center shadow-sm"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                      <CheckCircle className="w-8 h-8 text-eid-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-eid-emerald-800 mb-2">Payment Completed!</h3>
                    <p className="text-eid-emerald-700 mt-1 max-w-md mx-auto">
                      Thank you for your Eidi payment of <span className="font-semibold">₹{getSelectedAmount().toLocaleString('en-IN')}</span>. Your generosity is truly appreciated this Eid.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Footer navigation with back to dashboard/home buttons */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-md">
                Home
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-md">
                My Dashboard
              </Button>
            </Link>
            
            {isCreator && isLocked && (
              <Button 
                onClick={handleShare}
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5 text-eid-gold-700 hover:text-eid-gold-800 border-eid-gold-200 hover:border-eid-gold-300 hover:bg-eid-gold-50 rounded-md"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Result
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 