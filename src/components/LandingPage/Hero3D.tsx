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
    <BackgroundGradient className="min-h-screen flex items-center justify-center pt-10 sm:pt-10 pb-20 sm:pb-20">
      <section id="home" className="w-full text-zinc-900 flex flex-col items-center justify-start relative overflow-hidden">
        <div className="w-full max-w-6xl space-y-6 relative z-10">

          {/* Partners Section - Moved to Top */}
          <div
            className="flex flex-row items-center justify-center gap-4 sm:gap-10 lg:gap-16 max-w-4xl mx-auto pt-3 sm:pt-3 px-4 sm:px-0 font-sans"
          >

            {/* Meta Partner */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-auto  sm:max-w-[200px]">
                <Image
                  src="/logos/meta.png"
                  alt="Meta Business"
                  width={180}   // increase base width
                  height={80}
                  className="h-[70px] sm:h-auto w-auto"
                />

              </div>
            </div>

            {/* Microsoft Partner */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-auto  sm:max-w-[250px]">
                <Image
                  src="/logos/microsoft.png"
                  alt="Microsoft"
                  width={180}
                  height={80}
                  className="h-[70px] sm:h-auto w-auto mt-[-5px]"
                  style={{ objectFit: 'cover', objectPosition: 'center 70%' }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-6 flex items-center justify-center flex-col">
              <h1 className="font-[500] italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-5xl mx-auto text-center leading-tight"
                style={{ fontFamily: "'Awesome Serif', serif" }}>
                AI that{" "}
                <span className="bg-gradient-to-r from-stone-950 via-amber-900 to-stone-950 bg-clip-text text-transparent animate-gradient-soft">
                  {text}
                </span>
                {" "}
                <br className="sm:hidden" />
                <span className="not-italic inline sm:hidden">while you sleep</span>
                <span className="hidden sm:inline">
                  <span className="animate-pulse not-italic">|</span> while you sleep
                </span>
              </h1>

              <p
                className="mt-6 text-sm leading-relaxed text-zinc-500 sm:text-base md:text-lg max-w-3xl mx-auto px-6 sm:px-0 font-medium text-center">
                <span className="block sm:hidden font-sm">
                  AI that unifies your channels, automates sales, and delivers revenue-driven solutions.
                </span>
                <span className="hidden sm:block">
                  Unify every social platform with an intelligent AI Companion that handles operations, analyzes performance in real time, and delivers actionable insights that actually scale revenue.
                </span>
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
    </BackgroundGradient >
  );
};

export default Hero3D;

