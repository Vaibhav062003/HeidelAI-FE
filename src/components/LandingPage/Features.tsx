import Image from 'next/image';
import React from 'react';

const Features = () => {
  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 px-4 mb-8 sm:gap-8 text-center">
          <h2 className="max-w-[800px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            Packed with thousands of features
          </h2>
          <p className="text-md max-w-[700px] font-medium text-muted-foreground sm:text-xl">
            <span className="block sm:hidden">
              From smart chatbots to lead targeting, everything your business needs to grow.
            </span>
            <span className="hidden sm:block">
              From AI-powered chatbots to intelligent lead targeting, our platform provides solutions for everything your business needs to thrive.
            </span>
          </p>
        </div>

        <div className="flex justify-center items-center">
          <span className='hidden sm:block'>
            <Image
              src="/features-optimized.webp"
              className="h-auto w-full max-w-full select-none pointer-events-none"
              alt="Features overview"
              width={1200}
              height={800}
              priority
              onContextMenu={handleContextMenu}
              draggable={false}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
                KhtmlUserSelect: 'none'
              }}
            />
          </span>
          <span className='block sm:hidden'>
            <div className="flex flex-col gap-4">
              <Image
                src="/features-mobile-optimized.webp"
                className="h-auto w-full max-w-full select-none pointer-events-none"
                alt="Features overview"
                width={400}
                height={600}
                priority
                onContextMenu={handleContextMenu}
                draggable={false}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  KhtmlUserSelect: 'none'
                }}
              />
              <Image
                src="/features-mobile-optimized2.webp"
                className="h-auto w-full max-w-full select-none pointer-events-none"
                alt="Features overview"
                width={400}
                height={600}
                onContextMenu={handleContextMenu}
                draggable={false}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  KhtmlUserSelect: 'none'
                }}
              />
            </div>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Features;