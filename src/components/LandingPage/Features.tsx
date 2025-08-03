import Image from 'next/image';
import React from 'react';

const Features = () => {
  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent touch and hold on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
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
            <img 
              src="/features-optimized.webp" 
              className="h-full max-w-full select-none pointer-events-none" 
              alt="Features overview" 
              loading="lazy"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
              draggable={false}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
                // WebkitUserDrag: 'none',
                KhtmlUserSelect: 'none'
              }}
            />
          </span>
          <span className='block sm:hidden'>
            <img 
              src="/features-mobile-optimized.webp" 
              className="h-full max-w-full select-none pointer-events-none" 
              alt="Features overview" 
              loading="lazy"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
              draggable={false}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
                // WebkitUserDrag: 'none',
                KhtmlUserSelect: 'none'
              }}
            />
            <img 
              src="/features-mobile-optimized2.webp" 
              className="h-full max-w-full select-none pointer-events-none" 
              alt="Features overview" 
              loading="lazy"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
              draggable={false}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
                // WebkitUserDrag: 'none',
                KhtmlUserSelect: 'none'
              }}
            />
          </span>
        </div>
      </div>
    </section>
  );
};

export default Features;