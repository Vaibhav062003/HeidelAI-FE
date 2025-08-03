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
        <title>Terms of Service - HeidelAI</title>
        <meta name="description" content="HeidelAI's Terms of Service outline the rules, guidelines, and agreements for using our AI-powered customer engagement and analytics platform." />
        <meta name="keywords" content="HeidelAI terms of service, user agreement, service terms, legal terms, platform usage terms, business terms and conditions" />
        <meta name="author" content="HeidelAI" />
        <link rel="icon" href="/heidelai.png" />
        <meta property="og:title" content="Terms of Service - HeidelAI" />
        <meta property="og:description" content="Read HeidelAI's Terms of Service to understand your rights and responsibilities when using our platform." />
        <meta property="og:image" content="/heidelai_mockup.png" />
        <meta property="og:url" content="https://heidelai.com/terms-of-service" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service - HeidelAI" />
        <meta name="twitter:description" content="Read HeidelAI's Terms of Service to understand your rights and responsibilities when using our platform." />
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