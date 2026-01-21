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

        {/* Beta Status Badge */}
        <div className="flex justify-center mb-[-16px] sm:mb-[-20px] relative pt-10 sm:pt-28 z-20">
          <Badge className="bg-white/40 backdrop-blur-md border border-[#0080A0]/20 text-[#0080A0] px-4 py-1.5 rounded-full shadow-[0_8px_32px_rgba(0,128,160,0.1)] transition-all duration-500 hover:scale-105 hover:bg-white/60 group cursor-default">
            <div className="flex items-center h-5 text-[10px] sm:text-xs font-normal font-sans font-[800] tracking-[0.15em] uppercase">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0080A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0080A0]"></span>
                </span>
                🚀 Beta is Live Now
              </span>
            </div>
          </Badge>
        </div>

        {/* Partners Section - Moved to Top */}
        <div
          className="flex flex-row items-center  justify-center gap-3 sm:gap-10 lg:gap-16 w-full max-w-4xl mx-auto pt-1 sm:pt-2 font-sans"
        >

          {/* Meta Partner */}
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <Image
                src="/logos/meta.png"
                alt="Meta Business"
                width={1800}
                height={80}
                className="h-[80px] sm:h-[100px] w-auto ml-10"
                style={{ objectFit: 'cover', objectPosition: 'center 70%' }}
              />
            </div>
          </div>

          {/* Microsoft Partner */}
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <Image
                src="/logos/microsoft.png"
                alt="Microsoft"
                width={180}
                height={80}
                className="h-[80px] sm:h-[100px] w-auto ml-5"
                style={{ objectFit: 'cover', objectPosition: 'center 70%' }}
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

            <div className="flex flex-col sm:flex-row pt-4 sm:pt-7 gap-4 items-center justify-center w-full">
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
