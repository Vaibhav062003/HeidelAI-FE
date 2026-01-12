import type { Metadata } from 'next'
import "./globals.css"
import { Inter, Instrument_Serif } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'
import { AuthProvider } from '@/contexts/AuthContext'
import { LogoutHandler } from '@/components/LogoutHandler'
import { RoleProvider } from '@/contexts/RoleContext'
import { Toaster } from 'sonner'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-instrument-serif',
  display: 'swap'
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
      <body className={`${inter.variable} ${instrumentSerif.variable} antialiased bg-white text-black font-sans`}>
        <Toaster position="top-right" richColors />

        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!} afterSignOutUrl="/">
          <AuthProvider>
            <LogoutHandler />
            <RoleProvider>
              {children}
              <Script id="clarity-script" strategy="afterInteractive">
                {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
              </Script>
            </RoleProvider>
          </AuthProvider>
        </ClerkProvider>

      </body>
    </html>
  )
}