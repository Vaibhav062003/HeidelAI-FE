export default function PricingSection() {
    return (
        <section className="py-24 mb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="pricing">
            <div className="mb-12">
                <h2 className="font-manrope text-4xl text-center font-medium text-white mb-4">Affordable Pricing For Everyone </h2>
                <p className="text-neutral-400 text-center leading-6 mb-9">7 Days free trial. No credit card required.</p>
                <div className="flex justify-center items-center">
                    <label className="min-w-[3.5rem] text-xl relative text-white mr-4 font-medium">Bill Monthly</label>
                    <input type="checkbox" id="basic-with-description"
                        className="relative shrink-0 w-11 h-6 p-0.5 bg-indigo-100 checked:bg-none checked:bg-indigo-100 rounded-full cursor-pointer transition-colors ease-in-out duration-200  focus:border-blue-600  appearance-none 

                            before:inline-block before:w-5 before:h-5 before:bg-indigo-600 checked:before:bg-indigo-600 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform  before:transition before:ease-in-out before:duration-200 "/>
                    <label className="relative min-w-[3.5rem] font-medium text-xl text-neutral-400 ml-4 ">
                        Bill Yearly
                    </label>
                </div>
            </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0 lg:items-center">
                    <div className="flex flex-col mx-auto max-w-sm text-white/[0.8] rounded-2xl bg-black border border-white/[0.4] p-6 xl:py-9 xl:px-12 transition-all duration-500 hover:bg-white/[0.1]">
                        <h3 className="font-manrope text-2xl font-bold mb-3">Free</h3>
                        <div className="flex items-center mb-6">
                            <span className="font-manrope mr-2 text-6xl text-white/[0.8] font-semibold">$0</span>
                            <span className="text-xl text-neutral-400 ">/ month</span>
                        </div>
                        <ul className="mb-4 space-y-6 text-left text-lg text-neutral-400">
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>2 auto tracking</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>7 Day transaction clearing </span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>24/7 Customer support </span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>All widget access</span>
                            </li>
                        </ul>
                    </div> 
                    <div className="flex flex-col mx-auto max-w-sm text-white rounded-2xl bg-black border border-white/[0.4] transition-all duration-500 hover:bg-white/[0.1] ">
                        <div className="uppercase bg-gradient-to-r from-pink-500 to-violet-500 rounded-t-2xl p-3 text-center text-white">
                            MOST POPULAR
                        </div>   
                        <div className="p-6 xl:py-9 xl:px-12">
                        <h3 className="font-manrope text-2xl font-bold mb-3">Advanced</h3>
                        <div className="flex items-center mb-6">
                            <span className="font-manrope mr-2 text-6xl font-semibold  text-white">$150</span>
                            <span className="text-xl text-neutral-400 ">/ month</span>
                        </div>
                        <ul className="mb-4 space-y-6 text-left text-lg ">
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>AI Advisor</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Unlimited auto tracking</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>1 Day transaction clearing </span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Priority customer support</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>All Widget Access</span>
                            </li>
                        </ul>
                    </div>
                    </div> 
                    <div className="flex flex-col mx-auto max-w-sm text-white/[0.8] rounded-2xl bg-black border border-white/[0.4] p-6 xl:py-9 xl:px-12 transition-all duration-500 hover:bg-white/[0.1]">
                        <h3 className="font-manrope text-2xl font-bold mb-3">Team</h3>
                        <div className="flex items-center mb-6">
                            <span className="font-manrope mr-2 text-6xl font-semibold">$180</span>
                            <span className="text-xl text-neutral-400 ">/ month</span>
                        </div>
                        <ul className="mb-4 space-y-6 text-left text-lg text-neutral-400">
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>AI Advisor</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Unlimited auto tracking </span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>1 Day transaction clearing </span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Priority customer support</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <svg className="flex-shrink-0 w-6 h-6 text-purple-500" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>All Widget Access</span>
                            </li>
                        </ul>
                    </div> 
                </div>
            
        </div>
        </section>
    )
}
                                        