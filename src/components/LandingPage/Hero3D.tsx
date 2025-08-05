import React from 'react';
import { Scene } from '@/components/LandingPage/ui/hero-section';
// import { Button } from './ui/button';
import { Badge } from '@/components/LandingPage/ui/badge';
import { Button } from '@/components/LandingPage/ui/flow-hover-button';
import { HoverBorderGradientDemo } from '@/components/HoverBorderGradientDemo';

const Hero3D = () => {
  return (
    <section id="home" className="min-h-screen w-full bg-gradient-to-br from-[#000] to-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 pt-24 relative overflow-hidden">
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
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 max-w-4xl mx-auto pt-2 sm:pt-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">25K+</div>
            <div className="text-white/50 text-xs sm:text-base mt-1">Messages Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">11+</div>
            <div className="text-white/50 text-xs sm:text-base mt-1">Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">5+</div>
            <div className="text-white/50 text-xs sm:text-base mt-1">Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">99.9%</div>
            <div className="text-white/50 text-xs sm:text-base mt-1">Uptime</div>
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