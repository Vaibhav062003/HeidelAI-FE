import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heidel AI - Transform Your Business with AI',
  description: 'Leading AI solutions for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0A0A0A] text-white`} suppressHydrationWarning>
        {/* Navbar */}
        <nav className="fixed top-0 w-full backdrop-blur-sm bg-black/30 border-b border-neutral-800/50 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/HeidelAi Favicon svg.svg" 
                    alt="Heidel AI Logo" 
                    width={32}
                    height={32}
                    className="h-8 w-8" 
                  />
                  <span className="text-xl font-normal  text-white">
                    Heidel AI
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Contact
                  </a>
                </div>
              </div>
            </div>
            {/* Hamburger Menu Button - Mobile Only */}
            <div className="absolute flex h-full justify-center items-center top-0 right-2 md:hidden">
                <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
          </div>
        </nav>
        
        {children}
        <footer className="bg-[#111111] border-t border-[#222222] py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center">
              <div className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Heidel AI
              </div>
              <div suppressHydrationWarning>
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Heidel AI. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}