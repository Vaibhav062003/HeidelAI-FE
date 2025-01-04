'use client'

import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const router = useRouter();

    return(
        <nav className="fixed top-0 w-full backdrop-blur-sm bg-black/30 border-b border-neutral-800/50 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Link href="/" className='flex items-center space-x-2'>
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
                  </Link>
                </div>
              </div>
              <div className="block md:hidden lg:hidden">
              <div className="ml-10 flex items-baseline space-x-4">
                  
              <button className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium" onClick={() => router.push('/login')}>Login</button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#home" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Features
                  </a>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Pricing
                  </a>
              <button className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium" onClick={() => router.push('/login')}>Login</button>
                </div>
              </div>
            </div>
            
          </div>
        </nav>
    )
}

// {/* Hamburger Menu Button - Mobile Only */}
//             {/* <div className="absolute flex h-full justify-center items-center top-0 right-2 md:hidden">
//                 <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
//                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 </button>
//               </div> */}