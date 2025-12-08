import type { Metadata } from 'next'
import "./globals.css"
import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'
import { AuthProvider } from '@/contexts/AuthContext'
import { LogoutHandler } from '@/components/LogoutHandler'
import { RoleProvider } from '@/contexts/RoleContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap' // Add for better font loading
})

export const metadata: Metadata = {
  metadataBase: new URL('https://heidelai.com'),
  title: {
    default: 'HeidelAI - AI-Powered Customer Engagement & Analytics Platform',
    template: '%s | HeidelAI'
  },
  description: 'Transform your business with HeidelAI\'s AI-powered tools for customer engagement, real-time analytics, and smart chatbots.',
  keywords: [
    'AI customer engagement tools',
    'real-time business analytics',
    'AI chatbots for businesses',
    'ads optimization platform',
    'influencer marketing analytics',
    'WhatsApp chatbots',
    'Telegram chatbots',
    'conversation analytics tools',
    'business growth with AI insights'
  ],
  authors: [{ name: 'HeidelAI' }],
  icons: {
    icon: '/heidelai.png',
  },
  openGraph: {
    title: 'HeidelAI - AI-Powered Customer Engagement & Analytics Platform',
    description: 'Transform your business with HeidelAI\'s AI-powered tools for customer engagement, real-time analytics, and smart chatbots.',
    images: ['/heidelai_mockup.png'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeidelAI - AI-Powered Customer Engagement & Analytics Platform',
    description: 'Transform your business with HeidelAI\'s AI-powered tools for customer engagement, real-time analytics, and smart chatbots.',
    images: ['/heidelai_mockup.png']
  },
  // Add viewport for better mobile responsiveness
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={`bg-white text-black`}>

        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!} afterSignOutUrl="/">
          <AuthProvider>
          <LogoutHandler />
          <RoleProvider>
            {children}
          </RoleProvider>
          </AuthProvider>
        </ClerkProvider>

      </body>
    </html>
  )
}