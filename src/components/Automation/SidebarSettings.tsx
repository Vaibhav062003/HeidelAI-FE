
// import React from 'react';

// export default function SidebarSettings({ node, onClose }: { node: any, onClose: () => void }) {
//   if (!node) return null;

//   const isInstagram = node.app === 'instagram';
//   const headerBg = isInstagram ? 'bg-[#E7C7F2]/30' : node.app === 'whatsapp' ? 'bg-emerald-50' : 'bg-slate-50';

//   return (
//     <div className="flex flex-col h-full bg-white select-none">
//       {/* Node Title Header */}
//       <div className={`${headerBg} border-b border-slate-100 px-6 py-6 flex items-center justify-between`}>
//          <div className="flex items-center gap-3">
//             <h3 className="text-lg font-black text-slate-800 tracking-tight">
//                {node.type === 'trigger' ? 'Edit Trigger' : `Send Message #${node.id.slice(-1)}`}
//             </h3>
//             <button className="text-slate-300 hover:text-slate-600 transition-colors">
//                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
//             </button>
//          </div>
//          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5">✕</button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
//         {/* Contextual Options */}
//         <div className="flex items-center justify-between">
//            <div className="flex items-center gap-1.5 text-sm font-semibold">
//               <span className="text-slate-900">Send</span>
//               <button className="text-[#2185FF] hover:underline flex items-center gap-1">
//                  {node.app === 'instagram' ? 'as Private Reply' : 'immediately'}
//                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.008v.008H12v-.008z" /></svg>
//               </button>
//            </div>
//         </div>

//         <div className="h-px bg-slate-100" />

//         {/* Message Editor Block */}
//         <div className="bg-[#F9FAFB] border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
//            <textarea 
//              placeholder="Enter your message text..."
//              className="w-full h-32 p-5 bg-transparent text-sm font-medium outline-none resize-none placeholder:text-slate-400 focus:bg-white transition-all"
//            />
//            <div className="px-5 py-3.5 flex items-center justify-between border-t border-slate-100">
//               <div className="flex gap-3">
//                  <button className="text-slate-400 hover:text-slate-900 transition-colors text-lg">😊</button>
//                  <button className="text-slate-400 hover:text-slate-900 transition-colors font-mono text-sm">{'{}'}</button>
//               </div>
//               <span className="text-[10px] font-bold text-slate-400 bg-slate-200/40 px-2 py-1 rounded">1000</span>
//            </div>
//            <button className="w-full py-4 border-t border-slate-100 text-[#2185FF] text-xs font-bold hover:bg-slate-100/50 transition-all flex items-center justify-center gap-2">
//               <span className="text-xl leading-none">+</span> Add Button
//            </button>
//         </div>

//         <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-full text-slate-400 text-xs font-black uppercase tracking-widest hover:border-slate-300 hover:text-slate-600 transition-all">
//            + Add Quick Reply
//         </button>

//         {/* Content Block Selector */}
//         <div className="space-y-4 pt-6">
//            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Insert Content Block:</p>
           
//            <div className="grid grid-cols-1 gap-3">
//               <ContentOption 
//                 icon="M4 6h16M4 12h16M4 18h7" 
//                 label="Text" 
//                 desc="Add simple text and buttons" 
//               />
//               <ContentOption 
//                 icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//                 label="Image" 
//                 desc="Boost engagement with visuals" 
//               />
//               <ContentOption 
//                 icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
//                 label="Delay" 
//                 desc="Wait a few seconds in between" 
//               />
//            </div>
//         </div>
//       </div>
      
//       <div className="p-6 border-t border-slate-100">
//          <button className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
//             Save Step
//          </button>
//       </div>
//     </div>
//   );
// }

// const ContentOption = ({ icon, label, desc }: any) => (
//   <div className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#2185FF] hover:shadow-lg hover:shadow-blue-50/50 transition-all cursor-pointer flex items-center gap-4">
//      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
//         <svg className="w-6 h-6 text-slate-400 group-hover:text-[#2185FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
//         </svg>
//      </div>
//      <div className="overflow-hidden">
//         <p className="text-sm font-bold text-slate-800 tracking-tight">{label}</p>
//         <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">{desc}</p>
//      </div>
//   </div>
// );
