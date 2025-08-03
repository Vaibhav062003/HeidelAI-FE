"use client";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
  
    <head>
        <title>HeidelAI - AI-Powered Customer Engagement & Analytics Platform</title>
        <meta name="description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta name="keywords" content="AI customer engagement tools, real-time business analytics, AI chatbots for businesses, ads optimization platform, influencer marketing analytics, WhatsApp chatbots, Telegram chatbots, conversation analytics tools, business growth with AI insights" />
        <meta name="author" content="HeidelAI" />
        <link rel="icon" href="/heidelai.png" />
        <meta property="og:title" content="HeidelAI - AI-Powered Customer Engagement & Analytics Platform" />
        <meta property="og:description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta property="og:image" content="/heidelai_mockup.png" />
        <meta property="og:url" content="https://heidelai.com" />
        <meta name="twitter:card" content="/heidelai_mockup.png" />
        <meta name="twitter:title" content="HeidelAI - AI-Powered Customer Engagement & Analytics Platform" />
        <meta name="twitter:description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta name="twitter:image" content="/heidelai_mockup.png" />
      </head>
      {children}
    </>
  )
}