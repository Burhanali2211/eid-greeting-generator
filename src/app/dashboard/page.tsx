"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus, Edit, Trash, Share2, CreditCard, ChevronRight, Gift, Wallet, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cardStorage, CardData } from '@/lib/storage/card-storage';

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  // Set fake userId for demo purposes
  const userId = "user-1234";
  
  // Load cards on component mount
  useEffect(() => {
    async function loadCards() {
      if (!cardStorage) {
        setLoading(false);
        return;
      }
      
      try {
        const userCards = await cardStorage.getCardsByUser(userId);
        setCards(userCards);
      } catch (error) {
        console.error('Error loading cards:', error);
        toast.error('Failed to load your cards');
      } finally {
        setLoading(false);
      }
    }
    
    loadCards();
  }, [userId]);
  
  // Handle card sharing
  const handleShare = async (card: CardData) => {
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
  
  // Handle card deletion
  const handleDelete = async (cardId: string) => {
    setDeleting(cardId);
    
    try {
      if (!cardStorage) {
        throw new Error('Storage not available');
      }
      
      await cardStorage.deleteCard(cardId);
      setCards(cards.filter(card => card.id !== cardId));
      toast.success('Card deleted successfully');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    } finally {
      setDeleting(null);
      setShowConfirmDelete(null);
    }
  };
  
  // Calculate payment stats for a card
  const getCardStats = (card: CardData) => {
    const totalAmount = card.cardAmounts.reduce((sum, amount) => sum + amount, 0);
    const paidAmount = card.paymentStatus?.reduce((sum, status) => 
      status.isPaid ? sum + status.amount : sum, 0) || 0;
    const paidCount = card.paymentStatus?.filter(status => status.isPaid).length || 0;
    
    return {
      totalAmount,
      paidAmount,
      paidCount,
      pendingCount: card.cardAmounts.length - paidCount
    };
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-eid-emerald-50 via-white to-eid-gold-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
            Your Eid Greetings Dashboard
      </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage your Eid greeting cards and track payments
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-eid-gold-100 p-6">
          {/* Dashboard Header with Stats */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Your Collection Cards
              </h2>
              <p className="text-sm text-gray-500">
                You have {cards.length} {cards.length === 1 ? 'card' : 'cards'}
              </p>
            </div>
            
            <Link 
              href="/create-card"
              className="px-4 py-2 bg-eid-emerald-500 text-white rounded-xl hover:bg-eid-emerald-600 
                        flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create New Card
            </Link>
          </div>
          
          {/* Cards Grid/List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-eid-emerald-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading your cards...</p>
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="w-16 h-16 bg-eid-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-eid-gold-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Cards Created Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first Eid collection card to start collecting Eidi from friends and family
              </p>
              <Link 
                href="/create-card"
                className="px-6 py-2 bg-eid-emerald-500 text-white rounded-full hover:bg-eid-emerald-600 
                          inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Your First Card
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map(card => {
                const stats = getCardStats(card);
                
                return (
                  <motion.div 
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            Card for {card.formData.recipientName}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Created on {new Date(card.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-eid-emerald-100 text-eid-emerald-800">
                              <Gift className="w-3 h-3 mr-1" />
                              {card.cardAmounts.length} cards
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-eid-gold-100 text-eid-gold-800">
                              <Wallet className="w-3 h-3 mr-1" />
                              ₹{stats.paidAmount} received
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <CreditCard className="w-3 h-3 mr-1" />
                              {stats.paidCount}/{card.cardAmounts.length} paid
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleShare(card)}
                            className="p-2 text-gray-600 hover:text-eid-purple-600 hover:bg-eid-purple-50 rounded-full transition-colors"
                            aria-label="Share"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/dashboard/cards/${card.id}`}
                            className="p-2 text-gray-600 hover:text-eid-emerald-600 hover:bg-eid-emerald-50 rounded-full transition-colors"
                            aria-label="View details"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setShowConfirmDelete(card.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Delete"
                            disabled={deleting === card.id}
                          >
                            {deleting === card.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar for paid vs total amount */}
                    <div className="h-2 w-full bg-gray-100">
                      <div 
                        className="h-full bg-eid-gold-400"
                        style={{ width: `${stats.paidAmount / (stats.totalAmount || 1) * 100}%` }}
                      ></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showConfirmDelete && (
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
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this greeting card? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={deleting !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={() => showConfirmDelete && handleDelete(showConfirmDelete)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  disabled={deleting !== null}
                >
                  {deleting !== null ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 