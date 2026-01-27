'use client'
import Header from '@/components/LandingPage/Header';
import Hero3D from '@/components/LandingPage/Hero3D';
import Features from '@/components/LandingPage/Features';
import CustomerStories from '@/components/LandingPage/CustomerStories';
import Integrations from '@/components/LandingPage/Integrations';
import Pricing from '@/components/LandingPage/Pricing';
import Footer from '@/components/LandingPage/Footer';


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "HeidelAI - AI Sales & Support Engine",
            "description": "Unify every social platform with intelligent AI that handles operations and scales revenue.",
            "url": "https://heidelai.com",
            "inLanguage": "en-US",
            "isPartOf": { "@id": "https://heidelai.com/#website" }
          })
        }}
      />
      <Header />
      <Hero3D />
      <Features />
      <CustomerStories />
      <Integrations />
      <Pricing />
      <Footer />
    </div>
  )
}