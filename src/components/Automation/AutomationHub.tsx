
import React, { useState } from 'react';

export type ViewState = 'dashboard' | 'editor';


export default function AutomationHub() {
  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 text-slate-900 font-sans overflow-hidden">
      {/* Top Utility Navigation */}
      {/* <header className="h-14 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs tracking-tighter">AF</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900">AutoFlow</span>
        </div>
        
        <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </header> */}

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
              We're building something amazing. AutoFlow will revolutionize your workflow automation experience with intelligent triggers, seamless integrations, and powerful analytics.
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Fast Setup</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Smart Flows</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Reliable</span>
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
}

// import React, { useState } from 'react';
// import DashboardView from './DashboardView';
// import EditorView from './EditorView';
// import { ConnectChannelModal, TemplatesModal } from './Popups';

// export type ViewState = 'dashboard' | 'editor';

// export default function AutomationHub() {
//   const [view, setView] = useState<ViewState>('dashboard');
//   const [showConnectModal, setShowConnectModal] = useState(false);
//   const [showTemplatesModal, setShowTemplatesModal] = useState(false);
//   const [activeWorkflowName, setActiveWorkflowName] = useState('New Automation');

//   return (
//     <div className="flex flex-col h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
//       {/* Top Utility Navigation */}
//       <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 z-50">
//         <div className="flex items-center gap-6">
//           <div 
//             className="flex items-center gap-2.5 cursor-pointer group" 
//             onClick={() => setView('dashboard')}
//           >
//             <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
//               <span className="text-white font-bold text-xs tracking-tighter">AF</span>
//             </div>
//             <span className="font-bold text-sm tracking-tight text-slate-900">AutoFlow</span>
//           </div>
          
//           <div className="h-6 w-px bg-slate-200" />

//           {view === 'editor' ? (
//             <div className="flex items-center gap-2 text-xs font-medium">
//               <button 
//                 onClick={() => setView('dashboard')}
//                 className="text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 Workflows
//               </button>
//               <span className="text-slate-300">/</span>
//               <span className="text-slate-900 font-bold">{activeWorkflowName}</span>
//             </div>
//           ) : (
//             <nav className="flex items-center gap-1">
//               <button 
//                 onClick={() => setView('dashboard')}
//                 className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === 'dashboard' ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
//               >
//                 Dashboard
//               </button>
//               <button 
//                 onClick={() => setShowTemplatesModal(true)}
//                 className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-50"
//               >
//                 Template
//               </button>
//             </nav>
//           )}
//         </div>

//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => setShowConnectModal(true)}
//             className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest px-3 py-1.5 transition-colors"
//           >
//             Connect
//           </button>
//           <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all">
//             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
//           </div>
//         </div>
//       </header>

//       {/* Main Workspace Area */}
//       <main className="flex-1 relative overflow-hidden">
//         {view === 'dashboard' ? (
//           <DashboardView onOpenAutomation={(id) => {
//             if (id !== 'new') setActiveWorkflowName('Existing Automation');
//             else setActiveWorkflowName('New Automation');
//             setView('editor');
//           }} />
//         ) : (
//           <EditorView onBack={() => setView('dashboard')} />
//         )}
//       </main>

//       {/* Persistent System Modals */}
//       {showConnectModal && <ConnectChannelModal onClose={() => setShowConnectModal(false)} />}
//       {showTemplatesModal && <TemplatesModal onClose={() => setShowTemplatesModal(false)} />}
//     </div>
//   );
// }
