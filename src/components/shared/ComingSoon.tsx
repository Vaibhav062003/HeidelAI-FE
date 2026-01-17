import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
    featureName?: string;
    description?: string;
    compact?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
    featureName = "this feature",
    description = "Our team is working hard to bring you this feature. Stay tuned for updates!",
    compact = false
}) => {
    if (compact) {
        return (
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-white/50 min-h-[250px] rounded-xl">
                <div className="relative z-10 text-center space-y-3">
                    <div className="mx-auto bg-orange-100 rounded-full p-2 w-fit">
                        <Construction className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Coming Soon</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-[200px] mx-auto">
                        {description}
                    </p>
                    <div className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md font-bold text-[10px] tracking-tight transform hover:scale-105 transition-transform uppercase">
                        Expected launch - Feb 2026
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 md:p-12 bg-white/60 backdrop-blur-sm rounded-3xl w-full max-w-4xl mx-auto min-h-[50vh]">
            <div className="max-w-2xl space-y-6 md:space-y-8">
                <div className="mx-auto bg-orange-100 rounded-full p-5 md:p-6 w-fit animate-bounce">
                    <Construction className="h-10 w-10 md:h-12 md:w-12 text-orange-600" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tighter">
                        Coming Soon
                    </h2>
                    <p className="text-base md:text-base text-gray-600 font-medium leading-relaxed max-w-lg mx-auto">
                        {description}
                    </p>
                </div>
                <div className="pt-2">
                    <div className="inline-block px-8 py-4 bg-purple-600 text-white rounded-2xl shadow-2xl font-black text-lg md:text-xl tracking-tight transform hover:scale-110 active:scale-95 transition-all duration-300">
                        Expected launch - Feb 2026
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mt-8 font-semibold uppercase tracking-widest">
                        Check back soon or follow us for updates!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
