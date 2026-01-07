import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/LandingPage/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
// import { SignUp } from '@/components/LandingPage/ui/signup-button';
import { ScheduleDemo } from '@/components/LandingPage/ui/schedule-demo';
import { useRouter } from 'next/navigation';
// import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
// import { Drawer } from 'vaul';
// import { useState, useRef, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { Input } from "@/components/ui/input2";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { supabase } from "@/components/supabase/client";
// import { useToast } from "@/components/hooks/use-toast";
// import { systemPrompt } from "@/components/config/chatSystemPrompt";
// import { Message, storeMessage } from "@/components/services/chatService";
// import ReactMarkdown from "react-markdown";
// import {
//  Toaster, 
// toast as sonnerToast } from 'sonner'
import Image from 'next/image';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

const menuItems = [
	{ name: 'Features', href: '#features' },
	{ name: 'Integrations', href: '#integrations' },
	// { name: 'Reviews', href: '#testimonials' },
	{ name: 'Pricing', href: '#pricing' },
];

const Header = () => {
	const [menuState, setMenuState] = React.useState(false);
	const [isScrolled, setIsScrolled] = React.useState(false);
	const [currentSection, setCurrentSection] = React.useState('hero');

	React.useEffect(() => {
		// Add smooth scroll behavior to html element
		document.documentElement.style.scrollBehavior = 'smooth';

		const handleScroll = () => {
			const scrollY = window.scrollY;
			setIsScrolled(scrollY > 50);

			// Define section boundaries - cast to HTMLElement
			const heroSection = document.getElementById('home') as HTMLElement;
			const featuresSection = document.getElementById('features') as HTMLElement;
			const integrationsSection = document.getElementById('integrations') as HTMLElement;
			const testimonialsSection = document.getElementById('testimonials') as HTMLElement;
			const pricingSection = document.getElementById('pricing') as HTMLElement;
			const ctaSection = document.querySelector('[data-section="cta"]') as HTMLElement;

			// Calculate section positions
			const heroHeight = heroSection?.offsetHeight || 0;
			const featuresTop = featuresSection?.offsetTop || 0;
			const integrationsTop = integrationsSection?.offsetTop || 0;
			const testimonialsTop = testimonialsSection?.offsetTop || 0;
			const pricingTop = pricingSection?.offsetTop || 0;
			const ctaTop = ctaSection?.offsetTop || 0;

			// Determine current section with buffer zones
			const buffer = 100;

			if (scrollY < heroHeight - buffer) {
				setCurrentSection('hero');
			} else if (scrollY >= featuresTop - buffer && scrollY < integrationsTop - buffer) {
				setCurrentSection('features');
			} else if (scrollY >= integrationsTop - buffer && scrollY < testimonialsTop - buffer) {
				setCurrentSection('integrations');
			} else if (scrollY >= testimonialsTop - buffer && scrollY < pricingTop - buffer) {
				setCurrentSection('testimonials');
			} else if (scrollY >= pricingTop - buffer && scrollY < ctaTop - buffer) {
				setCurrentSection('pricing');
			} else if (scrollY >= ctaTop - buffer) {
				setCurrentSection('cta');
			} else {
				setCurrentSection('light');
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial call

		return () => {
			window.removeEventListener('scroll', handleScroll);
			// Reset scroll behavior when component unmounts
			document.documentElement.style.scrollBehavior = 'auto';
		};
	}, []);

	// Handle smooth scroll navigation
	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault();
		const targetElement = document.querySelector(href);
		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
		// Close mobile menu after clicking
		setMenuState(false);
	};

	// Determine if we should use dark theme
	const isDarkTheme = currentSection === 'hero' || currentSection === 'cta';


	//   const [isOpen, setIsOpen] = React.useState(false);


	//   const [userName, setUserName] = useState('');
	//   const [userEmail, setUserEmail] = useState('');
	//   const [userPhone, setUserPhone] = useState('');
	//   const [companyName, setCompanyName] = useState('');

	//   const handleDemoRequest = async (e: React.FormEvent) => {
	// 	e.preventDefault();

	// 	// Basic validation checks
	// 	if (!userName.trim() || !userEmail.trim() || !userPhone.trim() || !companyName.trim()) {
	// 	  sonnerToast.error('Please fill all the details.');
	// 	  return;
	// 	}

	// 	// Email validation
	// 	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// 	if (!emailRegex.test(userEmail.trim())) {
	// 	  sonnerToast.error('Please enter a valid email address.');
	// 	  return;
	// 	}

	// 	// Phone number validation (basic check for digits and common formats)
	// 	const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
	// 	const cleanedPhone = userPhone.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses

	// 	if (!phoneRegex.test(cleanedPhone) || cleanedPhone.length < 8) {
	// 	  sonnerToast.error('Please enter a valid phone number (minimum 8 digits).');
	// 	  return;
	// 	}

	// 	// Create form data to match Google Form's expected format
	// 	const formData = new FormData();
	// 	formData.append('entry.545040562', userName.trim());       // Name
	// 	formData.append('entry.1231199003', userEmail.trim());     // Email
	// 	formData.append('entry.1154213412', cleanedPhone);         // Phone (cleaned)
	// 	formData.append('entry.1081121699', companyName.trim());   // Company

	// 	try {
	// 	  await fetch("https://docs.google.com/forms/d/e/1FAIpQLSdB_mtDsubutUM_y1draxzdbfzcsqcIz9Ok_hTwPayBukJPNg/formResponse", {
	// 		method: 'POST',
	// 		mode: 'no-cors',  // Required to bypass CORS errors
	// 		body: formData,
	// 	  });

	// 	  sonnerToast.success('Request received! We will contact you shortly.');

	// 	  // Clear the form after successful submission
	// 	  setUserName('');
	// 	  setUserEmail('');
	// 	  setUserPhone('');
	// 	  setCompanyName('');

	// 	  // Close the drawer after successful submission
	// 	  setIsOpen(false);
	// 	} catch (error) {
	// 	  sonnerToast.error('Failed to submit the form. Please try again.');
	// 	  console.error('Error:', error);
	// 	}
	//   };

	const router = useRouter();
	//   const [messages, setMessages] = useState<Message[]>([]);
	//   const [input, setInput] = useState('');
	//   const [isLoading, setIsLoading] = useState(false);
	//   const [visitorName, setVisitorName] = useState<string | null>(null);
	//   const [visitorCompany, setVisitorCompany] = useState<string | null>(null);
	//   const [sessionId, setSessionId] = useState<string | null>(null);
	//   const [isInitializing, setIsInitializing] = useState(true);
	//   const scrollAreaRef = useRef<HTMLDivElement>(null);
	//   const { toast } = useToast();

	//   useEffect(() => {
	// 	const initializeChat = async () => {
	// 		const newSessionId = uuidv4();
	// 		setSessionId(newSessionId);
	// 		setSessionId(newSessionId);

	// 		// Send initial greeting message
	// 		const initialMessage: Message = {
	// 		  role: 'assistant',
	// 		  content: "Hello! I'm HeidelAI's AI Assistant. Before we begin, could you please tell me your name and the company you're representing?"
	// 		};

	// 		setMessages([initialMessage]);
	// 		await storeMessage(initialMessage, null, null, newSessionId);
	// 		setIsInitializing(false);
	// 	  }

	// 	initializeChat();
	//   }, []);

	//   useEffect(() => {
	// 	if (scrollAreaRef.current) {
	// 	  scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
	// 	}
	//   }, [messages]);

	//   const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!input.trim()) return;

	// 	const userMessage: Message = { role: 'user', content: input };
	// 	setMessages(prev => [...prev, userMessage]);
	// 	setInput('');
	// 	setIsLoading(true);

	// 	await storeMessage(userMessage, visitorName, visitorCompany, sessionId);

	// 	try {
	// 	  const { data, error } = await supabase.functions.invoke('chat', {
	// 		body: {
	// 		  messages: [...messages, userMessage],
	// 		  systemPrompt,
	// 		},
	// 	  });

	// 	  if (error) throw error;

	// 	  const assistantMessage = { 
	// 		role: 'assistant' as const, 
	// 		content: data.choices[0].message.content 
	// 	  };

	// 	  setMessages(prev => [...prev, assistantMessage]);

	// 	  await storeMessage(assistantMessage, visitorName, visitorCompany, sessionId);

	// 	  // Only try to extract visitor info from the first user message
	// 	  if (!visitorName && !visitorCompany && messages.length === 1) {
	// 		const nameMatch = userMessage.content.match(/(?:my name is|I'm|I am) ([^,.]+)/i);
	// 		const companyMatch = userMessage.content.match(/(?:from|with|at) ([^,.]+)/i);

	// 		if (nameMatch) setVisitorName(nameMatch[1].trim());
	// 		if (companyMatch) setVisitorCompany(companyMatch[1].trim());
	// 	  }

	// 	} catch (error) {
	// 	  console.error('Error calling chat function:', error);
	// 	  toast({
	// 		title: "Error",
	// 		description: "Failed to get a response. Please try again.",
	// 		variant: "destructive",
	// 	  });
	// 	} finally {
	// 	  setIsLoading(false);
	// 	}
	//   };

	return (
		<header>
			<nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 group flex justify-center pt-2 pointer-events-none">
				<div
					className={cn(
						'mx-auto w-full max-w-6xl px-6 border border-zinc-200/50 transition-all rounded-full backdrop-blur-md duration-500 lg:px-12 py-3 bg-white/80 shadow-sm pointer-events-auto',
						isScrolled && 'max-w-4xl border-zinc-300/80 py-2 px-6 shadow-md bg-white/90'
					)}
				>
					<div className="relative flex items-center justify-between gap-6 lg:gap-0">
						<div className="flex w-full justify-between lg:w-auto z-10">
							<Link
								href="/"
								onClick={(e) => {
									if (window.location.pathname === '/') {
										e.preventDefault();
										window.scrollTo({
											top: 0,
											behavior: 'smooth'
										});
									}
								}}
								aria-label="home"
								className="flex items-center gap-2 group"
							>
								<div className="relative w-8 h-8 transition-transform group-hover:scale-110">
									<Image
										fill
										src="/heidelai.png"
										alt="Heidel AI Logo"
										className="object-contain"
									/>
								</div>
								<span
									className={cn(
										'text-lg font-bold tracking-tight transition-colors duration-300',
										isDarkTheme ? 'text-gray-900' : 'text-gray-900'
									)}
								>
									Heidel AI
								</span>
							</Link>

							<div className="lg:hidden flex items-center">
								<Sheet open={menuState} onOpenChange={setMenuState}>
									<SheetTrigger asChild>
										<button
											aria-label={menuState ? 'Close Menu' : 'Open Menu'}
											className={cn(
												'relative z-20 -m-2.5 cursor-pointer p-2.5 text-gray-900 transition-colors duration-300'
											)}
										>
											<Menu className="size-6" />
										</button>
									</SheetTrigger>
									<SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-zinc-200 bg-white/95 backdrop-blur-md p-0">
										<div className="flex flex-col h-full py-6 px-6">
											<SheetHeader className="mb-8 items-start text-left">
												<div className="flex items-center gap-2 group mb-2">
													<div className="relative w-8 h-8 transition-transform group-hover:scale-110">
														<Image
															fill
															src="/heidelai.png"
															alt="Heidel AI Logo"
															className="object-contain"
														/>
													</div>
													<SheetTitle className="text-xl font-bold tracking-tight text-gray-900">
														Heidel AI
													</SheetTitle>
												</div>
												<p className="text-sm text-gray-500">
													AI that stays awake while you sleep.
												</p>
											</SheetHeader>

											<div className="flex flex-col flex-1 gap-8 mt-4">
												<nav className="flex flex-col gap-6">
													{menuItems.map((item, index) => (
														<Link
															key={index}
															href={item.href}
															onClick={(e) => handleNavClick(e, item.href)}
															className={cn(
																'text-lg font-semibold transition-all duration-300 py-2 border-b border-zinc-100',
																currentSection === item.href.replace('#', '')
																	? 'text-gray-900'
																	: 'text-gray-500'
															)}
														>
															{item.name}
														</Link>
													))}
												</nav>

												<div className="flex flex-col gap-4 mt-auto mb-8">
													<Button
														variant="outline"
														className="w-full justify-center py-6 text-base font-semibold border-zinc-200 text-gray-700 hover:bg-zinc-50 rounded-2xl"
														onClick={() => {
															setMenuState(false);
															router.push('/login');
														}}
													>
														Login
													</Button>
													<ScheduleDemo trigger={
														<Button
															className="w-full justify-center py-6 text-base font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl shadow-lg shadow-zinc-200"
														>
															Join Beta
														</Button>
													} />
												</div>
											</div>
										</div>
									</SheetContent>
								</Sheet>
							</div>
						</div>

						<div className="absolute inset-0 m-auto hidden size-fit lg:block">
							<ul className="flex gap-8">
								{menuItems.map((item, index) => (
									<li key={index}>
										<Link
											href={item.href}
											onClick={(e) => handleNavClick(e, item.href)}
											className={cn(
												'text-sm font-semibold transition-all duration-300 px-1 py-1',
												currentSection === item.href.replace('#', '')
													? 'text-gray-900'
													: 'text-gray-500 hover:text-gray-900'
											)}
										>
											<span>{item.name}</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="hidden lg:flex items-center gap-6">
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									isScrolled && 'hidden opacity-0 pointer-events-none',
									'text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-transparent transition-all duration-300'
								)}
								onClick={() => router.push('/login')}
							>
								<span>Login</span>
							</Button>
							<ScheduleDemo trigger={
								<Button
									size="sm"
									className={cn(
										!isScrolled && 'hidden opacity-0 pointer-events-none',
										'bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6 py-5 text-sm font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
									)}
								>
									<span>Join Beta</span>
								</Button>
							} />
						</div>
					</div>
				</div>
			</nav>
		</header>


	);
};

export default Header;