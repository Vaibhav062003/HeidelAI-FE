"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  FaChartLine,
  FaRobot,
  FaBullseye,
  FaLightbulb,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa";

// --- Types ---
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

// --- Data: Input Icons (Your specific App Logos) ---
const INPUT_ICONS: InputIcon[] = [
  { id: "1", name: "WhatsApp", logoUrl: "https://cdn.simpleicons.org/whatsapp/25D366", color: "border-green-500" },
  { id: "2", name: "Instagram", logoUrl: "https://cdn.simpleicons.org/instagram/E4405F", color: "border-pink-500" },
  { id: "3", name: "Facebook", logoUrl: "https://cdn.simpleicons.org/facebook/1877F2", color: "border-blue-500" },
  { id: "4", name: "Telegram", logoUrl: "https://cdn.simpleicons.org/telegram/2AABEE", color: "border-cyan-500" },
  { id: "5", name: "Shopify", logoUrl: "https://cdn.simpleicons.org/shopify/96BF48", color: "border-green-600" },
  { id: "6", name: "WooCommerce", logoUrl: "https://cdn.simpleicons.org/woocommerce/96588A", color: "border-purple-600" },
  { id: "8", name: "Snapchat", logoUrl: "https://cdn.simpleicons.org/snapchat/FFFC00", color: "border-yellow-400" },
  { id: "9", name: "Twitter/X", logoUrl: "https://cdn.simpleicons.org/x/000000", color: "border-gray-800" },
  { id: "10", name: "TikTok", logoUrl: "https://cdn.simpleicons.org/tiktok/000000", color: "border-gray-900" },
  { id: "11", name: "YouTube", logoUrl: "https://cdn.simpleicons.org/youtube/FF0000", color: "border-red-600" },
  { id: "12", name: "Pinterest", logoUrl: "https://cdn.simpleicons.org/pinterest/E60023", color: "border-red-500" },
  { id: "13", name: "Messenger", logoUrl: "https://cdn.simpleicons.org/messenger/00B2FF", color: "border-blue-400" },
  { id: "14", name: "WeChat", logoUrl: "https://cdn.simpleicons.org/wechat/07C160", color: "border-green-500" },
];

// --- Data: Output Cards (Restored) ---
const OUTPUT_CARDS_1: OutputCard[] = [
  { id: "1", icon: "FaChartLine", title: "Real-Time Analytics", category: "INSIGHTS" },
  { id: "2", icon: "FaRobot", title: "Smart Automation", category: "EFFICIENCY" },
  { id: "3", icon: "FaBullseye", title: "Lead Qualification", category: "CONVERSION" },
];

const OUTPUT_CARDS_2: OutputCard[] = [
  { id: "4", icon: "FaLightbulb", title: "Predictive Insights", category: "STRATEGY" },
  { id: "5", icon: "FaDollarSign", title: "Revenue Optimization", category: "GROWTH" },
  { id: "6", icon: "FaSearch", title: "Market Intelligence", category: "COMPETITIVE" },
];

// --- Helper Components ---

// 1. Funnel Icon (The Swarm)
const FunnelIcon: React.FC<{ icon: InputIcon }> = ({ icon }) => {
  const { startY, duration, delay, scale } = useMemo(() => {
    return {
      startY: (Math.random() - 0.5) * 800, // Wide vertical spread at start
      duration: 4 + Math.random() * 4,
      delay: Math.random() * -20, // Negative delay for instant flow
      scale: 0.7 + Math.random() * 0.4
    };
  }, []);

  return (
    <div
      className={`absolute left-0 top-1/2 rounded-2xl bg-white flex items-center justify-center shadow-md border ${icon.color}`}
      style={
        {
          width: '44px',
          height: '44px',
          "--startY": `${startY}px`,
          "--duration": `${duration}s`,
          "--delay": `${delay}s`,
          "--scale": scale,
          animation: `funnelFlow var(--duration) linear var(--delay) infinite`,
          zIndex: 20, // Above background cards, below node
        } as React.CSSProperties & { [key: string]: any }
      }
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Image
          src={icon.logoUrl}
          alt={icon.name}
          width={32}
          height={32}
          className="w-full h-full object-contain"
          unoptimized
        />
      </div>
    </div>
  );
};

// 2. Icon Renderer for Cards
const getIcon = (iconName: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    FaChartLine, FaRobot, FaBullseye, FaLightbulb, FaDollarSign, FaSearch
  };
  const IconComponent = icons[iconName];
  return IconComponent ? <IconComponent className="w-full h-full" /> : null;
};

// 3. Card Item (Background)
const CardItem = ({ card }: { card: OutputCard }) => (
  <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm border border-gray-100 p-4 rounded-2xl shadow-sm w-[280px] flex-shrink-0">
    <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl text-indigo-600 p-2.5">
      {getIcon(card.icon)}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold text-gray-900 leading-tight">
        {card.title}
      </span>
      <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">
        {card.category}
      </span>
    </div>
  </div>
);

// --- Output Carousel Component (Restored) ---
const OutputCarousel = () => {
  const row1 = [...OUTPUT_CARDS_1, ...OUTPUT_CARDS_1, ...OUTPUT_CARDS_1, ...OUTPUT_CARDS_1];
  const row2 = [...OUTPUT_CARDS_2, ...OUTPUT_CARDS_2, ...OUTPUT_CARDS_2, ...OUTPUT_CARDS_2];

  return (
    <div className="absolute inset-0 z-0 flex flex-col justify-center items-center overflow-hidden pointer-events-none">
      <div className="w-full max-w-[1600px] flex flex-col gap-10 opacity-0 animate-emerge">
        
        {/* Row 1 (Left Side -> Center) */}
 <div 
          className="flex overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 45%, black 55%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 45%, black 55%, black 100%)'
          }}
        >
          <div className="flex animate-scroll-right gap-6 px-6">
            {row1.map((card, idx) => (
              <CardItem key={`r1-${idx}`} card={card} />
            ))}
          </div>
        </div>
        {/* Row 2 (Right Side -> Center) */}
        <div 
          className="flex overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to left, black 0%, black 45%, transparent 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 0%, black 45%, transparent 55%, transparent 100%)'
          }}
        >
          <div className="flex animate-scroll-left gap-6 px-6">
            {row2.map((card, idx) => (
              <CardItem key={`r2-${idx}`} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Center Processing Node ---
const ProcessingNode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { type: "logo", content: "HeidelAI" },
    { type: "text", content: "Derive actionable insights and optimize next steps" },
    { type: "text", content: "Optimized executive plans" },
    { type: "text", content: "High impact actions" },
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      3500
    );
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    // z-30 ensures it sits ON TOP of the flowing icons and carousel
    <div className="relative z-30 mx-auto transition-all duration-300 w-[90vw] max-w-[420px] sm:w-auto sm:max-w-3xl lg:max-w-5xl">
      <div className="w-full bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border border-gray-100 flex flex-col items-center justify-center rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] px-6 py-12 sm:px-14 sm:py-16 md:p-20">
        <div className="relative w-full flex items-center justify-center min-h-[120px] sm:min-h-auto aspect-auto sm:aspect-[2.5/1] md:aspect-[3/1]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4 pointer-events-none"
              }`}
            >
              {slide.type === "logo" ? (
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <img
                    src="/heidelai.png"
                    alt="HeidelAI Logo"
                    className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn-icons-png.flaticon.com/512/2103/2103633.png";
                    }}
                  />
                  <span className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight text-gray-900">
                    {slide.content}
                  </span>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center px-2">
                  <p className="text-center font-semibold bg-gradient-to-r from-orange-500 via-orange-600 to-red-700 bg-clip-text text-transparent text-base sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed max-w-full break-words">
                    {slide.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Feature Section ---
const Features: React.FC = () => {
  // Density: Duplicate icons 6 times for swarm effect
  const denseIcons = useMemo(() => {
    let allIcons: (InputIcon & { uniqueKey: string })[] = [];
    for(let i = 0; i < 6; i++) {
        allIcons = [...allIcons, ...INPUT_ICONS.map((icon, j) => ({
            ...icon,
            uniqueKey: `${icon.id}-${i}-${j}`
        }))];
    }
    return allIcons;
  }, []);

  return (
    <section
      id="features"
      // Removed bg-slate-50/50, now using bg-white
      className="relative w-full min-h-[50vh] sm:min-h-screen flex flex-col items-center justify-center py-12 sm:py-24 overflow-hidden bg-white"
    >
      <div className="relative z-10 w-full mb-8 sm:mb-20 px-4">
        <h2 className="text-2xl sm:text-7xl md:text-8xl font-serif italic text-center text-gray-900 tracking-tight">
          From Chaos to <span className="text-orange-600">Clarity</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto text-center mt-3 sm:mt-4 md:mt-6">
          Connect scattered conversations across 20+ platforms into one
          intelligent command center that predicts trends, automates responses,
          and scales your impact effortlessly
        </p>
      </div>

      <div className="relative w-full flex items-center justify-center min-h-[300px] sm:min-h-[700px]">
        {/* 1. Background Carousel (Cards) */}
        <OutputCarousel />

        {/* 2. Funnel Icons (Swarm) */}
        {denseIcons.map((icon) => (
          <FunnelIcon key={icon.uniqueKey} icon={icon} />
        ))}
        
        {/* 3. Processing Node (Center) */}
        <ProcessingNode />
      </div>

      <style jsx global>{`
        /* Funnel Animation */
        @keyframes funnelFlow {
          0% {
            transform: translate3d(-60vw, var(--startY), 0) scale(var(--scale));
            opacity: 0;
          }
          10% { opacity: 1; }
          70% {
             /* Neck of funnel: Move to 15vw, squeeze Y */
             transform: translate3d(15vw, calc(var(--startY) * 0.15), 0) scale(var(--scale));
             opacity: 1;
          }
          100% {
            /* Black Hole: Center (40vw), Scale 0 */
            transform: translate3d(40vw, 0, 0) scale(0.1);
            opacity: 0;
          }
        }

        /* Carousel Animations */
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes emerge {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-scroll-right { animation: scroll-right 40s linear infinite; }
        .animate-scroll-left { animation: scroll-left 40s linear infinite; }
        .animate-emerge { animation: emerge 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
};

export default Features;

