import React from 'react';


const Integrations = () => {
  const platforms = [
    {
      name: "WhatsApp",
      logo: "/logos/whatsapp.png",
      category: "Messaging"
    },
    {
      name: "Instagram",
      logo: "/logos/instagram.webp",
      category: "Social Media"
    },
    {
      name: "Facebook",
      logo: "/logos/facebook.png",
      category: "Social Media"
    },
    {
      name: "Telegram",
      logo: "/logos/telegram.webp",
      category: "Messaging"
    },
    {
      name: "Shopify",
      logo: "/logos/shopify.webp",
      category: "E-commerce"
    },
    {
      name: "WooCommerce",
      logo: "/logos/woocommerce.png",
      category: "E-commerce"
    },
    // {
    //   name: "Slack",
    //   logo: "/logos/slack.svg",
    //   category: "Communication"
    // },
    // {
    //   name: "Discord",
    //   logo: "/logos/discord.svg",
    //   category: "Communication"
    // },
    // {
    //   name: "BigCommerce",
    //   logo: "/logos/bigcommerce.svg",
    //   category: "E-commerce"
    // },
    // {
    //   name: "Magento",
    //   logo: "/logos/magento.svg",
    //   category: "E-commerce"
    // },
    // {
    //   name: "Zapier",
    //   logo: "/logos/zapier.svg",
    //   category: "Automation"
    // },
    // {
    //   name: "HubSpot",
    //   logo: "/logos/hubspot.svg",
    //   category: "CRM"
    // }
  ];

  return (
    <section id="integrations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 px-4 mb-8 sm:mb-8 sm:gap-8 text-center">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            Seamlessly Integrate Your Preferred Apps
          </h2>
          <p className="text-md max-w-[800px] sm:mb-8 font-medium text-muted-foreground sm:text-xl">
            <span className="block sm:hidden">
              Connect all your platforms in one place for a seamless customer experience.
            </span>
            <span className="hidden sm:block">
              Easily connect across platforms, with features accessible on messaging apps and your e-commerce site, 
              ensuring a consistent experience for your customers.
            </span>
          </p>
        </div>

        {/* Platform Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6   items-center justify-items-center">
          {platforms.map((platform, index) => (
            <div 
              key={platform.name}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl  transition-all duration-300 hover:scale-105 w-full aspect-square"
            >
              <img
                src={platform.logo}
                alt={`${platform.name} logo`}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
                
              />
              <h3 className="text-sm font-medium text-gray-900  transition-colors duration-300">
                {platform.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {platform.category}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mb-8 mt-16">
          <p className="text-sm sm:text-lg font-medium text-gray-700 mb-6">
            Can&apos;t find your platform? We&apos;re constantly adding new integrations.
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg">
            Request Integration
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Integrations;