import React from 'react';

const InfluencerBot = () => {
  return (
    <div className="flex flex-col h-dvh min-h-screen w-full text-slate-900 font-sans overflow-hidden bg-white">
      {/* Coming Soon Content */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="text-center px-6 max-w-2xl">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 backdrop-blur-sm rounded-full border border-indigo-200/50 mb-6">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Under Development</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Coming Soon
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We're building something amazing. Influencer Bot is being designed to analyze social media profiles, providing engagement rates, audience insights, and detailed performance metrics.
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Audience Analysis</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Viral Trends</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Verified Data</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Expected launch: FEB 2026</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfluencerBot;
