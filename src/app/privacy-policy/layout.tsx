import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
        <link rel="icon" href="/HeidelAi Favicon.ico.ico" />
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
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </body>
    </>
  )
}