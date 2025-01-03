'use client'

// import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FlipWords } from '@/components/ui/flip-words';
// import { TimelineDemo } from '@/components/TimelineDemo';
import { BentoGridThirdDemo } from '@/components/BentoGridDemo';
import { HoverBorderGradientDemo } from '@/components/HoverBorderGradientDemo';
import { motion } from 'framer-motion'
import { useState } from 'react'
import TestimonialSection from '@/components/TestimonialSection';
import PricingSection from '@/components/PricingSection';
// import PricingSection2 from '@/components/PricingSection2';



//const Hyperspeed = dynamic(() => import('@/components/Hyperspeed'), {
  // ssr:false,
  //loading: () => <div className="w-full h-full bg-black" />
//});

export default function Home() {

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const offset = (factor: number) => ({
    x: (mousePos.x - window.innerWidth / 2) * factor,
    y: (mousePos.y - window.innerHeight / 2) * factor,
  })


  const words = ["engage", "optimize", "predict", "innovate", "grow"];
  return (
    <main className="min-h-screen relative">
      {/* Hero Section */}
      <section className="h-screen relative flex flex-col mt-10 justify-center" id="home">
        {/* Hero Content */}
        <div className="flex flex-col items-center  relative z-10   mb-72">
          <div className="h-[40rem] flex flex-col text-center justify-center mt-10 items-center px-4">
            <div className="text-2xl lg:text-6xl lg:w-[75%] w-full lg:leading-tight leading-8 mb-5 lg:mb-10 mx-auto lg:font-medium font-semibold text-neutral-100">
            AI Solutions to Revolutionize Your Business
            </div>
            <div className='lg:text-xl text-base font-medium  lg:font-normal text-neutral-400 lg:mb-10 mb-5'>Empower your brand to
              <FlipWords words={words} /> <br />
              with AI-driven insights.
            </div>
          <HoverBorderGradientDemo />
          {/* <button className="chronicle-button ">
            <span>
              <em>Request Demo.</em>
            </span>
            <span>
              <em>Request Demo.</em>
            </span>
          </button> */}
          </div>
        </div>

        {/* Hyperspeed Background */}
        <div className="absolute bottom-0 h-[60vh] w-full">
          {/* <Hyperspeed /> */}
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-black my-6 lg:mt-12'>
        <BentoGridThirdDemo />
      </section>

     
      
      
        
          <section
            className='bg-black mt-10  lg:mt-20 h-[70vh] flex flex-col justify-center items-center'
            onMouseMove={handleMouseMove}
          >
            <div className='relative py-8 flex flex-col items-center w-[80vw] h-[50%]'>
              <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
                Seamlessly Integrate Your Preferred Applications
              </h4>
              <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-center font-normal text-neutral-300">
              Easily connect across platforms, with features accessible on messaging apps and your e-commerce site, ensuring a consistent experience for your customers.
              </p>

              <motion.div
                className="absolute top-0 left-8"
                style={offset(0.02)}
              >
                <Image src="/logos/whatsapp.svg" alt="Slack" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute right-12 top-0"
                style={offset(0.015)}
              >
                <Image src="/logos/shopify.svg" alt="Shopify" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute -left-6 bottom-8"
                style={offset(0.03)}
              >
                <Image src="/logos/facebook.svg" alt="Microsoft Teams" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute -right-0 bottom-0"
                style={offset(0.02)}
              >
                <Image src="/logos/wordpress.svg" alt="Google Analytics" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute left-32 top-32"
                style={offset(0.017)}
              >
                <Image src="/logos/woocommerce.svg" alt="Asana" width={50} height={50} />
              </motion.div>

              <motion.div
                className="absolute right-48 bottom-32"
                style={offset(0.025)}
              >
                <Image src="/logos/instagram.svg" alt="Docker" width={50} height={50} />
              </motion.div>
            </div>
          </section>
        

        
        <TestimonialSection />

        <PricingSection />

        {/* <PricingSection2 /> */}

          {/* <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2
            className=" text-5xl text-center font-medium text-white mb-4"
          >
            Our pricing plans
          </h2>
          <p className="text-neutral-300 text-xl text-center leading-6 mb-12">
            7 Days free trial. No credit card required.
          </p>
          <div className="mb-10 flex justify-center">
            <span className="flex items-center">
              <svg
                className="w-16 h-11"
                viewBox="0 0 65 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M42.0964 4.02732C39.5251 4.74637 37.1135 5.87152 34.9795 7.36979C34.0529 8.02188 33.2561 8.68389 32.5982 9.38799C32.5386 9.38153 32.482 9.38579 32.4118 9.38233C30.1332 9.37225 27.711 10.2114 25.0194 11.9465C20.4292 14.906 16.7212 19.2023 14.2904 24.3897C12.0636 29.1502 11.0911 34.265 11.4596 39.2591L7.6368 36.04L6.83225 37.0047L12.587 41.8449L16.9956 35.7576L15.9819 35.024L13.1146 38.9812C12.4253 28.9566 17.4523 18.8014 25.9225 13.3583C27.861 12.1112 29.6087 11.3798 31.2299 11.146C30.6487 12.083 30.2872 13.0624 30.1426 14.0738C29.9087 15.7573 30.5083 17.6123 31.7101 18.8943C32.6977 19.9474 33.9541 20.4744 35.2551 20.3764C36.5669 20.2755 37.7738 19.5103 38.5629 18.2841C39.4661 16.8873 39.6838 15.1043 39.1492 13.6472C38.4686 11.7917 36.7603 10.3508 34.6701 9.73325C35.0524 9.40674 35.4806 9.07896 35.9331 8.75591C42.0235 4.51004 50.3771 3.60724 57.2293 6.46459L57.8719 4.92101C54.237 3.40628 50.175 2.84314 46.1137 3.2738C44.7513 3.40049 43.4035 3.6618 42.0964 4.02732ZM37.5828 14.2008C37.9503 15.1845 37.7787 16.3883 37.1605 17.3586C36.9123 17.7517 36.3954 18.3817 35.5811 18.6094C35.4419 18.6483 35.2889 18.6795 35.1406 18.6863C34.3594 18.743 33.5726 18.4082 32.933 17.7318C32.0791 16.8263 31.6418 15.4691 31.8087 14.2898C31.9645 13.1944 32.4639 12.1301 33.2993 11.1106C35.286 11.3987 36.9819 12.5889 37.5828 14.2008Z"
                  fill="#9CA3AF"
                />
              </svg>

              <span
                className="inline-block whitespace-nowrap text-xs leading-4 font-semibold tracking-wide bg-indigo-50 text-indigo-600 rounded-full py-2 px-4"
                >Save 20%</span
              >
            </span>
          </div>
          <div className="tabs">
            <div
              className="flex justify-center items-center bg-gray-100 rounded-full p-1.5 max-w-sm mx-auto"
            >
              <a
                href="javascript:void(0)"
                className="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-gray-400 font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap active"
                data-tab="tabs-with-background-1"
                role="tab"
              >
                Bill Yearly
              </a>
              <a
                href="javascript:void(0)"
                className="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-gray-400 font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap"
                data-tab="tabs-with-background-2"
                role="tab"
              >
                Bill Monthly
              </a>
            </div>

            <div
              id="tabs-with-background-1"
              role="tabpanel"
              aria-labelledby="tabs-with-background-item-1"
              className="tabcontent mt-12"
            >
              <div
                className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0"
              >
                <div
                  className="group relative flex flex-col mx-auto w-full max-w-sm text-gray-900 rounded-2xl border border-solid border-neutral-600 text-center transition-all duration-300 p-6 xl:p-12 hover:border-indigo-600"
                >
                  <h3 className=" text-2xl text-white font-bold mb-6">Free</h3>
                  <div className="mb-20 flex flex-col">
                    <span className=" text-6xl text-white font-semibold mb-2"
                      >$0</span
                    >
                    <span className="text-xl text-gray-400">Lifetime</span>
                  </div>
                  <a
                    href="javascript:;"
                    className="py-2.5 px-5 bg-indigo-50 shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto group-hover:bg-indigo-600 group-hover:text-white"
                    >Purchase Plan</a
                  >
                </div>
                <div
                  className="group relative flex flex-col mx-auto w-full max-w-sm text-gray-900 rounded-2xl border border-solid border-neutral-600 text-center transition-all duration-500 p-6 xl:p-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:before:opacity-100 before:contents[' '] before:absolute before:bg-indigo-800 before:w-full before:h-full before:top-0 before:left-0 before:rounded-2xl before:opacity-0 before:transition-all before:duration-500 before:z-0"
                >
                  <h3
                    className="relative flex items-center justify-center font-manrope text-2xl font-bold mb-6 text-white"
                  >
                    Advanced
                    <span
                      className="h-6 px-3 relative rounded-full border border-solid border-gray-100 text-sm ml-4"
                      >Popular</span
                    >
                  </h3>
                  <div className="mb-20 flex flex-col relative">
                    <span
                      className="font-manrope text-6xl font-semibold mb-2 text-white"
                      >$150</span
                    >
                    <span className="text-xl text-gray-300">Per year</span>
                  </div>
                  <a
                    href="javascript:;"
                    className="relative py-2.5 px-5 bg-white shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto"
                    >Purchase Plan</a
                  >
                </div>
                <div
                  className="group relative flex flex-col mx-auto w-full max-w-sm text-gray-900 rounded-2xl border border-solid border-neutral-600 text-center transition-all duration-300 p-8 xl:p-12 hover:border-indigo-600"
                >
                  <h3 className="text-white text-2xl font-bold mb-6">Team</h3>
                  <div className="mb-20 flex flex-col">
                    <span className="text-white text-6xl font-semibold mb-2"
                      >$180</span
                    >
                    <span className="text-xl text-gray-400">Per year</span>
                  </div>
                  <a
                    href="javascript:;"
                    className="py-2.5 px-5 bg-indigo-50 shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto group-hover:bg-indigo-600 group-hover:text-white"
                    >Purchase Plan</a
                  >
                </div>
              </div>
            </div>
            <div
              id="tabs-with-background-2"
              className="tabcontent mt-12"
              role="tabpanel"
              aria-labelledby="tabs-with-background-item-2"
              style={{display: "none"}}
            >
              <div
                className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0"
              >
                <div
                  className="group relative flex flex-col mx-auto w-full max-w-sm text-white rounded-2xl border border-solid border-neutral-600 text-center transition-all duration-300 p-6 xl:p-12 hover:border-indigo-600"
                >
                  <h3 className="font-manrope text-2xl font-bold mb-6">Free</h3>
                  <div className="mb-20 flex flex-col">
                    <span className="font-manrope text-6xl font-semibold mb-2"
                      >$0</span
                    >
                    <span className="text-xl text-gray-400">Lifetime</span>
                  </div>
                  <a
                    href="javascript:;"
                    className="py-2.5 px-5 bg-indigo-50 shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto group-hover:bg-indigo-600 group-hover:text-white"
                    >Purchase Plan</a
                  >
                </div>
                <div
                  className="group relative flex flex-col mx-auto w-full max-w-sm text-white rounded-2xl border border-solid border-neutral-600 text-center transition-all duration-500 p-6 xl:p-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:before:opacity-100 before:contents[' '] before:absolute before:bg-indigo-800 before:w-full before:h-full before:top-0 before:left-0 before:rounded-2xl before:opacity-0 before:transition-all before:duration-500 before:z-0"
                >
                  <h3
                    className="relative flex items-center justify-center font-manrope text-2xl font-bold mb-6 text-white"
                  >
                    Advanced
                    <span
                      className="h-6 px-3 relative rounded-full border border-solid border-gray-100 text-sm ml-4"
                      >Popular</span
                    >
                  </h3>
                  <div className="mb-20 flex flex-col relative">
                    <span
                      className="font-manrope text-6xl font-semibold mb-2 text-white"
                      >$39</span
                    >
                    <span className="text-xl text-gray-300">Per Month</span>
                  </div>
                  <a
                    href="javascript:;"
                    className="relative py-2.5 px-5 bg-white shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto"
                    >Purchase Plan</a
                  >
                </div>
                <div
                  className="group relative flex flex-col mx-auto w-full max-w-sm text-white rounded-2xl border border-solid border-neutral-600 text-center transition-all duration-300 p-8 xl:p-12 hover:border-indigo-600"
                >
                  <h3 className="font-manrope text-2xl font-bold mb-6">Team</h3>
                  <div className="mb-20 flex flex-col">
                    <span className="font-manrope text-6xl font-semibold mb-2"
                      >$49</span
                    >
                    <span className="text-xl text-gray-400">Per Month</span>
                  </div>
                  <a
                    href="javascript:;"
                    className="py-2.5 px-5 bg-indigo-50 shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto group-hover:bg-indigo-600 group-hover:text-white"
                    >Purchase Plan</a
                  >
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section> */}
                                            
      

      {/* Timeline Section
      <section className='bg-black mt-6 lg:mt-12'>
        <TimelineDemo />
      </section> */}
    </main>
  )
}