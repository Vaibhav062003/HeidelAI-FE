// import React, { useState, useRef, useEffect } from "react";
// import SidebarSettings from "./SidebarSettings";
// import { AddStepMenu } from "./Popups";

// interface Node {
//   id: string;
//   type: "trigger" | "action" | "logic";
//   app?: "instagram" | "whatsapp" | "email" | "ai";
//   label: string;
//   description?: string;
//   x: number;
//   y: number;
//   data: any;
// }

// interface Connection {
//   from: string;
//   to: string;
// }

// const NODE_WIDTH = 260;
// const NODE_HEIGHT = 140;

// export default function EditorView({ onBack }: { onBack: () => void }) {
//   const [nodes, setNodes] = useState<Node[]>([
//     {
//       id: "n-start",
//       type: "trigger",
//       label: "When...",
//       description: "User comments on your Post or Reel",
//       x: 200,
//       y: 300,
//       data: {},
//     },
//     {
//       id: "n-ig",
//       type: "action",
//       app: "instagram",
//       label: "Send Message",
//       x: 600,
//       y: 300,
//       data: { text: "" },
//     },
//   ]);
//   const [connections, setConnections] = useState<Connection[]>([
//     { from: "n-start", to: "n-ig" },
//   ]);

//   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [isPanning, setIsPanning] = useState(false);
//   const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [showAddMenu, setShowAddMenu] = useState(false);
//   const [addMenuPos, setAddMenuPos] = useState({ x: 0, y: 0 });
//   const [activePortId, setActivePortId] = useState<string | null>(null);

//   const canvasRef = useRef<HTMLDivElement>(null);

//   const autoFit = () => {
//     if (nodes.length === 0) return;
//     const padding = 100;
//     let minX = nodes[0].x;
//     let maxX = nodes[0].x + NODE_WIDTH;
//     let minY = nodes[0].y;
//     let maxY = nodes[0].y + NODE_HEIGHT;

//     nodes.forEach((n) => {
//       minX = Math.min(minX, n.x);
//       maxX = Math.max(maxX, n.x + NODE_WIDTH);
//       minY = Math.min(minY, n.y);
//       maxY = Math.max(maxY, n.y + NODE_HEIGHT);
//     });

//     const contentWidth = maxX - minX;
//     const contentHeight = maxY - minY;
//     const viewWidth = canvasRef.current?.clientWidth || window.innerWidth;
//     const viewHeight = canvasRef.current?.clientHeight || window.innerHeight;

//     const scaleX = (viewWidth - padding * 2) / contentWidth;
//     const scaleY = (viewHeight - padding * 2) / contentHeight;
//     const newZoom = Math.max(0.4, Math.min(1.2, Math.min(scaleX, scaleY)));

//     setZoom(newZoom);
//     setPan({
//       x: viewWidth / 2 - (minX + contentWidth / 2) * newZoom,
//       y: viewHeight / 2 - (minY + contentHeight / 2) * newZoom,
//     });
//   };

//   useEffect(() => {
//     const lastNode = nodes[nodes.length - 1];
//     if (!lastNode) return;

//     const worldX = lastNode.x * zoom + pan.x;
//     const worldY = lastNode.y * zoom + pan.y;
//     const vw = canvasRef.current?.clientWidth || window.innerWidth;
//     const vh = canvasRef.current?.clientHeight || window.innerHeight;

//     if (
//       worldX < 0 ||
//       worldX > vw - NODE_WIDTH ||
//       worldY < 0 ||
//       worldY > vh - NODE_HEIGHT
//     ) {
//       autoFit();
//     }
//   }, [nodes.length]);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (
//       e.target === canvasRef.current ||
//       (e.target as HTMLElement).classList.contains("canvas-container")
//     ) {
//       setIsPanning(true);
//       setSelectedNodeId(null);
//       setShowAddMenu(false);
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (isPanning) {
//       setPan((prev) => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
//     } else if (draggingNodeId) {
//       const rect = canvasRef.current?.getBoundingClientRect();
//       if (!rect) return;
//       const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
//       const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
//       setNodes((prev) =>
//         prev.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n))
//       );
//     }
//   };

//   const handleMouseUp = () => {
//     setIsPanning(false);
//     setDraggingNodeId(null);
//   };

//   const handleWheel = (e: React.WheelEvent) => {
//     e.preventDefault();
//     const delta = -e.deltaY;
//     const factor = 0.001;
//     const newZoom = Math.min(Math.max(zoom + delta * factor, 0.2), 2);

//     const rect = canvasRef.current?.getBoundingClientRect();
//     if (!rect) return;
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     const worldMouseX = (mouseX - pan.x) / zoom;
//     const worldMouseY = (mouseY - pan.y) / zoom;

//     const newPanX = mouseX - worldMouseX * newZoom;
//     const newPanY = mouseY - worldMouseY * newZoom;

//     setZoom(newZoom);
//     setPan({ x: newPanX, y: newPanY });
//   };

//   const startDrag = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     const node = nodes.find((n) => n.id === id);
//     if (!node) return;
//     const rect = canvasRef.current?.getBoundingClientRect();
//     if (!rect) return;

//     setDraggingNodeId(id);
//     setSelectedNodeId(id);

//     const mouseXInCanvas = (e.clientX - rect.left - pan.x) / zoom;
//     const mouseYInCanvas = (e.clientY - rect.top - pan.y) / zoom;

//     setDragOffset({
//       x: mouseXInCanvas - node.x,
//       y: mouseYInCanvas - node.y,
//     });
//   };

//   const addNode = (type: string, app?: string) => {
//     const id = `node-${Date.now()}`;
//     const newNode: Node = {
//       id,
//       type: type as any,
//       app: app as any,
//       label:
//         type === "action"
//           ? app === "instagram"
//             ? "Instagram"
//             : app === "whatsapp"
//             ? "WhatsApp"
//             : "Action"
//           : "Logic Step",
//       description: type === "action" ? "Send Message" : "Perform Logic",
//       x: nodes.length > 0 ? nodes[nodes.length - 1].x + 400 : 200,
//       y: nodes.length > 0 ? nodes[nodes.length - 1].y : 300,
//       data: {},
//     };
//     setNodes((prev) => [...prev, newNode]);
//     if (activePortId) {
//       setConnections((prev) => [...prev, { from: activePortId, to: id }]);
//       setActivePortId(null);
//     }
//     setShowAddMenu(false);
//   };

//   // IMPROVED BEZIER CURVE - Now properly connects to handles
//   const getBezier = (from: Node, to: Node) => {
//     // Output handle on right edge, vertically centered
//     const startX = from.x + NODE_WIDTH + 6; // Add handle offset
//     const startY = from.y + NODE_HEIGHT / 2;

//     // Input handle on left edge, at top (40px from top)
//     const endX = to.x - 6; // Subtract handle offset
//     const endY = to.y + 40;

//     // Calculate control points for smooth curve
//     const dx = endX - startX;
//     const dy = endY - startY;

//     // Horizontal distance for control points (creates nice S-curve)
//     const cpOffset = Math.max(Math.abs(dx) * 0.5, 100);

//     const cp1X = startX + cpOffset;
//     const cp1Y = startY;
//     const cp2X = endX - cpOffset;
//     const cp2Y = endY;

//     return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
//   };

//   return (
//     <div className="h-full w-full flex bg-[#F7F9FB] overflow-hidden relative">
//       <div
//         className={`w-[320px] bg-white border-r border-slate-200 h-full z-40 transition-transform duration-300 shadow-sm overflow-y-auto ${
//           selectedNodeId ? "translate-x-0" : "-translate-x-full absolute"
//         }`}
//       >
//         <SidebarSettings
//           node={nodes.find((n) => n.id === selectedNodeId)}
//           onClose={() => setSelectedNodeId(null)}
//         />
//       </div>

//       <div
//         ref={canvasRef}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onWheel={handleWheel}
//         className="flex-1 h-full outline-none relative overflow-hidden select-none canvas-container"
//       >
//         <div
//           className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out origin-top-left"
//           style={{
//             transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
//           }}
//         >
//           {/* Connection Lines with improved arrow */}
//           <svg className="absolute inset-0 w-[10000px] h-[10000px]">
//             <defs>
//               <marker
//                 id="arrow"
//                 viewBox="0 0 10 10"
//                 refX="9"
//                 refY="5"
//                 markerWidth="6"
//                 markerHeight="6"
//                 orient="auto"
//               >
//                 <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
//               </marker>
//             </defs>
//             {connections.map((conn, idx) => {
//               const f = nodes.find((n) => n.id === conn.from);
//               const t = nodes.find((n) => n.id === conn.to);
//               if (!f || !t) return null;
//               return (
//                 <path
//                   key={idx}
//                   d={getBezier(f, t)}
//                   stroke="#94a3b8"
//                   strokeWidth="2.5"
//                   fill="none"
//                   markerEnd="url(#arrow)"
//                   className="transition-all"
//                 />
//               );
//             })}
//           </svg>

//           {nodes.map((node) => (
//             <FlowStep
//               key={node.id}
//               node={node}
//               isSelected={selectedNodeId === node.id}
//               onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
//                 startDrag(e, node.id)
//               }
//               onAddLink={(e: React.MouseEvent<HTMLDivElement>) => {
//                 e.stopPropagation();
//                 setActivePortId(node.id);
//                 setAddMenuPos({ x: e.clientX, y: e.clientY });
//                 setShowAddMenu(true);
//               }}
//               onDelete={() => {
//                 setNodes((prev) => prev.filter((n) => n.id !== node.id));
//                 setConnections((prev) =>
//                   prev.filter((c) => c.from !== node.id && c.to !== node.id)
//                 );
//                 setSelectedNodeId(null);
//               }}
//             />
//           ))}
//         </div>

//         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-sm text-[11px] font-bold text-slate-500 flex items-center gap-3">
//           <span className="text-slate-400">
//             Zoom: {Math.round(zoom * 100)}%
//           </span>
//           <div className="w-px h-3 bg-slate-200" />
//           <button
//             onClick={autoFit}
//             className="hover:text-[#2185FF] transition-colors"
//           >
//             🎯 Auto-Center
//           </button>
//         </div>

//         <div className="absolute top-1/2 -translate-y-1/2 right-6 flex flex-col gap-4 items-center">
//           <button
//             onClick={(e) => {
//               setActivePortId(null);
//               setShowAddMenu(true);
//             }}
//             className="w-14 h-14 bg-[#2185FF] text-white rounded-full shadow-xl shadow-blue-100 flex items-center justify-center text-4xl font-light hover:scale-110 active:scale-95 transition-all"
//           >
//             +
//           </button>

//           <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden p-1 gap-1">
//             <button
//               onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
//               className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg text-slate-400"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M12 4.5v15m7.5-7.5h-15"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
//               className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg text-slate-400"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M19.5 12h-15"
//                 />
//               </svg>
//             </button>
//           </div>

//           <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {showAddMenu && (
//         <AddStepMenu
//           pos={addMenuPos}
//           onClose={() => setShowAddMenu(false)}
//           onSelect={addNode}
//         />
//       )}
//     </div>
//   );
// }

// function AppIcon({ app }: { app?: string }) {
//   if (app === "instagram") {
//     return (
//       <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
//         <rect
//           x="2"
//           y="2"
//           width="20"
//           height="20"
//           rx="5"
//           fill="url(#instagram-gradient)"
//         />
//         <circle
//           cx="12"
//           cy="12"
//           r="4"
//           stroke="white"
//           strokeWidth="2"
//           fill="none"
//         />
//         <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
//         <defs>
//           <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2">
//             <stop offset="0%" stopColor="#FD5949" />
//             <stop offset="50%" stopColor="#D6249F" />
//             <stop offset="100%" stopColor="#285AEB" />
//           </linearGradient>
//         </defs>
//       </svg>
//     );
//   }

//   if (app === "whatsapp") {
//     return (
//       <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
//         <circle cx="12" cy="12" r="10" fill="#25D366" />
//         <path
//           d="M17.5 14.45c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"
//           fill="white"
//         />
//       </svg>
//     );
//   }

//   if (app === "email") {
//     return (
//       <svg
//         className="w-5 h-5 text-blue-500"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
//       </svg>
//     );
//   }

//   if (app === "ai") {
//     return (
//       <svg
//         className="w-5 h-5 text-purple-500"
//         fill="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//       </svg>
//     );
//   }

//   return (
//     <svg
//       className="w-5 h-5 text-slate-400"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M13 10V3L4 14h7v7l9-11h-7z"
//       />
//     </svg>
//   );
// }

// function FlowStep({ node, isSelected, onMouseDown, onAddLink, onDelete }: any) {
//   const isTrigger = node.type === "trigger";

//   return (
//     <div
//       onMouseDown={onMouseDown}
//       className={`absolute w-[260px] bg-white rounded-[20px] transition-all cursor-pointer pointer-events-auto border-2
//         ${
//           isSelected
//             ? "border-[#36D18C] shadow-lg ring-8 ring-[#36D18C]/5"
//             : "border-white shadow-sm hover:shadow-md"
//         }
//       `}
//       style={{ left: node.x, top: node.y }}
//     >
//       <div className="p-4 flex items-center justify-between gap-2">
//         <div className="flex items-center gap-3 min-w-0 flex-1">
//           <div className="p-1.5 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 shrink-0">
//             <AppIcon app={node.app} />
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className="text-[10px] font-bold text-slate-400 leading-none mb-1 uppercase tracking-tight truncate">
//               {node.label}
//             </p>
//             <p className="text-xs font-bold text-slate-800 leading-tight break-words line-clamp-2">
//               {node.description || "Set up step"}
//             </p>
//           </div>
//         </div>
//         {isSelected && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete();
//             }}
//             className="text-rose-400 hover:text-rose-600 shrink-0"
//           >
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//               />
//             </svg>
//           </button>
//         )}
//       </div>

//       <div className="px-4 pb-4">
//         <div className="w-full py-4 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/40">
//           {isTrigger ? (
//             <span className="text-xs font-semibold text-[#2185FF]">
//               + New Trigger
//             </span>
//           ) : (
//             <span className="text-[11px] text-slate-400 font-medium italic">
//               Click to edit message
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Output Handle */}
//       <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 flex items-center group z-10">
//         <button
//           onClick={onAddLink}
//           className="w-5 h-5 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center hover:scale-125 transition-all shadow-md hover:border-[#2185FF] hover:shadow-lg"
//         >
//           <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-[#2185FF]" />
//         </button>
//         <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] px-2 py-1 rounded font-bold uppercase pointer-events-none whitespace-nowrap shadow-xl">
//           Next Step
//         </div>
//       </div>

//       {/* Input Handle */}
//       {!isTrigger && (
//         <div className="absolute -left-1.5 top-[40px] w-4 h-4 bg-white border-2 border-slate-300 rounded-full shadow-md z-10" />
//       )}
//     </div>
//   );
// }
