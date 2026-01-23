import React, { useState, useEffect } from 'react';
import { Scene } from '@/components/LandingPage/ui/hero-section';
import { Button } from '@/components/LandingPage/ui/button';
import { Badge } from '@/components/LandingPage/ui/badge';
import { HoverBorderGradientDemo } from '@/components/HoverBorderGradientDemo';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import CountDownTimer from './CountDownTimer';
import { ChevronRight } from 'lucide-react';
import BackgroundGradient from './ui/BackgroundGradient';

const Hero3D = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['Engages', 'Converts', 'Scales'];
  const typingSpeed = 200;
  const deletingSpeed = 120;
  const pauseTime = 1000;

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <BackgroundGradient className="min-h-[100svh] w-full flex items-center justify-center px-4 sm:px-6 md:px-10 pb-20 sm:pb-24 md:pb-28 relative overflow-hidden">
      <div className="w-full max-w-6xl space-y-4 sm:space-y-6 relative z-10 -mt-5 sm:mt-0">

        {/* Beta Status Badge Variants Test */}
        <div className="flex flex-wrap justify-center gap-4 mb-[-5px] sm:mb-[-20px] relative pt-10 sm:pt-24 z-20">

          {/* Variant 1: Glossy Dark (Matches 'Tutorial' in image) */}
          <Badge className="bg-gradient-to-br from-[#919193] via-[#49494d] to-[#56545c] text-white px-6 py-2 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.3)] border-t border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border-none">
            <div className="flex items-center h-5 text-[10px] sm:text-xs font-semibold tracking-wider">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                BETA IS LIVE
              </span>
            </div>
          </Badge>

          {/* Variant 2: Glossy Ceramic (Matches 'Chips UI' in image) */}
          <Badge className="bg-gradient-to-b from-[#f8f9fa] via-[#e9ecef] to-[#cbd5e0] text-zinc-900 px-6 py-2 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_16px_rgba(0,0,0,0.1)] border border-zinc-300/50 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer">
            <div className="flex items-center h-5 text-[10px] sm:text-xs font-semibold tracking-wider">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a4391] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a4391]"></span>
                </span>
                BETA IS LIVE
              </span>
            </div>
          </Badge>

          {/* Variant 3: Lavender Bordered (Matches 'Design ideas' in image) */}
          <Badge className="bg-[#f3f4ff] border-2 border-[#7c75c3]/40 text-[#4a4391] px-6 py-1.5 rounded-full shadow-sm transition-all duration-300 hover:bg-[#e8eaff] hover:scale-105 active:scale-95 group cursor-pointer">
            <div className="flex items-center h-5 text-[10px] sm:text-xs font-bold tracking-wider">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c75c3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7c75c3]"></span>
                </span>
                BETA IS LIVE
              </span>
            </div>
          </Badge>

          {/* Variant 4: Glassmorphism (Purple Theme) */}
          <Badge className="bg-white/40 backdrop-blur-md border border-[#7c75c3]/20 text-[#120e2a] px-6 py-2 rounded-full shadow-[0_8px_32px_rgba(124,117,195,0.15)] transition-all duration-300 hover:bg-white/60 hover:scale-105 active:scale-95 group cursor-pointer">
            <div className="flex items-center h-5 text-[10px] sm:text-xs font-semibold tracking-wider">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a4391] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a4391] shadow-[0_0_8px_rgba(74,67,145,0.6)]"></span>
                </span>
                BETA IS LIVE
              </span>
            </div>
          </Badge>
        </div>

        <div
          className="flex flex-row items-center justify-center ml-4 gap-4 sm:gap-10 lg:gap-16 w-full max-w-4xl mx-auto pt-4 sm:pt-2 mb-[-20px] sm:mb-[-20px] font-sans"
        >

          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center justify-center mr-[-5px] sm:mr-0">
              <Image
                src="/logos/meta.png"
                alt="Meta Business"
                width={200}
                height={80}
                className="h-[90px] sm:h-[100px] w-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-start">
            <div className="flex items-center justify-center ml-[-5px] sm:ml-0">
              <Image
                src="/logos/microsoft.png"
                alt="Microsoft"
                width={200}
                height={80}
                className="h-[90px] sm:h-[100px] w-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">

          <div className="space-y-4 sm:space-y-6 flex items-center justify-center flex-col">
            <h1 className="font-[500] italic text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-5xl mx-auto text-center leading-[1.1] tracking-tight px-4"
              style={{ fontFamily: "'Awesome Serif', serif" }}>
              <span className="text-black">
                AI that{" "}
              </span>
              <span className="inline-flex items-baseline min-h-[1.2em] min-w-[1px]">
                <span className="text-black">
                  {text || "\u200B"}
                </span>
                <span className='text-black'>/</span>
              </span>
              {" "}
              <br />
              <span className="italic inline sm:hidden bg-gradient-to-r from-[#2c3e50] via-[#4ca1af] to-[#2c3e50] bg-clip-text text-transparent">
                while you sleep
              </span>
              <span className="hidden sm:inline italic bg-gradient-to-r from-[#1a1a1a] via-[#3d3d3d] to-[#1a1a1a] bg-clip-text text-transparent">
                while you sleep
              </span>
            </h1>

            <p
              className="mt-2 sm:mt-4 text-[15px] leading-relaxed text-zinc-500 sm:text-base md:text-lg max-w-3xl mx-auto px-6 sm:px-0 font-medium text-center">
              <span className="block sm:hidden font-md font-[600] ">
                AI that unifies your channels, automates sales, and delivers revenue-driven solutions.
              </span>
              <span className="hidden sm:block font-md font-[600] ">
                Unify every social platform with an intelligent AI Companion that handles operations, analyzes performance in real time, and delivers actionable insights that actually scale revenue.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row pt-12 sm:pt-7 gap-4 items-center justify-center w-full">
              <HoverBorderGradientDemo />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle 3D Background
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none'>
        <Scene />
      </div> */}
    </BackgroundGradient>
  );
};

export default Hero3D;
