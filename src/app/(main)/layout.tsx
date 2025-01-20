import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './main.css'

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
        <link rel="icon" href="/HeidelAi Favicon.ico.ico" />
        <meta property="og:title" content="HeidelAI - AI-Powered Customer Engagement & Analytics Platform" />
        <meta property="og:description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta property="og:image" content="/heidelai_mockup.png" />
        <meta property="og:url" content="https://heidelai.com" />
        <meta name="twitter:card" content="/heidelai_mockup.png" />
        <meta name="twitter:title" content="HeidelAI - AI-Powered Customer Engagement & Analytics Platform" />
        <meta name="twitter:description" content="Transform your business with HeidelAI's AI-powered tools for customer engagement, real-time analytics, and smart chatbots." />
        <meta name="twitter:image" content="/heidelai_mockup.png" />
      </head>
    <body className={` bg-black text-white`}>
      <div className="h-[100vh] w-full absolute top-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="hidden lg:block md:block w-full h-full object-cover"
          src="/desktop.mp4"
        ></video>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full lg:hidden md:hidden h-full object-cover"
          src="/mobile.mp4"
        ></video>
      </div>
      <Navbar />
      {/* <div style={{ height: "100vh", width: "100vw", position: "absolute", top: 0, zIndex: 10000000 }}>
            <iframe
              src="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.8&cAzimuthAngle=270&cDistance=0.5&cPolarAngle=180&cameraZoom=15.1&color1=%234474e7&color2=%23a955f7&color3=%23e649a0&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=env&pixelDensity=1&positionX=-0.1&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.2&rotationX=0&rotationY=130&rotationZ=70&shader=defaults&type=sphere&uAmplitude=3&uDensity=7&uFrequency=5.5&uSpeed=0.3&uStrength=0&uTime=0&wireframe=false"
              style={{
                border: "none",
                height: "100%",
                width: "100%",
                top: 0
              }}
              title="Shader Gradient"
            />
          </div> */}
         
      {children}
      <Footer />
      
      </body>
    </>
  )
}