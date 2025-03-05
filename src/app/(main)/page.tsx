'use client'
//dummy
// import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FlipWords } from '@/components/ui/flip-words';
// import { TimelineDemo } from '@/components/TimelineDemo';
import { BentoGridThirdDemo } from '@/components/BentoGridDemo';
import { HoverBorderGradientDemo } from '@/components/HoverBorderGradientDemo';
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import TestimonialSection from '@/components/TestimonialSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import { InView } from '@/components/ui/in-view';
import { TextEffect } from '@/components/ui/text-effect';
import { VariableFontCursorProximity } from '@/components/ui/variable-font-proximity';
import { cn } from '@/components/cn/index';
import { InViewTextEffect } from '@/components/InViewTextEffect';
import { AnimateInView } from '@/components/AnimateInView';
// import PricingSection2 from '@/components/PricingSection2';

// import Hyperspeed from '@/components/Hyperspeed';

// const Hyperspeed = dynamic(() => import('@/components/Hyperspeed'), {
//   ssr:true,
//   loading: () => <div className="w-full h-full bg-black" />
// });

// const ShaderGradientCanvas = dynamic(
//   () => import('@shadergradient/react').then((mod) => mod.ShaderGradientCanvas),
//   { ssr: false }
// )

// const ShaderGradient = dynamic(
//   () => import('@shadergradient/react').then((mod) => mod.ShaderGradient),
//   { ssr: false }
// )

export default function Home() {

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const offset = (factor: number) => ({
    x: (mousePos.x - windowSize.width / 2) * factor,
    y: (mousePos.y - windowSize.height / 2) * factor,
  });
  const containerRef = useRef<HTMLDivElement>(null);


  const words = ["engage", "optimize", "predict", "innovate", "grow"];
  return (
    <main className="min-h-screen relative">
       
      {/* Hero Section */}
      <section className="h-screen relative flex flex-col lg:mt-12  " id="home">
        {/* Hero Content */}
        <div className="flex flex-col items-center  relative z-10   ">
          <div className="h-[40rem] flex flex-col text-center justify-center  items-center px-4">
            
            <div ref={containerRef} className="text-4xl lg:text-7xl lg:w-[75%] w-full lg:leading-tight  mb-5 lg:mb-10 mx-auto lg:font-medium font-semibold text-neutral-100">
            {/* <VariableFontCursorProximity
        className={cn("text-2xl md:text-3xl lg:text-4xl")}
        radiusZoomingZone={290 00}
        containerRef={containerRef}
      > */}
            <TextEffect preset='fade-in-blur' per='char' speedReveal={2} speedSegment={0.3}>
            AI Solutions to Revolutionize Your Business
            </TextEffect>
            {/* </VariableFontCursorProximity> */}
            </div>
            <div className='lg:text-xl text-base font-medium  lg:font-normal text-neutral-400 lg:mb-10 mb-5'>
            <motion.div
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(20px)", y: 20 }}
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      transition={{ duration: 0.6,delay:1.5, type: "ease" }}
    >
              Empower your brand to
              
              <FlipWords words={words} /> <br />
              with AI-driven insights.
              </motion.div>
            </div>
            <motion.div
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(20px)", y: 20 }}
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      transition={{ duration: 0.6,delay:2, type: "ease" }}
    >
          <HoverBorderGradientDemo />
          </motion.div>
          {/* <button className="chronicle-button ">
            <span>
              <em>Request Demo.</em>
            </span>
            <span>
              <em>Request Demo.</em>
            </span>
          </button> */}
          </div>
        </div>

        {/* Hyperspeed Background */}
        <div className="absolute bottom-0 h-[60vh] w-full">
          {/* <Hyperspeed /> */}
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-black px-4 my-6 lg:mt-12'>
        <BentoGridThirdDemo />
      </section>

     
      
      
        
          <section
            className='bg-black mt-10  lg:mt-20 h-[70vh] flex flex-col justify-center items-center'
            onMouseMove={handleMouseMove}
          >
            <div className='relative py-8 flex flex-col items-center w-[80vw] h-[50%]'>
              <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
              <InViewTextEffect preset='fade-in-blur' per='char' speedReveal={4} speedSegment={1}>
                Seamlessly Integrate Your Preferred Applications
                </InViewTextEffect>
              </h4>
              <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-center font-normal text-neutral-300">
                <AnimateInView delay={0.5}>
              Easily connect across platforms, with features accessible on messaging apps and your e-commerce site, ensuring a consistent experience for your customers.
              </AnimateInView>
              </p>

              <motion.div
                className="absolute top-0 left-8"
                style={offset(0.02)}
              >
                <Image src="/logos/whatsapp.svg" alt="Slack" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute right-12 top-0"
                style={offset(0.015)}
              >
                <Image src="/logos/shopify.svg" alt="Shopify" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute -left-6 bottom-8"
                style={offset(0.03)}
              >
                <Image src="/logos/facebook.svg" alt="Microsoft Teams" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute -right-0 bottom-0"
                style={offset(0.02)}
              >
                <Image src="/logos/wordpress.svg" alt="Google Analytics" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute left-32 top-32"
                style={offset(0.017)}
              >
                <Image src="/logos/woocommerce.svg" alt="Asana" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute right-48 bottom-32"
                style={offset(0.025)}
              >
                <Image src="/logos/instagram.svg" alt="Docker" width={50} height={50} />
                
              </motion.div>
            </div>
          </section>
        

        
        <TestimonialSection />

        <PricingSection />

    </main>
  )
}