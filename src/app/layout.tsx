'use client'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Head from "next/head";


const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Heidel AI - Transform Your Business with AI',
//   description: 'Leading AI solutions for modern businesses',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <Head>
        <title>HeidelAI - AI-Powered Customer Engagement & Analytics Platform</title>
        <meta name="description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta name="keywords" content="AI customer engagement tools, real-time business analytics, AI chatbots for businesses, ads optimization platform, influencer marketing analytics, WhatsApp chatbots, Telegram chatbots, conversation analytics tools, business growth with AI insights" />
        <meta name="author" content="HeidelAI" />
        <link rel="icon" href="/HeidelAi Favicon.ico.ico" />
        <meta property="og:title" content="HeidelAI - AI-Powered Customer Engagement & Analytics Platform" />
        <meta property="og:description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta property="og:image" content="/heidelai_mockup.png" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="/heidelai_mockup.png" />
        <meta name="twitter:title" content="HeidelAI - AI-Powered Customer Engagement & Analytics Platform" />
        <meta name="twitter:description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta name="twitter:image" content="/heidelai_mockup.png" />
      </Head>
      <body className={`${inter.className} bg-black text-white`} suppressHydrationWarning>
        {/* Navbar */}
        {<Navbar />}
        
        <main>{children}</main>
        
        {<Footer />}
                                            
                                            
      </body>
    </html>
  )
}