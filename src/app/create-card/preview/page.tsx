"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  Eye, 
  Send, 
  Copy, 
  Share2, 
  CheckCircle, 
  Loader2,
  ArrowRight,
  MessageCircle,
  Info,
  Gift
} from "lucide-react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { EidiCard } from "@/components/eidi-card";
import { Button } from "@/components/ui/button";
import { cardStorage, CardData } from "@/lib/storage/card-storage";
import { v4 as uuidv4 } from 'uuid';

// Add types if not already defined elsewhere
interface FormData {
  yourName: string;
  recipientName: string;
  message: string;
  upiId: string;
}

export default function PreviewCardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Get data from previous steps
  const [formData] = useLocalStorage<Partial<FormData>>("eid-greeting-form", {
    yourName: "",
    recipientName: "",
    message: "",
    upiId: "",
  });
  
  const [cardAmounts] = useLocalStorage<number[]>("eid-card-amounts", []);
  
  // State for preview
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [greetingId, setGreetingId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [selectedPreviewCard, setSelectedPreviewCard] = useState<number | null>(null);
  const [revealedPreviewCard, setRevealedPreviewCard] = useState<number | null>(null);
  
  // Check if all data is available
  const isDataComplete = () => {
    return (
      formData.yourName && 
      formData.recipientName && 
      formData.message && 
      formData.upiId && 
      cardAmounts.length > 0
    );
  };
  
  // Handle navigation back
  const handleBack = () => {
    router.push("/create-card/design");
  };
  
  // Initialize share URL when component mounts
  useEffect(() => {
    // Only set a placeholder URL initially
    if (window && window.location) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/greeting/placeholder-id`);
    }
  }, []);
  
  // Handle card selection for preview
  const handleCardSelect = (index: number) => {
    if (revealedPreviewCard !== null) return;
    
    setSelectedPreviewCard(index);
    
    // Simulate reveal after a short delay
    setTimeout(() => {
      setRevealedPreviewCard(index);
    }, 1000);
  };
  
  // Handle reset preview
  const handleResetPreview = () => {
    setSelectedPreviewCard(null);
    setRevealedPreviewCard(null);
  };
  
  // Handle creating the greeting
  const handleCreateGreeting = async () => {
    if (!isDataComplete()) return;
    
    setIsCreating(true);
    
    try {
      // Generate a unique ID using UUID
      const cardId = uuidv4();
      
      // Create card data object
      const cardData: CardData = {
        id: cardId,
        userId: session?.user?.email || 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formData: {
          yourName: formData.yourName || '',
          recipientName: formData.recipientName || '',
          message: formData.message || '',
          upiId: formData.upiId || '',
        },
        cardAmounts: cardAmounts,
        sharedWith: [],
        paymentStatus: cardAmounts.map(amount => ({
          amount,
          isPaid: false
        }))
      };
      
      // Save to storage if available
      if (!cardStorage) {
        console.error("Card storage is not available");
        toast.error("Storage not available. Please try again later.");
        return;
      }
      
      await cardStorage.saveCard(cardData);
      
      // Update state with created greeting
      setGreetingId(cardId);
      setIsCreated(true);
      
      // Set the actual share URL
      if (window && window.location) {
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/greeting/${cardId}`);
      }
      
      toast.success("Eid greeting card created successfully!");
      
      // Clear preview selection
      handleResetPreview();
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
      
    } catch (error) {
      console.error("Error creating greeting:", error);
      toast.error("Failed to create greeting card. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle copy to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success("URL copied to clipboard!");
      
      // Reset copy status after a delay
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy URL");
    }
  };
  
  // Handle share
  const handleShare = async () => {
    if (!shareUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Eid Greeting from ${formData.yourName}`,
          text: `${formData.yourName} sent you an Eid greeting with surprise Eidi!`,
          url: shareUrl
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback to copy
        handleCopyUrl();
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };
  
  // Render preview cards
  const renderPreviewCards = () => {
    return cardAmounts.map((amount, index) => (
      <div key={index} className="transform transition-all duration-300 hover:scale-105">
        <EidiCard
          index={index}
          amount={amount}
          isSelected={selectedPreviewCard === index}
          isRevealed={revealedPreviewCard === index}
          isLocked={false}
          onClick={() => handleCardSelect(index)}
          onlyViewable={false}
        />
        <p className="text-center text-xs mt-1 text-gray-600">Card {index + 1}</p>
      </div>
    ));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">Preview Your Eid Card</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how your Eid greeting will look to recipients and share it with them.
        </p>
      </div>
      
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-eid-emerald-50 to-eid-gold-50 relative overflow-hidden mb-8">
        <div className="absolute inset-0 paper-texture"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-2xl p-5 sm:p-8 transition-all glass-card"
          >
            <div className="flex items-center mb-6">
              <Eye className="text-amber-500 mr-3" size={24} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Step 3: Preview & Share</h2>
            </div>
            
            {/* Message Preview */}
            <div className="mb-8">
              <div className="text-sm font-medium text-gray-600 mb-2">Your greeting message:</div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <MessageCircle className="text-amber-400 w-5 h-5 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">From {formData.yourName} to {formData.recipientName}</div>
                    <p className="text-gray-800 italic">"{formData.message}"</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Preview */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-medium text-gray-600">Your card collection:</div>
                {(selectedPreviewCard !== null || revealedPreviewCard !== null) && (
                  <button
                    onClick={handleResetPreview}
                    className="text-xs text-purple-600 hover:text-purple-800 underline underline-offset-2"
                  >
                    Reset preview
                  </button>
                )}
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="text-sm text-center text-gray-600 mb-4">
                  <Info className="inline-block w-4 h-4 text-amber-500 mr-1 -mt-px" />
                  {selectedPreviewCard === null 
                    ? "Try clicking on a card to see how the selection experience works"
                    : revealedPreviewCard === null
                      ? "Card selected! It will reveal the amount in a moment..."
                      : `Card revealed! This card would pay you ₹${cardAmounts[revealedPreviewCard]}`
                  }
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {renderPreviewCards()}
                </div>
              </div>
            </div>
            
            {/* Share Section */}
            {isCreated ? (
              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="text-emerald-500 h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold text-emerald-700">Eid Greeting Created!</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Your Eid greeting is ready to share! Copy the link below or use the share button.
                </p>
                
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 mb-4">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-grow px-3 py-2 text-sm bg-transparent border-none focus:outline-none"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <Gift className="h-4 w-4" />
                    View Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-8">
                <Button
                  onClick={handleCreateGreeting}
                  disabled={isCreating || !isDataComplete()}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white 
                            font-medium hover:from-purple-600 hover:to-purple-700 shadow-lg 
                            hover:shadow-purple-200/30 transition-all duration-200 flex items-center justify-center
                            ${(isCreating || !isDataComplete()) ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Greeting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Create & Share Greeting
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Once created, you'll get a link to share with {formData.recipientName} and others
                </p>
              </div>
            )}
            
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={isCreating}
                className={`flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 
                          font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center
                          ${isCreating ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Design
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 