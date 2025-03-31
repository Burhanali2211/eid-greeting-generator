"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Gift, Loader2, PartyPopper, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { cardStorage, CardData, PaymentStatus } from '@/lib/storage/card-storage';

export default function GreetingPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;
  
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Sound effects
  const [flipSound, setFlipSound] = useState<HTMLAudioElement | null>(null);
  const [successSound, setSuccessSound] = useState<HTMLAudioElement | null>(null);
  
  // Load audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const flipAudio = new Audio('/sounds/card-flip.mp3');
      const successAudio = new Audio('/sounds/success.mp3');
      
      flipAudio.preload = 'auto';
      successAudio.preload = 'auto';
      
      setFlipSound(flipAudio);
      setSuccessSound(successAudio);
      
      return () => {
        flipAudio.pause();
        successAudio.pause();
      };
    }
  }, []);
  
  // Load card data
  useEffect(() => {
    async function loadCard() {
      if (!cardStorage || !cardId) {
        setLoading(false);
        return;
      }
      
      try {
        const cardData = await cardStorage.getCard(cardId);
        if (!cardData) {
          toast.error('Card not found');
          router.push('/');
          return;
        }
        setCard(cardData);
      } catch (error) {
        console.error('Error loading card:', error);
        toast.error('Failed to load greeting');
      } finally {
        setLoading(false);
      }
    }
    
    loadCard();
  }, [cardId, router]);
  
  // Handle card pick
  const handlePickCard = (index: number) => {
    if (isFlipping || cardIndex !== null) return;
    
    setCardIndex(index);
    setIsFlipping(true);
    
    // Play flip sound
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.play().catch(e => console.log('Error playing sound:', e));
    }
    
    setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
      
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Play success sound
      if (successSound) {
        successSound.currentTime = 0;
        successSound.play().catch(e => console.log('Error playing sound:', e));
      }
    }, 1000);
  };
  
  // Handle claim
  const handleClaim = async () => {
    if (!card || cardIndex === null || !cardStorage) return;
    
    try {
      // Check if this card amount was already claimed
      const existingPaymentStatus = card.paymentStatus || [];
      if (existingPaymentStatus.some(p => p.isPaid && existingPaymentStatus.indexOf(p) === cardIndex)) {
        toast.error('This card has already been claimed');
        return;
      }
      
      // Create updated payment status array if it doesn't exist
      const paymentStatus: PaymentStatus[] = [...existingPaymentStatus];
      
      // Fill any gaps in the array up to the card index
      while (paymentStatus.length <= cardIndex) {
        paymentStatus.push({
          amount: card.cardAmounts[paymentStatus.length],
          isPaid: false
        });
      }
      
      // Update payment status for the selected card
      paymentStatus[cardIndex] = {
        amount: card.cardAmounts[cardIndex],
        isPaid: true,
        paidAt: new Date().toISOString()
      };
      
      // Update card with new payment status
      await cardStorage.updatePaymentStatus(card.id, paymentStatus);
      
      setIsCompleted(true);
      
      // Fire more confetti
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 }
      });
      
      toast.success('Eidi claimed successfully!');
    } catch (error) {
      console.error('Error claiming Eidi:', error);
      toast.error('Failed to claim Eidi');
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-eid-emerald-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your Eid greeting...</p>
        </div>
      </div>
    );
  }
  
  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Greeting Not Found</h1>
          <p className="text-gray-600 mb-6">This Eid greeting card doesn't exist or has been deleted.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-eid-emerald-500 text-white rounded-xl hover:bg-eid-emerald-600 inline-flex items-center justify-center transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-8 pb-16 overflow-x-hidden bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="relative z-10">
          <Link 
            href="/"
            className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
          
          {/* Festive elements */}
          <div className="absolute top-0 right-0 transform translate-x-16 -translate-y-8 opacity-20 pointer-events-none">
            <Image 
              src="/images/eid-decoration.svg" 
              width={200} 
              height={200} 
              alt="Eid decoration" 
              className="object-contain"
            />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Eid Mubarak!
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              <span className="font-semibold">{card.formData.yourName}</span> has sent you an Eid greeting with surprise Eidi!
            </p>
          </div>
        </div>
        
        {/* Greeting card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-eid-gold-100 p-6 sm:p-8 mb-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-eid-gold-200 rounded-full filter blur-3xl opacity-20 -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-eid-emerald-200 rounded-full filter blur-3xl opacity-20 translate-x-16 translate-y-16"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 font-display">
                Dear {card.formData.recipientName},
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                {card.formData.message}
              </p>
              <p className="text-gray-600">
                Warm wishes,<br />
                <span className="font-semibold">{card.formData.yourName}</span>
              </p>
            </div>
          </div>
        </div>
        
        {isRevealed && !isCompleted ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-eid-gold-100 p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center">
              <PartyPopper className="w-16 h-16 text-eid-gold-500 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-display">
                You got {formatCurrency(card.cardAmounts[cardIndex!])} Eidi!
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Tap the button below to claim your Eidi through UPI
              </p>
              
              <button
                onClick={handleClaim}
                className="px-6 py-3 bg-eid-emerald-500 text-white rounded-xl hover:bg-eid-emerald-600 flex items-center gap-2 transition-colors shadow-md"
              >
                <CreditCard className="w-5 h-5" />
                Claim via UPI
              </button>
            </div>
          </div>
        ) : isCompleted ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-eid-gold-100 p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-eid-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-10 h-10 text-eid-emerald-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-display">
                Eidi Claimed Successfully!
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Send the amount of {formatCurrency(card.cardAmounts[cardIndex!])} to {card.formData.yourName} using the UPI ID below:
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-8 w-full max-w-md mx-auto">
                <p className="font-medium text-gray-700 mb-1">UPI ID</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-800 font-mono text-lg">
                    {card.formData.upiId}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(card.formData.upiId);
                      toast.success('UPI ID copied!');
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Copy UPI ID"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24"
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-gray-600"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
                To complete the process, please open your UPI app, select "Pay to UPI ID", 
                enter the UPI ID above, and send the specified amount.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/"
                  className="px-4 py-2 bg-eid-purple-100 text-eid-purple-700 rounded-xl hover:bg-eid-purple-200 transition-colors"
                >
                  Return to Home
                </Link>
                <Link
                  href="/create-card"
                  className="px-4 py-2 bg-eid-gold-500 text-white rounded-xl hover:bg-eid-gold-600 transition-colors"
                >
                  Create Your Own Card
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choose a card to reveal your Eidi
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {card.cardAmounts.map((_, index) => {
                const isSelected = cardIndex === index;
                
                // Check if this card is already claimed
                const isAlreadyClaimed = card.paymentStatus?.some(
                  (p, i) => p.isPaid && i === index
                );
                
                return (
                  <motion.div
                    key={index}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-md 
                               ${isAlreadyClaimed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    initial={{ rotateY: 0 }}
                    animate={{ 
                      rotateY: isSelected && isFlipping ? 180 : 0,
                      scale: isSelected ? 1.05 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    onClick={() => !isAlreadyClaimed && handlePickCard(index)}
                  >
                    {/* Card Back */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br from-eid-emerald-500 to-eid-emerald-700 
                                ${isSelected && isRevealed ? 'hidden' : 'flex'} items-center justify-center
                                 backface-visibility-hidden`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="absolute inset-0 opacity-20">
                        <svg 
                          width="100%" 
                          height="100%" 
                          className="text-white"
                          viewBox="0 0 100 100"
                        >
                          <pattern 
                            id={`pattern-${index}`}
                            x="0" 
                            y="0" 
                            width="20" 
                            height="20" 
                            patternUnits="userSpaceOnUse"
                          >
                            <path 
                              d="M10,0 L20,10 L10,20 L0,10 Z" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="0.5"
                            />
                          </pattern>
                          <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
                        </svg>
                      </div>
                      
                      <Gift className="w-12 h-12 text-white" />
                      
                      {isAlreadyClaimed && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <p className="text-white font-medium text-xs px-2 py-1 bg-black/70 rounded">
                            Already Claimed
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Card Front */}
                    <div 
                      className={`absolute inset-0 bg-white flex flex-col items-center justify-center p-4
                                ${isSelected && isRevealed ? 'flex' : 'hidden'} 
                                transform rotateY-180 backface-visibility-hidden`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-12 h-12 bg-eid-gold-100 rounded-full flex items-center justify-center mb-2">
                        <Gift className="w-6 h-6 text-eid-gold-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(card.cardAmounts[index])}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Eidi for you
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
