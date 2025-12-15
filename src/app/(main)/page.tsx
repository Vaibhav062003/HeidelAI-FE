'use client'
import Header from '@/components/LandingPage/Header';
import Hero3D from '@/components/LandingPage/Hero3D';
import Features from '@/components/LandingPage/Features';
import Integrations from '@/components/LandingPage/Integrations';
// import TestimonialsMarquee from '@/components/LandingPage/TestimonialsMarquee';
import Pricing from '@/components/LandingPage/Pricing';
import CTA from '@/components/LandingPage/CTA';
import Footer from '@/components/LandingPage/Footer';

export default function Home() {

  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero3D />
      <Features />
      <Integrations />
      {/* <TestimonialsMarquee /> */}
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}