import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { ArrowRight, Sparkles, Gift, Heart, Star, MoonStar, Building } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section with Enhanced Animated Background */}
      <section className="relative -mt-28 pt-36 pb-20 overflow-hidden">
        {/* Enhanced Background decoration with richer colors and animations */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-40 left-10 w-72 h-72 bg-eid-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-eid-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-40 right-20 w-72 h-72 bg-eid-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          
          {/* Added shimmering stars for festive feel */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-eid-gold-300 rounded-full animate-twinkle-star"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-eid-gold-300 rounded-full animate-twinkle-star animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-eid-gold-300 rounded-full animate-twinkle-star animation-delay-4000"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center p-2.5 bg-white/90 backdrop-blur-md rounded-full mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <span className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-eid-emerald-100 to-eid-gold-100 rounded-full text-gradient-royal">
                <Sparkles className="inline-block w-4 h-4 mr-2 text-eid-gold-500 animate-pulse-soft" /> 
                Celebrating Eid with Joy and Generosity
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-eid-emerald-600 via-eid-gold-500 to-eid-purple-600 mb-2 drop-shadow-sm">
                Send Beautiful Eid Greetings
              </span>
              <span className="inline-flex items-center">
                <span>with</span>
                <span className="relative mx-2">
                  <span className="font-display text-eid-gold-600 text-5xl md:text-7xl tracking-wide">Interactive</span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-eid-gold-200 rounded-full"></div>
                </span>
                <span>Eidi Cards</span>
              </span>
        </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl font-light">
              Create personalized Eid greetings with surprise Eidi gifts
              <span className="hidden sm:inline"> that recipients need to pay</span>.
              <span className="block mt-2 font-medium text-eid-emerald-700">Make collecting Eidi fun this Eid season!</span>
            </p>
            
            {/* Enhanced CTA buttons with animations */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md mx-auto">
              <Link href="/create-card" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group px-6 h-14 text-base font-medium shadow-lg shadow-eid-emerald-500/20 bg-gradient-to-r from-eid-emerald-500 to-eid-emerald-600 hover:from-eid-emerald-600 hover:to-eid-emerald-700 animate-pulse-button">
                  Create Your Collection Card
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-base font-medium border-2 border-gray-300 hover:border-eid-gold-300 hover:bg-eid-gold-50 hover:text-eid-gold-700 transition-all duration-300">
                  <Gift className="mr-2 h-5 w-5 text-eid-gold-500" />
                  My Collection Cards
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Decorative Graphic with 3D effects and animations */}
            <div className="relative w-full max-w-3xl h-72 sm:h-80 my-8 perspective-1000">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full rounded-2xl overflow-hidden fancy-border transform-style-3d hover:rotate-y-3 transition-all duration-500">
                  {/* Card background with texture */}
                  <div className="absolute inset-0 bg-gradient-to-r from-eid-gold-100 to-eid-emerald-100"></div>
                  <div className="absolute inset-0 lantern-pattern-bg opacity-30"></div>
                  
                  {/* Arabic greeting */}
                  <div className="absolute top-4 right-4 arabic-greeting opacity-20 text-4xl font-bold">
                    عيد مبارك
                  </div>
                  
                  {/* Card showcase with SVG elements */}
                  <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-4 md:gap-8 p-6">
                    {[0, 1, 2].map((idx) => (
                      <div 
                        key={idx}
                        className={`relative w-24 h-36 sm:w-36 sm:h-52 md:w-40 md:h-56 rounded-xl shadow-2xl transform-style-3d transition-all duration-500 hover:rotate-y-15 ${
                          idx === 0 ? 'rotate-[-12deg] translate-x-[-20px] sm:translate-x-[-40px] hover:rotate-[-8deg]' : 
                          idx === 1 ? 'z-10 scale-110 hover:scale-115' : 
                          'rotate-[12deg] translate-x-[20px] sm:translate-x-[40px] hover:rotate-[8deg]'
                        }`}
                        style={{
                          background: idx === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' :
                                    idx === 1 ? 'linear-gradient(135deg, #059669, #10b981)' :
                                    'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                          boxShadow: idx === 1 
                            ? '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)' 
                            : '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-between p-3 sm:p-5">
                          <div className="w-full flex justify-between items-center mb-2">
                            <div className="w-3 h-3 rounded-full bg-white/80"></div>
                            <div className="text-sm sm:text-base text-white/90 font-bold font-display tracking-wide">Eidi</div>
                          </div>
                          
                          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                            {idx === 0 && <MoonStar className="w-8 h-8 text-white/90" />}
                            {idx === 1 && <Building className="w-8 h-8 text-white/90" />}
                            {idx === 2 && <Star className="w-8 h-8 text-white/90" />}
                          </div>
                          
                          <div className="text-center mt-auto">
                            <div className="text-sm sm:text-lg font-bold text-white">Card {idx + 1}</div>
                            <div className="text-xs text-white/70 mt-1">Tap to reveal</div>
                          </div>
                        </div>
                        
                        {/* Card overlay pattern */}
                        <div className="absolute inset-0 pattern-dots-1 opacity-10 mix-blend-soft-light"></div>
                        
                        {/* Card reflection highlight */}
                        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                      </div>
                    ))}
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full border-2 border-dashed border-eid-gold-300/50 animate-spin-slow"></div>
                    <div className="absolute -bottom-6 -right-10 w-16 h-16 rounded-full border-2 border-dashed border-eid-emerald-300/50"></div>
                    <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-eid-purple-300/30 animate-pulse-soft"></div>
                    
                    {/* Floating stars/elements */}
                    <div className="absolute top-1/4 left-16 text-eid-gold-400 animate-floating-stars">
                      <Star className="w-6 h-6 fill-current opacity-40" />
                    </div>
                    <div className="absolute bottom-1/4 right-16 text-eid-gold-400 animate-floating-stars animation-delay-2000">
                      <MoonStar className="w-5 h-5 fill-current opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced design */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="eid-pattern-bg absolute inset-0 opacity-5"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-eid-emerald-100 rounded-full filter blur-3xl opacity-40"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-eid-gold-100 rounded-full filter blur-3xl opacity-30"></div>
      </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center px-4 py-1.5 bg-eid-emerald-100 rounded-full">
                <span className="text-sm font-medium text-eid-emerald-800">Why Use Our Platform</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block">
                <span className="relative z-10">Why Create an</span>
                <div className="absolute bottom-1 left-0 right-0 h-3 bg-eid-gold-200 opacity-70 -z-10"></div>
              </span>
              <span className="font-display text-eid-emerald-600 ml-2">Eid Collection Card?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Make collecting Eidi from friends and family a joyful and memorable experience
              during this blessed celebration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Feature 1 */}
            <div className="group glass-card hover-card-3d p-8 bg-white/70 transform transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-tr from-eid-emerald-400 to-eid-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-eid-emerald-100 group-hover:rotate-3 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-eid-emerald-700 transition-colors">Interactive Experience</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Recipients choose a card to see how much Eidi they need to pay you, turning a simple transaction into a fun game.
              </p>
              
              {/* Added icon decorations that appear on hover */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-eid-emerald-300 animate-float">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group glass-card hover-card-3d p-8 bg-white/70 transform transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-tr from-eid-gold-400 to-eid-gold-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-eid-gold-100 group-hover:rotate-3 transition-transform duration-300">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-eid-gold-700 transition-colors">Surprise Amounts</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Create a fun way to collect your Eidi with randomized amounts, adding excitement and anticipation to the giving process.
              </p>
              
              {/* Added icon decorations that appear on hover */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-eid-gold-300 animate-float animation-delay-2000">
                  <Gift className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group glass-card hover-card-3d p-8 bg-white/70 transform transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-tr from-eid-purple-400 to-eid-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-eid-purple-100 group-hover:rotate-3 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-eid-purple-700 transition-colors">Share With Everyone</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Easily share your collection cards via social media or messaging apps, reaching family and friends near and far.
              </p>
              
              {/* Added icon decorations that appear on hover */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-eid-purple-300 animate-float animation-delay-4000">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Added highlight section */}
          <div className="mt-16 p-6 sm:p-8 bg-gradient-to-r from-eid-emerald-50 to-eid-gold-50 rounded-2xl border border-eid-gold-100 shadow-lg fancy-border overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-eid-gold-200 rounded-full filter blur-3xl opacity-40"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                <MoonStar className="h-10 w-10 text-eid-gold-500" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-eid-emerald-800 mb-2">Ready to start collecting your Eid gifts?</h3>
                <p className="text-eid-emerald-700 mb-4">Create your first collection card in less than 2 minutes!</p>
                <Link href="/create-card">
                  <Button size="lg" className="group bg-gradient-to-r from-eid-gold-500 to-eid-gold-600 hover:from-eid-gold-600 hover:to-eid-gold-700 text-white font-medium px-6">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
