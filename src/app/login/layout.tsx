import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <body className={` bg-black text-white`}>
      <Navbar />
      {children}
      <Footer />
      
      </body>
    </>
  )
}