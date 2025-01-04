'use client'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'



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
      <body className={`${inter.className} bg-black text-white`} suppressHydrationWarning>
        {/* Navbar */}
        {<Navbar />}
        
        <main>{children}</main>
        
        {<Footer />}
                                            
                                            
      </body>
    </html>
  )
}