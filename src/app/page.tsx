'use client'

// import { motion } from 'framer-motion'
// import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FlipWords } from '@/components/ui/flip-words';
import { TimelineDemo } from '@/components/TimelineDemo';
import { FeaturesSectionDemo } from '@/components/FeaturesSectionDemo';

const Hyperspeed = dynamic(() => import('@/components/Hyperspeed'), {
  // ssr:false,
  loading: () => <div className="w-full h-full bg-black" />
});

export default function Home() {

  const words = ["engage", "optimize", "predict", "innovate", "grow"];
  return (
    <main className="min-h-screen relative">
      {/* Hero Section */}
      <section className="h-screen relative flex flex-col mt-10 justify-center">
        {/* Hero Content */}
        <div className="flex flex-col items-center  relative z-10   mb-72">
          <div className="h-[40rem] flex flex-col text-center justify-center mt-10 items-center px-4">
            <div className="text-2xl lg:text-6xl lg:w-[75%] w-full lg:leading-tight leading-8 mb-5 lg:mb-10 mx-auto lg:font-normal font-semibold text-neutral-100">
            AI Solutions to Revolutionize Your Business
            </div>
            <div className='lg:text-xl text-base font-medium  lg:font-normal text-neutral-400 lg:mb-10 mb-5'>Empower your brand to
              <FlipWords words={words} /> <br />
              with AI-driven insights.
            </div>
          <button className="chronicle-button ">
            <span>
              <em>Request Demo.</em>
            </span>
            <span>
              <em>Request Demo.</em>
            </span>
          </button>
          </div>
        </div>

        {/* Hyperspeed Background */}
        <div className="absolute bottom-0 h-[60vh] w-full">
          <Hyperspeed />
        </div>
      </section>

      <section className='bg-[#0A0A0A] mt-6 lg:mt-12'>
        <FeaturesSectionDemo />
      </section>
      <section className='bg-black mt-6 lg:mt-12'>
        <TimelineDemo />
      </section>
    </main>
  )
}