
// import React from 'react';

// interface DashboardProps {
//   onOpenAutomation: (id: string) => void;
// }

// export default function DashboardView({ onOpenAutomation }: DashboardProps) {
//   const automations = [
//     { id: '1', name: 'Instagram Story Autoreply', status: 'Active', channels: ['IG'], trigger: 'Story Mention', lastRun: '12m ago', conversions: '12%' },
//     // { id: '2', name: 'WhatsApp Sales Sequence', status: 'Paused', channels: ['WA'], trigger: 'Keyword: DISCOUNT', lastRun: '2h ago', conversions: '8.4%' },
//     // { id: '3', name: 'Abandoned Cart Email', status: 'Active', channels: ['EM'], trigger: 'Cart Event', lastRun: '1h ago', conversions: '15.1%' },
//     // { id: '4', name: 'Customer Support Bot', status: 'Draft', channels: ['IG', 'WA'], trigger: 'Incoming DM', lastRun: '-', conversions: '-' }
//   ];

//   return (
//     <div className="h-full flex flex-col p-10 max-w-6xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workflow Automations</h1>
//           <p className="text-xs text-slate-500 font-medium mt-1">Monitor and configure your omnichannel sales flows.</p>
//         </div>
//         <button 
//           onClick={() => onOpenAutomation('new')}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm transition-all"
//         >
//           Create Workflow
//         </button>
//       </div>

//       <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
//         {/* Table Filters */}
//         <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/30">
//           <div className="relative flex-1">
//              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
//              <input 
//                 type="text" 
//                 placeholder="Search by name or trigger..." 
//                 className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
//              />
//           </div>
//           <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest outline-none">
//             <option>All Status</option>
//             <option>Active</option>
//             <option>Draft</option>
//           </select>
//         </div>

//         {/* Workflow Table */}
//         <div className="overflow-y-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-100">
//                 <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
//                 <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger</th>
//                 <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</th>
//                 <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
//                 <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Conversion</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {automations.map((auto) => (
//                 <tr 
//                   key={auto.id}
//                   onClick={() => onOpenAutomation(auto.id)}
//                   className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{auto.name}</span>
//                       <span className="text-[10px] text-slate-400 font-medium">Last active {auto.lastRun}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-xs font-semibold text-slate-600">{auto.trigger}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex gap-1.5">
//                       {auto.channels.map(ch => (
//                         <span key={ch} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black">{ch}</span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-1.5 h-1.5 rounded-full ${auto.status === 'Active' ? 'bg-emerald-500' : auto.status === 'Paused' ? 'bg-amber-400' : 'bg-slate-300'}`} />
//                       <span className="text-[11px] font-bold text-slate-700">{auto.status}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{auto.conversions}</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
