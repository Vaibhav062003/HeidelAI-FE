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
];

const OUTPUT_CARDS: OutputCard[] = [
  {
    id: "1",
    icon: "FaChartLine",
    title: "Real-Time Analytics",
    category: "INSIGHTS",
  },
  {
    id: "2",
    icon: "FaRobot",
    title: "Smart Automation",
    category: "EFFICIENCY",
  },
  {
    id: "3",
    icon: "FaBullseye",
    title: "Lead Qualification",
    category: "CONVERSION",
  },
  {
    id: "4",
    icon: "FaLightbulb",
    title: "Predictive Insights",
    category: "STRATEGY",
  },
  {
    id: "5",
    icon: "FaDollarSign",
    title: "Revenue Optimization",
    category: "GROWTH",
  },
  {
    id: "6",
    icon: "FaSearch",
    title: "Market Intelligence",
    category: "COMPETITIVE",
  },
];

interface FloatingIconProps {
  icon: InputIcon;
  delay: number;
  index: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, delay, index }) => {
  const isBottomWave = index >= 3; // Last 3 icons come from bottom
  const verticalOffset = isBottomWave
    ? Math.random() * 100 // Positive: bottom (200px to 800px below)
    : (Math.random() - 0.5) * 600; // Mixed: top/bottom spread

  return (
    <div
      className={`absolute w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-lg border-2 ${icon.color}`}
      style={{
        animation: `funnelFlow 7s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s infinite`,
        zIndex: 5,
        ["--offset" as any]: `${verticalOffset}px`,
        ["--is-bottom" as any]: isBottomWave ? "1" : "0",
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

const OutputCard: React.FC<{
  card: OutputCard;
  rowIndex: number;
  delayOffset: number;
  duration: number;
}> = ({ card, rowIndex, delayOffset, duration }) => {
  const iconMap: any = {
    FaChartLine,
    FaRobot,
    FaBullseye,
    FaLightbulb,
    FaDollarSign,
    FaSearch,
  };
  const Icon = iconMap[card.icon];

  const verticalMargin =
    rowIndex === -1 ? "clamp(-50px, -5vw, -30px)" : "clamp(20px, 2vw, 30px)";

  return (
    <div
      className="absolute bg-white rounded-xl sm:rounded-[2rem] shadow-xl border border-gray-100 flex flex-col p-3 sm:p-5 pointer-events-none"
      style={{
        // Prevents squishing on mobile
        width: "clamp(130px, 15vw, 240px)",
        height: "clamp(90px, 12vw, 160px)",
        left: "50%",
        top: "50%",
        marginTop: verticalMargin,
        zIndex: 8,
        animation: `emergeRightFlow ${duration}s linear infinite`,
        animationDelay: `-${delayOffset}s`,
        opacity: 0,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-2 sm:gap-4">
        {/* Responsive Icon Box */}
        <div className="w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center bg-indigo-50 rounded-lg sm:rounded-2xl text-indigo-600">
          {Icon && <Icon className="w-5 h-5 sm:w-10 sm:h-10" />}
        </div>
        <div className="text-center w-full px-1">
          <p className="text-[10px] sm:text-lg font-bold text-gray-900 truncate tracking-tight">
            {card.title}
          </p>
          <p className="text-[7px] sm:text-[11px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">
            {card.category}
          </p>
        </div>
      </div>
    </div>
  );
};

const OutputCarousel: React.FC<{ cards: OutputCard[] }> = ({ cards }) => {
  // Safe defaults
  const [timing, setTiming] = useState({ duration: 22, interval: 5.5 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      // Mobile (<640px): 8s duration / 4s interval = Only 2 cards active. Zero chance of overlap.
      // Desktop (>1280px): 22s duration / 5.5s interval = 4 cards active. Good density, no crash.
      if (w < 640) setTiming({ duration: 8, interval: 4.0 });
      else if (w < 1280) setTiming({ duration: 15, interval: 5.0 });
      else setTiming({ duration: 22, interval: 7.5 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const row1Cards = cards.filter((_, i) => i % 2 === 0);
  const row2Cards = cards.filter((_, i) => i % 2 === 1);

  return (
    <div className="absolute inset-0 pointer-events-none" key={timing.duration}>
      {row1Cards.map((card, idx) => (
        <OutputCard
          key={`r1-${idx}`}
          card={card}
          rowIndex={-1}
          delayOffset={idx * timing.interval}
          duration={timing.duration}
        />
      ))}
      {row2Cards.map((card, idx) => (
        <OutputCard
          key={`r2-${idx}`}
          card={card}
          rowIndex={1}
          delayOffset={idx * timing.interval + timing.interval / 2}
          duration={timing.duration}
        />
      ))}
    </div>
  );
};

const ProcessingNode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { type: "logo", content: "HeidelAI" },
    {
      type: "text",
      content: "Derive actionable insights and optimize next steps",
    },
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
    <div className="relative w-[85vw] max-w-[280px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex justify-center z-[15] mx-auto transition-all duration-300">
      <div className="w-full bg-white rounded-2xl sm:rounded-[3.5rem] shadow-2xl border border-gray-100 px-4 py-8 sm:px-16 sm:py-24 flex flex-col items-center">
        {/* Aspect Ratio keeps it rectangular and stable */}
        <div className="relative w-full aspect-[2.2/1] sm:aspect-[2.5/1]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
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
                  <span className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] font-bold tracking-tight text-gray-900">
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
  );
};

const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="relative w-full min-h-[50vh] sm:min-h-screen flex flex-col items-center justify-center py-12 sm:py-24 overflow-hidden bg-white"
    >
      <div className="relative z-10 w-full mb-8 sm:mb-20 px-4">
        <h2 className="text-2xl sm:text-7xl md:text-8xl font-serif italic text-center text-gray-900 tracking-tight">
          From Chaos to <span className="text-orange-600">Clarity</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto text-center mt-3 sm:mt-4 md:mt-6">
          Connect scattered conversations across 20+ platforms into one
          intelligent command center that predicts trends, automates responses,
          and scales your impact effortlessly{" "}
        </p>
      </div>

      <div className="relative z-20 w-full flex items-center justify-center min-h-[300px] sm:min-h-[700px]">
        <ProcessingNode />
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
        ))}{" "}
        <OutputCarousel cards={OUTPUT_CARDS} />
      </div>

      <style jsx>{`
        @keyframes funnelFlow {
          0% {
            left: -30vw;
            /* TRUE FUNNEL: Wide mouth covers entire viewport height */
            top: calc(50% + var(--offset, 0px));
            transform: scale(1.3) rotate(-5deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
            transform: scale(1.15) rotate(2deg);
          }

          25% {
            left: 8vw;
            top: calc(50% + var(--offset, 0px) * 1.1);
            transform: scale(1.05);
          }

          45% {
            left: 22vw;
            top: calc(50% + var(--offset, 0px) * 0.8);
            transform: scale(0.9);
          }

          65% {
            left: 36vw;
            top: calc(50% + var(--offset, 0px) * 0.5);
            transform: scale(0.75);
          }

          85% {
            left: 46vw;
            top: calc(50% + var(--offset, 0px) * 0.15);
            transform: scale(0.45);
          }

          95% {
            left: 49vw;
            top: 50%;
            transform: scale(0.2);
            opacity: 0.6;
          }

          100% {
            left: 50vw;
            top: 50%;
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
        }
        @keyframes emergeRightFlow {
          0% {
            opacity: 0;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.3);
          }
          5% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          95% {
            opacity: 1;
          }
          /* EXTENDED EXIT PATH: Ensures cards fully clear wide screens */
          100% {
            opacity: 0;
            left: 150%;
            transform: translate(0, -50%) scale(1.1);
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
