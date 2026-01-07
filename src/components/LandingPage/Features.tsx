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

const INPUT_ICONS: InputIcon[] = [
  {
    id: "1",
    name: "WhatsApp",
    logoUrl: "https://cdn.simpleicons.org/whatsapp/25D366",
    color: "border-green-500",
  },
  {
    id: "2",
    name: "Instagram",
    logoUrl: "https://cdn.simpleicons.org/instagram/E4405F",
    color: "border-pink-500",
  },
  {
    id: "3",
    name: "Facebook",
    logoUrl: "https://cdn.simpleicons.org/facebook/1877F2",
    color: "border-blue-500",
  },
  {
    id: "4",
    name: "Telegram",
    logoUrl: "https://cdn.simpleicons.org/telegram/2AABEE",
    color: "border-cyan-500",
  },
  {
    id: "5",
    name: "Shopify",
    logoUrl: "https://cdn.simpleicons.org/shopify/96BF48",
    color: "border-green-600",
  },
  {
    id: "6",
    name: "WooCommerce",
    logoUrl: "https://cdn.simpleicons.org/woocommerce/96588A",
    color: "border-purple-600",
  },
  // {
  //   id: "7",
  //   name: "LinkedIn",
  //   logoUrl: "https://cdn.simpleicons.org/linkedin/0A66C2",
  //   color: "border-blue-600"
  // },
  {
    id: "8",
    name: "Snapchat",
    logoUrl: "https://cdn.simpleicons.org/snapchat/FFFC00",
    color: "border-yellow-400",
  },
  {
    id: "9",
    name: "Twitter/X",
    logoUrl: "https://cdn.simpleicons.org/x/000000",
    color: "border-gray-800",
  },
  {
    id: "10",
    name: "TikTok",
    logoUrl: "https://cdn.simpleicons.org/tiktok/000000",
    color: "border-gray-900",
  },
  {
    id: "11",
    name: "YouTube",
    logoUrl: "https://cdn.simpleicons.org/youtube/FF0000",
    color: "border-red-600",
  },
  {
    id: "12",
    name: "Pinterest",
    logoUrl: "https://cdn.simpleicons.org/pinterest/E60023",
    color: "border-red-500",
  },
  {
    id: "13",
    name: "Messenger",
    logoUrl: "https://cdn.simpleicons.org/messenger/00B2FF",
    color: "border-blue-400",
  },
  {
    id: "14",
    name: "WeChat",
    logoUrl: "https://cdn.simpleicons.org/wechat/07C160",
    color: "border-green-500",
  },
  {
    id: "15",
    name: "Discord",
    logoUrl: "https://cdn.simpleicons.org/discord/5865F2",
    color: "border-indigo-500",
  },
  // {
  //   id: "16",
  //   name: "Slack",
  //   logoUrl: "https://cdn.simpleicons.org/slack/4A154B",
  //   color: "border-purple-700"
  // },
  {
    id: "17",
    name: "Reddit",
    logoUrl: "https://cdn.simpleicons.org/reddit/FF4500",
    color: "border-orange-500",
  },
  {
    id: "18",
    name: "Viber",
    logoUrl: "https://cdn.simpleicons.org/viber/665CAC",
    color: "border-purple-500",
  },
  {
    id: "19",
    name: "Line",
    logoUrl: "https://cdn.simpleicons.org/line/00C300",
    color: "border-green-500",
  },
  // {
  //   id: "20",
  //   name: "Google Business",
  //   logoUrl: "https://cdn.simpleicons.org/googlemybusiness/4285F4",
  //   color: "border-blue-500"
  // },
];

// Output Feature Cards
const OUTPUT_CARDS: OutputCard[] = [
  { 
    id: "1", 
    icon: "📊", 
    title: "Real-Time Analytics", 
    category: "INSIGHTS" 
  },
  { 
    id: "2", 
    icon: "🤖", 
    title: "Smart Automation", 
    category: "EFFICIENCY" 
  },
  { 
    id: "3", 
    icon: "🎯", 
    title: "Lead Qualification", 
    category: "CONVERSION" 
  },
  { 
    id: "4", 
    icon: "💡", 
    title: "Predictive Insights", 
    category: "STRATEGY" 
  },
  { 
    id: "5", 
    icon: "📈", 
    title: "Revenue Optimization", 
    category: "GROWTH" 
  },
  { 
    id: "6", 
    icon: "🔍", 
    title: "Market Intelligence", 
    category: "COMPETITIVE" 
  },
];

// FloatingIcon Component
interface FloatingIconProps {
  icon: InputIcon;
  delay: number;
  index: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, delay, index }) => {
  const randomTop = 45 + Math.random() * 20;

  return (
    <div
      className={`absolute w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-lg border-2 ${icon.color}`}
      style={{
        left: "-10vw",
        top: `${randomTop}%`,
        animation: `flowToCenter 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s infinite`,
        zIndex: 5,
      }}
    >
      <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 flex items-center justify-center">
        <Image
          src={icon.logoUrl}
          alt={icon.name}
          width={48}
          height={48}
          className="w-full h-full object-contain drop-shadow-sm"
          unoptimized
        />
      </div>
    </div>
  );
};

// OutputCard Component
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
        left: "50%",
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
        <OutputCard key={card.id} card={card} delay={index * 2} rowIndex={0} />
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
      <h2
        className="font-[500] italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-5xl mx-auto text-center leading-tight text-gray-900"
        style={{ fontFamily: "'Playfair Display', ui-serif, Georgia, serif" }}
      >
        From Chaos to{" "}
        <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-700 bg-clip-text text-transparent">
          Clarity
        </span>
      </h2>

      <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto text-center mt-3 sm:mt-4 md:mt-6">
        Connect scattered conversations across 20+ platforms into one
        intelligent command center that predicts trends, automates responses,
        and scales your impact effortlessly{" "}
      </p>
    </div>
  );
};

// ProcessingNode Component - HeidelAI Logo Center
const ProcessingNode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    { type: "logo", content: "HeidelAI" },
    {
      type: "text",
      content: "Derive actionable insights and optimize next steps",
    },
    { type: "text", content: "Optimized executive plans" },
    { type: "text", content: "High impact actions" },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative" style={{ zIndex: 15 }}>
      {/* Outer soft glow */}
      <div className="absolute -inset-10 sm:-inset-12 md:-inset-14 lg:-inset-16 bg-gradient-to-b from-gray-200/60 via-white to-gray-200/40 blur-[60px] sm:blur-[70px] md:blur-[80px] rounded-[48px] -z-10 pointer-events-none" />

      {/* Main white card */}
      <div className="bg-white/95 rounded-[32px] sm:rounded-[40px] md:rounded-[44px] lg:rounded-[48px] shadow-[0_28px_80px_rgba(15,23,42,0.18)] border border-gray-100/90 px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-12 lg:px-20 lg:py-14">
        <div className="flex items-center justify-center">
          <div className="relative w-[280px] sm:w-[340px] md:w-[400px] lg:w-[460px] h-[160px] sm:h-[190px] md:h-[220px] lg:h-[240px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-4"
                }`}
              >
                {slide.type === "logo" ? (
                  <div className="flex items-center justify-center gap-4 sm:gap-5">
                    <img
                      src="/heidelai.png"
                      alt="HeidelAI Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn-icons-png.flaticon.com/512/2103/2103633.png";
                      }}
                    />
                    <span className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] font-black tracking-tight text-gray-900">
                      HeidelAI
                    </span>
                  </div>
                ) : (
                  <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-red-700 bg-clip-text text-transparent leading-snug max-w-[90%] px-2">
                    {slide.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
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

      {/* Input Stream - Platform Logos with RANDOM delays */}
      {INPUT_ICONS.map((icon, idx) => (
        <FloatingIcon
          key={icon.id}
          icon={icon}
          delay={idx * 0.7 + Math.random() * 0.8}
          index={idx}
        />
      ))}

      {INPUT_ICONS.map((icon, idx) => (
        <FloatingIcon
          key={`${icon.id}-wave2`}
          icon={icon}
          delay={idx * 0.7 + 4.0 + Math.random() * 0.8}
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
          0%,
          100% {
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
