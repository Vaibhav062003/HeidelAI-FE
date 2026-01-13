import React, { useState } from 'react';
import { Construction } from 'lucide-react';
export type ViewState = 'dashboard' | 'editor';


export default function AutomationHub() {
  return (
  <div className="flex flex-col h-dvh min-h-screen w-full text-slate-900 font-sans overflow-hidden">      {/* Top Utility Navigation */}
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
<div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
          Automation functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>        </div>
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
