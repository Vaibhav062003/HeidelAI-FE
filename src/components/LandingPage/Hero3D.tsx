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
    <BackgroundGradient className="min-h-screen flex items-center justify-center pt-20 sm:pt-28 pb-20 sm:pb-28">
      <section id="home" className="w-full text-zinc-900 flex flex-col items-center justify-start relative overflow-hidden">
        <div className="w-full max-w-6xl space-y-6 relative z-10">

          {/* Partners Section - Moved to Top */}
          <div
            className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10 lg:gap-16 max-w-4xl mx-auto pt-5 sm:pt-5 px-2 sm:px-0 font-sans"
          >

            {/* Meta Partner */}
            <div className="flex items-center gap-2">
              <Image
                src="/logos/meta.png"
                alt="Meta Business"
                width={42}
                height={42}
                className="w-16 h-16 sm:w-16 sm:h-16 object-contain mix-blend-multiply"
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-zinc-600 leading-[1.1]">Meta Business</span>
                <span className="text-sm sm:text-base font-bold text-zinc-600 leading-[1.1]">Partners</span>
              </div>
            </div>

            {/* Microsoft Partner */}
            <div className="flex items-center gap-2">
              <Image
                src="/logos/microsoft.png"
                alt="Microsoft"
                width={38}
                height={38}
                className="w-16 h-16 sm:w-16 sm:h-16 object-contain mix-blend-multiply"
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-zinc-600 leading-[1.1]">Backed by</span>
                <span className="text-sm sm:text-base font-bold text-zinc-600 leading-[1.1]">Microsoft</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-6 flex items-center justify-center flex-col">
              <h1 className="font-[500] italic text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-5xl mx-auto text-center"
                style={{ fontFamily: "'Awesome Serif', serif" }}>
                AI that{" "}
                <span className="bg-gradient-to-r from-stone-950 via-amber-900 to-stone-950 bg-clip-text text-transparent animate-gradient-soft">
                  {text}
                </span>
                {" "}
                <span className="animate-pulse not-italic">|</span>
                <span className="block sm:inline"> while you sleep</span>
              </h1>

              <p
                className="mt-6 text-sm leading-relaxed text-zinc-500 sm:text-base md:text-lg max-w-3xl mx-auto px-4 sm:px-0 font-medium text-center">
                Unify every social platform with an intelligent AI Companion that handles operations, analyzes performance in real time, and delivers actionable insights that actually scale revenue.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <HoverBorderGradientDemo />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle 3D Background
        <div className='absolute inset-0 opacity-[0.03] pointer-events-none'>
          <Scene />
        </div> */}
      </section>
    </BackgroundGradient>
  );
};

export default Hero3D;

