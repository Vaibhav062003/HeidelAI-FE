'use client';
import Header from '@/components/LandingPage/Header'
import Footer from '@/components/LandingPage/Footer'

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <head>
        <title>About Us - HeidelAI</title>
        <meta name="description" content="Learn more about HeidelAI, our mission, and the team behind our AI-powered customer engagement and analytics platform." />
        <meta name="keywords" content="HeidelAI about us, company information, team, mission, AI-powered platform" />
        <meta name="author" content="HeidelAI" />
        <link rel="icon" href="/heidelai.png" />
        <meta property="og:title" content="About Us - HeidelAI" />
        <meta property="og:description" content="Learn more about HeidelAI, our mission, and the team behind our AI-powered customer engagement and analytics platform." />
        <meta property="og:image" content="/heidelai_mockup.png" />
        <meta property="og:url" content="https://heidelai.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us - HeidelAI" />
        <meta name="twitter:description" content="Learn more about HeidelAI, our mission, and the team behind our AI-powered customer engagement and analytics platform." />
        <meta name="twitter:image" content="/heidelai_mockup.png" />
      </head>
    <body className="bg-black text-white">
      <Header />
      <main className="min-h-screen  bg-zinc-950 text-white pt-16">
        {children}
      </main>
      <Footer />
    </body>
    </>
  )
}