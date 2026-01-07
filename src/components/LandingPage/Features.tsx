"use client";
import React from "react";
import Image from "next/image";

// Types
interface InputIcon {
  id: string;
  name: string;
  logoUrl: string;
  color: string;
}

interface OutputCard {
  id: string;
  icon: string;
  title: string;
  category: string;
}

// Constants - Real Platform Logos
const INPUT_ICONS: InputIcon[] = [
  { 
    id: "1", 
    name: "WhatsApp", 
    logoUrl: "https://cdn.simpleicons.org/whatsapp/25D366",
    color: "bg-gradient-to-br from-green-500 to-emerald-600" 
  },
  { 
    id: "2", 
    name: "Instagram", 
    logoUrl: "https://cdn.simpleicons.org/instagram/E4405F",
    color: "bg-gradient-to-br from-pink-500 to-purple-600" 
  },
  { 
    id: "3", 
    name: "Facebook", 
    logoUrl: "https://cdn.simpleicons.org/facebook/1877F2",
    color: "bg-gradient-to-br from-blue-500 to-blue-700" 
  },
  { 
    id: "4", 
    name: "Telegram", 
    logoUrl: "https://cdn.simpleicons.org/telegram/2AABEE",
    color: "bg-gradient-to-br from-cyan-500 to-blue-600" 
  },
  { 
    id: "5", 
    name: "Shopify", 
    logoUrl: "https://cdn.simpleicons.org/shopify/96BF48",
    color: "bg-gradient-to-br from-green-600 to-green-700" 
  },
  { 
    id: "6", 
    name: "WooCommerce", 
    logoUrl: "https://cdn.simpleicons.org/woocommerce/96588A",
    color: "bg-gradient-to-br from-purple-600 to-purple-800" 
  },
  { 
    id: "7", 
    name: "LinkedIn", 
    logoUrl: "https://cdn.simpleicons.org/linkedin/0A66C2",
    color: "bg-gradient-to-br from-blue-600 to-blue-800" 
  },
  { 
    id: "8", 
    name: "Snapchat", 
    logoUrl: "https://cdn.simpleicons.org/snapchat/FFFC00",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-500" 
  },
  { 
    id: "9", 
    name: "Twitter/X", 
    logoUrl: "https://cdn.simpleicons.org/x/000000",
    color: "bg-gradient-to-br from-gray-800 to-black" 
  },
  { 
    id: "10", 
    name: "TikTok", 
    logoUrl: "https://cdn.simpleicons.org/tiktok/000000",
    color: "bg-gradient-to-br from-gray-900 to-gray-700" 
  },
  { 
    id: "11", 
    name: "YouTube", 
    logoUrl: "https://cdn.simpleicons.org/youtube/FF0000",
    color: "bg-gradient-to-br from-red-600 to-red-700" 
  },
  { 
    id: "12", 
    name: "Pinterest", 
    logoUrl: "https://cdn.simpleicons.org/pinterest/E60023",
    color: "bg-gradient-to-br from-red-500 to-red-600" 
  },
  { 
    id: "13", 
    name: "Messenger", 
    logoUrl: "https://cdn.simpleicons.org/messenger/00B2FF",
    color: "bg-gradient-to-br from-blue-400 to-blue-600" 
  },
  { 
    id: "14", 
    name: "WeChat", 
    logoUrl: "https://cdn.simpleicons.org/wechat/07C160",
    color: "bg-gradient-to-br from-green-500 to-green-600" 
  },
  { 
    id: "15", 
    name: "Discord", 
    logoUrl: "https://cdn.simpleicons.org/discord/5865F2",
    color: "bg-gradient-to-br from-indigo-500 to-indigo-700" 
  },
  { 
    id: "16", 
    name: "Slack", 
    logoUrl: "https://cdn.simpleicons.org/slack/4A154B",
    color: "bg-gradient-to-br from-purple-700 to-purple-900" 
  },
  { 
    id: "17", 
    name: "Reddit", 
    logoUrl: "https://cdn.simpleicons.org/reddit/FF4500",
    color: "bg-gradient-to-br from-orange-500 to-orange-600" 
  },
  { 
    id: "18", 
    name: "Viber", 
    logoUrl: "https://cdn.simpleicons.org/viber/665CAC",
    color: "bg-gradient-to-br from-purple-500 to-purple-600" 
  },
  { 
    id: "19", 
    name: "Line", 
    logoUrl: "https://cdn.simpleicons.org/line/00C300",
    color: "bg-gradient-to-br from-green-500 to-green-600" 
  },
  { 
    id: "20", 
    name: "Google Business", 
    logoUrl: "https://cdn.simpleicons.org/googlemybusiness/4285F4",
    color: "bg-gradient-to-br from-blue-500 to-blue-600" 
  },
];

// Output Feature Cards
const OUTPUT_CARDS: OutputCard[] = [
  { id: "1", icon: "💬", title: "Chat Insights", category: "Analytics" },
  { id: "2", icon: "🤖", title: "AI Automation", category: "Intelligence" },
  { id: "3", icon: "📢", title: "Broadcasting", category: "Marketing" },
  { id: "4", icon: "🔒", title: "Security", category: "Protection" },
  { id: "5", icon: "🔄", title: "Product Sync", category: "E-commerce" },
  { id: "6", icon: "👥", title: "Team Collaboration", category: "Workflow" },
];

// FloatingIcon Component - Icons flow from LEFT to CENTER
interface FloatingIconProps {
  icon: InputIcon;
  delay: number;
  index: number;
}

// FloatingIcon Component - Icons flow RANDOMLY and FASTER into HeidelAI
// FloatingIcon Component - Icons flow ONLY at HeidelAI template height
const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, delay, index }) => {
  // Constrain to HeidelAI template vertical range (center area only)
  const randomTop = 40 + (Math.random() * 20); // Random between 40% and 60% (centered)
  
  return (
    <div
      className={`absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl ${icon.color} flex items-center justify-center shadow-2xl border-2 border-white/30`}
      style={{
        left: '-10vw',
        top: `${randomTop}%`,
        animation: `flowToCenter 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s infinite`,
        zIndex: 5,
      }}
    >
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-12 lg:h-12 flex items-center justify-center">
        <Image
          src={icon.logoUrl}
          alt={icon.name}
          width={48}
          height={48}
          className="w-full h-full object-contain drop-shadow-lg filter brightness-0 invert"
          unoptimized
        />
      </div>
    </div>
  );
};

// OutputCard Component - Flows from CENTER to RIGHT
interface OutputCardProps {
  card: OutputCard;
  delay: number;
  rowIndex: number;
}

const OutputCard: React.FC<OutputCardProps> = ({ card, delay, rowIndex }) => {
  return (
    <div
      className="absolute bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-2 sm:gap-3 md:gap-4 w-[200px] sm:w-[245px] md:w-[290px] lg:w-[315px] p-3.5 sm:p-5 lg:p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-shadow"
      style={{
        left: '50%',
        top: `calc(50% - 60px + ${rowIndex * 140}px)`,
        animation: `flowFromCenter 7s ease-in-out ${delay}s infinite`,
        zIndex: 8,
      }}
    >
      <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl text-xl sm:text-2xl lg:text-3xl shadow-inner border border-indigo-100">
        {card.icon}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 tracking-tight truncate">
          {card.title}
        </p>
        <p className="text-[9px] sm:text-[11px] text-indigo-600 font-semibold uppercase tracking-wider">
          {card.category}
        </p>
      </div>
    </div>
  );
};

// OutputCarousel Component
interface OutputCarouselProps {
  cards: OutputCard[];
}

const OutputCarousel: React.FC<OutputCarouselProps> = ({ cards }) => {
  const midIndex = Math.ceil(cards.length / 2);
  const row1 = cards.slice(0, midIndex);
  const row2 = cards.slice(midIndex);

  return (
    <>
      {/* Row 1 (Top Row) */}
      {row1.map((card, index) => (
        <OutputCard
          key={card.id}
          card={card}
          delay={index * 2}
          rowIndex={0}
        />
      ))}

      {/* Row 2 (Bottom Row) */}
      {row2.map((card, index) => (
        <OutputCard
          key={card.id}
          card={card}
          delay={1 + index * 2}
          rowIndex={1}
        />
      ))}
    </>
  );
};

// Header Component
const SectionHeader: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 md:mb-10 lg:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center">
        Ai that Engages while{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          you sleep 
        </span>
      </h2>
      <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto text-center mt-3 sm:mt-4 md:mt-6">
        Unify every social platform with intelligent AI Companion that handles operations, analyzes performance in real-life, and delivers actionable insights that actually scale revenue.
      </p>
    </div>
  );
};

// ProcessingNode Component - HeidelAI Logo Center
const ProcessingNode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const slides = [
    "Derive actionable insights and optimize next steps",
    "Optimized executive plans",
    "High impact actions"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
<div className="relative" style={{ zIndex: 15 }}>  {/* Changed from z-12 to z-15 */}
      <div className="bg-white rounded-3xl sm:rounded-[36px] md:rounded-[40px] lg:rounded-[44px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:shadow-[0_25px_70px_rgba(0,0,0,0.16)] md:shadow-[0_30px_80px_rgba(0,0,0,0.18)] py-6 px-5 sm:py-8 sm:px-7 md:py-10 md:px-10 lg:py-14 lg:px-12 border-2 border-gray-100 flex flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 transition-all duration-500 backdrop-blur-xl bg-white/98">
        
        {/* Left Side - Logo and Company Info (Vertical Stack) */}
        <div className="flex flex-col items-center gap-2 sm:gap-2.5">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex-shrink-0 relative">
            {/* Multiple Pulse Layers */}
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-indigo-400/15 rounded-full animate-pulse"></div>


            <img
              src="/heidelai.png"
              alt="HeidelAI Logo"
              className="w-full h-full object-contain drop-shadow-2xl relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://cdn-icons-png.flaticon.com/512/2103/2103633.png";
              }}
            />
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] sm:shadow-[0_0_10px_rgba(34,197,94,0.7)]"></div>
              <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.18em]">
                Core Active
              </span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 tracking-tighter leading-none mb-1">
              HeidelAI
            </h1>
            <p className="text-gray-500 font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-wide">
              Growth Intelligence Platform
            </p>
          </div>
        </div>


        {/* Vertical Divider */}
        <div className="h-28 sm:h-32 md:h-40 lg:h-48 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>


        {/* Right Side - Animated Slides */}
        <div className="relative w-full max-w-md min-w-[260px] sm:min-w-[300px] md:min-w-[340px] h-28 sm:h-32 md:h-40 flex items-center justify-center overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center px-4 sm:px-6 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-75'
              }`}
            >
              <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 leading-tight">
                {slide}
              </p>
            </div>
          ))}
          
          {/* Slide Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-indigo-600'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>


      {/* Enhanced Outer Glow */}
      <div className="absolute -inset-6 sm:-inset-8 md:-inset-10 lg:-inset-12 bg-gradient-to-tr from-blue-400/20 via-indigo-500/10 to-purple-400/20 blur-[50px] sm:blur-[60px] lg:blur-[80px] rounded-full -z-10 animate-pulse pointer-events-none"></div>
    </div>
  );
};

// Main Features Component
const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="relative w-full min-h-screen bg-gradient-to-br from-[#FAFBFE] via-[#F8F9FC] to-[#F5F7FB] flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.3] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px] sm:[background-size:24px_24px]"></div>

      {/* Atmospheric Gradients */}
      <div className="absolute top-[-8%] left-[-12%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-[-8%] right-[-12%] w-[50vw] h-[50vw] bg-gradient-to-tl from-purple-200/40 to-pink-200/40 rounded-full blur-[120px] sm:blur-[140px] md:blur-[160px] animate-pulse"></div>

      {/* Section Header */}
      <div className="relative z-10 w-full">
        <SectionHeader />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center">
        {/* Central Intelligence Core - HeidelAI */}
        <ProcessingNode />
      </div>

      {/* Input Stream - Platform Logos (Outside main container for proper fixed positioning) */}
      {/* Input Stream - Platform Logos with RANDOM delays */}
      {INPUT_ICONS.map((icon, idx) => (
        <FloatingIcon
          key={icon.id}
          icon={icon}
          delay={idx * 0.4 + Math.random() * 0.5}
          index={idx}
        />
      ))}
      {/* Continuous flow - second wave with different random delays */}
      {INPUT_ICONS.map((icon, idx) => (
        <FloatingIcon
          key={`${icon.id}-wave2`}
          icon={icon}
          delay={idx * 0.4 + 2.5 + Math.random() * 0.5}
          index={idx}
        />
      ))}

      {/* Output Stream - Feature Cards */}
      <OutputCarousel cards={OUTPUT_CARDS} />

      {/* Enhanced Footer Branding */}
      <div className="relative z-10 mt-8 sm:mt-10 md:mt-12">
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/60 backdrop-blur-md rounded-full border border-gray-200/60 shadow-lg">
          <div className="h-px w-6 sm:w-7 md:w-8 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          <span className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
            HeidelAI
          </span>
          <div className="h-px w-6 sm:w-7 md:w-8 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes flowToCenter {
          0% {
            transform: translateX(0) scale(0.7);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateX(15vw) scale(0.85);
          }
          80% {
            opacity: 1;
            transform: translateX(calc(50vw - 60px)) scale(1);
          }
          95% {
            transform: translateX(calc(50vw - 20px)) scale(0.5);
            opacity: 0.3;
          }
          100% {
            transform: translateX(calc(50vw)) scale(0);
            opacity: 0;
          }
        }

        @keyframes flowFromCenter {
          0% {
            transform: translateX(0) scale(0);
            opacity: 0;
          }
          8% {
            opacity: 0.5;
            transform: translateX(20px) scale(0.5);
          }
          15% {
            opacity: 1;
            transform: translateX(80px) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateX(calc(50vw - 140px)) scale(1);
          }
          95% {
            transform: translateX(calc(50vw - 100px)) scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: translateX(calc(50vw - 60px)) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
