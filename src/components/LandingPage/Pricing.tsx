import React from 'react';
import { PricingSection } from '@/components/LandingPage/ui/pricing-section';

const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const TIERS = [
	{
		id: "basic",
		name: "Basic",
		price: {
			monthly: 50,
			yearly: 40,
		},
		description: "Perfect for small businesses getting started",
		features: [
			"AI Texts - 2,500",
			"WhatsApp Credits - €7",
			"AI Voice bot - None",
			"Admin Users - 1",
			"Analytics Dashboard",
			"Email Support"
		],
		cta: "Get Started",
	},
	{
		id: "standard",
		name: "Standard",
		price: {
			monthly: 100,
			yearly: 80,
		},
		description: "Great for growing businesses",
		features: [
			"AI Texts - 10,000",
			"WhatsApp Credits - €15",
			"Analytics Requests - 300",
			"AI Voice bot - None",
			"Admin Users - 1",
			"Priority Support",
			"Advanced Analytics",
			"Multi-platform Integration"
		],
		cta: "Get Started",
		popular: true,
	},
	{
		id: "professional",
		name: "Professional",
		price: {
			monthly: 400,
			yearly: 320,
		},
		description: "For large businesses with advanced needs",
		features: [
			"AI Texts - 55,000",
			"WhatsApp Credits - €55",
			"Analytics Requests - 1,200",
			"AI Voice bot - 300 mins",
			"Admin Users - 2",
			"24/7 Priority Support",
			"Custom Integrations",
			"Advanced AI Features",
			"Dedicated Account Manager"
		],
		cta: "Get Started",
	}
];

const Pricing = () => {
	return (
		<section id="pricing" className="py-20 bg-gray-50 relative">
			{/* Grid Background - Wrapping the entire section */}
			{/* <div className="absolute inset-0 -z-10">
				<div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
			</div> */}

			<div className="max-w-7xl mx-auto -mt-4 px-4 sm:px-6 lg:px-8">
				<div className="relative flex justify-center items-center w-full">
					<PricingSection
						title="Affordable Pricing For Everyone"
						subtitle="Experience the full potential with our flexible plans. No hidden fees. No commitments!"
						frequencies={PAYMENT_FREQUENCIES}
						tiers={TIERS}
					/>
				</div>

				<div className="text-center mt-12 mb-6">
					<p className="text-md font-medium text-muted-foreground mb-6 sm:text-lg">All plans include 14-day free trial</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-muted-foreground">
						<span className="flex items-center">
							<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
							No setup fees
						</span>
						<span className="flex items-center">
							<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
							Cancel anytime
						</span>
						<span className="flex items-center">
							<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
							24/7 support
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Pricing;