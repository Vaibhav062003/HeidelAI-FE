
import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowRight,
  Zap,
  ExternalLink
} from 'lucide-react';

interface Platform {
  name: string;
  logoUrl: string;
  category: string;
  brandColor: string;
}

const platforms: Platform[] = [
  { 
    name: "WhatsApp", 
    logoUrl: "https://cdn.simpleicons.org/whatsapp/25D366", 
    category: "Messaging", 
    brandColor: "#25D366" 
  },
  { 
    name: "Instagram", 
    logoUrl: "https://cdn.simpleicons.org/instagram/E4405F", 
    category: "Social Media", 
    brandColor: "#E4405F" 
  },
  { 
    name: "Facebook", 
    logoUrl: "https://cdn.simpleicons.org/facebook/1877F2", 
    category: "Social Media", 
    brandColor: "#1877F2" 
  },
  { 
  name: "Telegram", 
  logoUrl: "https://cdn.simpleicons.org/telegram/2AABEE", 
  category: "Messaging", 
  brandColor: "#2AABEE" 
},

  { 
    name: "Shopify", 
    logoUrl: "https://cdn.simpleicons.org/shopify/96BF48", 
    category: "E-commerce", 
    brandColor: "#96BF48" 
  },
  { 
    name: "WooCommerce", 
    logoUrl: "https://cdn.simpleicons.org/woocommerce/96588A", 
    category: "E-commerce", 
    brandColor: "#96588A" 
  },
];

const MarqueeItem = ({ platform }: { platform: Platform }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -8 }}
    className="flex-shrink-0 mx-6"
  >
    <div className="relative group p-8 w-56 h-64 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] hover:border-gray-200">
      {/* Dynamic Brand Glow */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 blur-[50px] opacity-10 group-hover:opacity-25 transition-opacity duration-500"
        style={{ backgroundColor: platform.brandColor }}
      />
      
      <div className="relative z-10 flex flex-col items-center h-full">
        <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
          <img 
            src={platform.logoUrl} 
            alt={`${platform.name} logo`} 
            className="w-10 h-10 object-contain"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
          {platform.name}
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          {platform.category}
        </p>

        <div className="mt-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-tighter border border-emerald-100/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Connect
        </div>
      </div>

      {/* Hover Icon Reveal */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <ExternalLink size={16} className="text-gray-300" />
      </div>
    </div>
  </motion.div>
);

const InfiniteMarquee = ({ items, reverse = false, speed = 30 }: { items: Platform[], reverse?: boolean, speed?: number }) => {
  return (
    <div className="flex overflow-hidden py-12 select-none">
      <motion.div
        animate={{
          x: reverse ? [-2000, 0] : [0, -2000],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap"
      >
        {/* Repeating items multiple times to ensure continuous flow */}
        {[...items, ...items, ...items, ...items, ...items, ...items].map((item, idx) => (
          <MarqueeItem key={`${item.name}-${idx}`} platform={item} />
        ))}
      </motion.div>
    </div>
  );
};

const Integrations: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Split platforms for two-row effect
  const row1 = platforms.slice(0, 3);
  const row2 = platforms.slice(3, 6);

  return (
    <section 
      ref={sectionRef}
      id="integrations" 
      className="relative py-32 bg-[#fafbfc] overflow-hidden cursor-default"
    >
      {/* Interactive Spotlight Background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 70%)`,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header Content */}
        <div className="flex flex-col items-center text-center mb-12 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-indigo-600 text-[11px] font-black uppercase tracking-[0.25em]"
          >
            <Zap size={14} className="fill-indigo-600" />
            Infinite Possibilities
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-5xl font-bold leading-tight sm:text-5xl sm:leading-tight"
          >
            Integrate With the Apps You, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Already Use
            </span>
          </motion.h2 >
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl max-w-2xl text-gray-500 font-medium leading-relaxed tracking-tight"
          >
            No complex setups. Just one-click integrations with the world's leading social, 
            messaging, and commerce platforms.
          </motion.p>
        </div>

        {/* Carousel Section */}
        <div className="relative mt-8 group/marquee">
          {/* Edge Faders for premium feel */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[#fafbfc] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[#fafbfc] to-transparent z-20 pointer-events-none" />

          <div className="flex flex-col gap-0">
            <InfiniteMarquee items={row1} speed={40} />
            <InfiniteMarquee items={row2} reverse speed={45} />
          </div>
        </div>

        {/* Call to Action Bar */}
        <div className="mt-24 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-12 bg-white rounded-[3rem] border border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.05)] text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100/50 transition-colors duration-700" />
            
            <h3 className="text-3xl font-black text-gray-900 mb-4 relative z-10 tracking-tight">
              Looking for something else?
            </h3>
            <p className="text-gray-500 mb-10 text-lg font-medium relative z-10">
              We're constantly adding new integrations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black transition-all shadow-xl hover:shadow-gray-200 hover:-translate-y-1"
              >
                Request Integration
              </motion.button>
                </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-60" />
    </section>
  );
};

export default Integrations;
