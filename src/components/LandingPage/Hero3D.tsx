import React from 'react';
import { Scene } from '@/components/LandingPage/ui/hero-section';
// import { Button } from './ui/button';
import { Badge } from '@/components/LandingPage/ui/badge';
import { Button } from '@/components/LandingPage/ui/flow-hover-button';
import { HoverBorderGradientDemo } from '@/components/HoverBorderGradientDemo';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const Hero3D = () => {
  const router = useRouter();
  return (
    <section id="home" className="min-h-screen w-full bg-gradient-to-br from-[#000] to-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 pt-16 sm:pt-24 relative overflow-hidden">
      <div className="w-full max-w-6xl space-y-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-full">
            🚀 Transform Your Business with AI
          </Badge>
          
          <div className="space-y-6 flex items-center justify-center flex-col">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl sm:leading-tight tracking-tight max-w-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/90">
                AI Solutions to{' '}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/95 to-rose-300">
                Revolutionize
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/90">
                Your Business
              </span>
            </h1>
            <p className="text-md sm:text-lg text-white/60 mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              <span className="block sm:hidden">
                Unite all your platforms with AI-powered insights and smart automation.
              </span>
              <span className="hidden sm:block">
                Connect all your platforms - WhatsApp, Instagram, Facebook, Telegram - in one place. 
                Get AI-powered conversation insights, smart reply suggestions, and seamless product catalog sync.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row  gap-4 items-center">
              {/* <Button >
                Request Demo
              </Button> */}
              <HoverBorderGradientDemo />
              {/* <Button className="text-sm px-8 py-3 rounded-xl bg-transparent text-white border border-white/20 shadow-none hover:bg-white/10 transition-none">
                Watch Demo
              </Button> */}
              <button 
                className="hidden sm:flex relative cursor-pointer  items-center justify-center overflow-hidden rounded-xl 
                  border border-white/20 backdrop-blur-sm bg-white/10 text-white text-sm font-semibold
                  px-4 py-3 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={() => {router.push('/onboarding')}}
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="flex flex-row items-center justify-center gap-8 sm:gap-12 max-w-4xl mx-auto pt-8 sm:pt-12">
          <div className="flex items-center justify-center w-auto  sm:max-w-[160px]">
              <Image 
                src="/logos/group2.webp" 
                alt="Meta Certified" 
                width={130} 
                height={60}
                className="sm:h-auto h-[25px] w-auto"
              />
          </div>
          <div className="flex items-center justify-center w-auto  sm:max-w-[130px]">
              <Image 
                src="/logos/group1.webp" 
                alt="Microsoft" 
                width={130} 
                height={60}
                className="mt-[-5px] sm:h-auto h-[30px] w-auto"
                style={{ objectFit: 'cover', objectPosition: 'center 70%' }}
              />
          </div>
        </div>

        
      </div>
      
      {/* 3D Background with darker overlay */}
      <div className='absolute inset-0'>
        <Scene />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
    </section>
  );
};

export default Hero3D;