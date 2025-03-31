"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, CreditCard, ShieldCheck, AlertCircle, CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cardStorage, CardData, PaymentStatus } from '@/lib/storage/card-storage';

// We'll use a simple QR code component since react-qr-code isn't installed
const SimpleQRCode = ({ value, size = 180 }: { value: string; size?: number }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div 
        className="bg-gray-800 p-4 rounded-lg" 
        style={{ width: size, height: size }}
      >
        <p className="text-center text-white text-sm mb-2">QR Code</p>
        <div className="text-xs text-white break-all overflow-hidden">{value}</div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        Share this link to receive your Eidi
      </p>
    </div>
  );
};

export default function CardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  
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
          router.push('/dashboard');
          return;
        }
        setCard(cardData);
      } catch (error) {
        console.error('Error loading card:', error);
        toast.error('Failed to load card data');
      } finally {
        setLoading(false);
      }
    }
    
    loadCard();
  }, [cardId, router]);
  
  // Handle sharing
  const handleShare = async () => {
    if (!card) return;
    
    // Create share URL
    const shareUrl = `${window.location.origin}/greeting/${card.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Eid Greeting from ${card.formData.yourName}`,
          text: `${card.formData.yourName} sent you an Eid greeting with surprise Eidi!`,
          url: shareUrl
        });
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };
  
  // Mark a payment as received manually
  const markAsPaid = async (index: number) => {
    if (!card || !cardStorage) return;
    
    try {
      // Create updated payment status array if it doesn't exist
      const paymentStatus = card.paymentStatus || [];
      
      // Create or update payment status for this index
      const newPaymentStatus: PaymentStatus[] = [...paymentStatus];
      
      if (index >= newPaymentStatus.length) {
        // Add new payment status entries up to the index
        for (let i = paymentStatus.length; i <= index; i++) {
          newPaymentStatus.push({
            amount: card.cardAmounts[i],
            isPaid: i === index, // Only mark the target index as paid
            paidAt: i === index ? new Date().toISOString() : undefined
          });
        }
      } else {
        // Update existing payment status
        newPaymentStatus[index] = {
          ...newPaymentStatus[index],
          isPaid: true,
          paidAt: new Date().toISOString()
        };
      }
      
      // Update card with new payment status
      const success = await cardStorage.updatePaymentStatus(card.id, newPaymentStatus);
      
      if (success) {
        // Update local state
        setCard({
          ...card,
          paymentStatus: newPaymentStatus
        });
        
        toast.success('Payment marked as received!');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };
  
  // Calculate stats
  const calculateStats = () => {
    if (!card) return { total: 0, received: 0, pending: 0 };
    
    const totalAmount = card.cardAmounts.reduce((sum, amount) => sum + amount, 0);
    const paidAmount = card.paymentStatus?.reduce((sum, status) => 
      status.isPaid ? sum + status.amount : sum, 0) || 0;
    
    return {
      total: totalAmount,
      received: paidAmount,
      pending: totalAmount - paidAmount
    };
  };
  
  const stats = calculateStats();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-eid-emerald-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading card details...</p>
        </div>
      </div>
    );
  }
  
  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Card Not Found</h1>
          <p className="text-gray-600 mb-6">The card you're looking for doesn't exist or has been deleted.</p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-eid-emerald-500 text-white rounded-xl hover:bg-eid-emerald-600 inline-flex items-center justify-center transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header with back button */}
        <div className="mb-8 flex items-center">
          <Link 
            href="/dashboard"
            className="mr-4 p-2 hover:bg-white/80 rounded-full transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Card Details
          </h1>
          <div className="ml-auto">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-eid-purple-500 text-white rounded-xl hover:bg-eid-purple-600 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share Card</span>
            </button>
          </div>
        </div>
        
        {/* Card Info Panel */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-eid-gold-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Greeting for {card.formData.recipientName}
              </h2>
              <p className="text-sm text-gray-500">
                Created on {new Date(card.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-3 max-w-lg">
                <span className="font-medium">Message:</span> "{card.formData.message}"
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Your UPI ID:</span> {card.formData.upiId}
              </p>
            </div>
            
            <button
              onClick={() => setQrVisible(!qrVisible)}
              className="px-4 py-2 bg-eid-gold-100 text-eid-gold-800 rounded-xl hover:bg-eid-gold-200 flex items-center gap-2 transition-colors shadow-sm self-start sm:self-center"
            >
              <QrCode className="w-5 h-5" />
              {qrVisible ? 'Hide QR Code' : 'Show QR Code'}
            </button>
          </div>
          
          {qrVisible && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center p-4 mb-6"
            >
              <SimpleQRCode value={`${window.location.origin}/greeting/${card.id}`} />
            </motion.div>
          )}
          
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-eid-emerald-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-eid-emerald-800 mb-1">Total Amount</h3>
              <p className="text-2xl font-bold text-eid-emerald-700">₹{stats.total}</p>
              <p className="text-xs text-eid-emerald-600 mt-1">
                {card.cardAmounts.length} {card.cardAmounts.length === 1 ? 'card' : 'cards'} created
              </p>
            </div>
            
            <div className="bg-eid-gold-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-eid-gold-800 mb-1">Received</h3>
              <p className="text-2xl font-bold text-eid-gold-700">₹{stats.received}</p>
              <p className="text-xs text-eid-gold-600 mt-1">
                {card.paymentStatus?.filter(p => p.isPaid).length || 0} payments received
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-1">Pending</h3>
              <p className="text-2xl font-bold text-gray-700">₹{stats.pending}</p>
              <p className="text-xs text-gray-600 mt-1">
                {card.cardAmounts.length - (card.paymentStatus?.filter(p => p.isPaid).length || 0)} payments pending
              </p>
            </div>
          </div>
        </div>
        
        {/* Cards & Payments List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-eid-gold-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Status
          </h2>
          
          <div className="space-y-4">
            {card.cardAmounts.map((amount, index) => {
              const paymentStatus = card.paymentStatus?.[index];
              const isPaid = paymentStatus?.isPaid || false;
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border ${isPaid ? 'border-eid-emerald-200 bg-eid-emerald-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      {isPaid ? (
                        <CheckCircle2 className="w-5 h-5 text-eid-emerald-500 mr-3 flex-shrink-0" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Card #{index + 1}: ₹{amount}
                        </h3>
                        {isPaid && paymentStatus?.paidAt && (
                          <p className="text-xs text-eid-emerald-600">
                            Received on {new Date(paymentStatus.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {!isPaid && (
                      <button
                        onClick={() => markAsPaid(index)}
                        className="px-3 py-1.5 text-sm bg-eid-emerald-100 text-eid-emerald-700 hover:bg-eid-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Mark as Received
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 