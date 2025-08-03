'use client';
import Header from '@/components/LandingPage/Header'
import Footer from '@/components/LandingPage/Footer'

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <head>
        <title>Privacy Policy - HeidelAI</title>
        <meta name="description" content="HeidelAI's Privacy Policy details how we collect, use, and protect your personal information when using our AI-powered customer engagement platform." />
        <meta name="keywords" content="HeidelAI privacy policy, data protection, user privacy, personal information handling, privacy terms, customer data security" />
        <meta name="author" content="HeidelAI" />
        <link rel="icon" href="/heidelai.png" />
        <meta property="og:title" content="Privacy Policy - HeidelAI" />
        <meta property="og:description" content="Learn about how HeidelAI protects your privacy and handles your personal information." />
        <meta property="og:image" content="/heidelai_mockup.png" />
        <meta property="og:url" content="https://heidelai.com/privacy-policy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy - HeidelAI" />
        <meta name="twitter:description" content="Learn about how HeidelAI protects your privacy and handles your personal information." />
        <meta name="twitter:image" content="/heidelai_mockup.png" />
      </head>
    <body className="bg-black text-white">
      <Header />
      <main className="min-h-screen bg-zinc-950 text-white pt-16">
        {children}
      </main>
      <Footer />
    </body>
    </>
  )
}