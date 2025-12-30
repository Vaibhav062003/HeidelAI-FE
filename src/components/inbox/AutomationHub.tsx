
import React, { useState, useRef, useMemo, useEffect } from 'react';

// --- Types & Interfaces ---
type NodeType = 'trigger' | 'action' | 'logic';
type AppType = 'instagram' | 'whatsapp' | 'email' | 'system';

interface NodeOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface AppDefinition {
  type: AppType;
  name: string;
  icon: string;
  color: string;
  triggers: NodeOption[];
  actions: NodeOption[];
}

interface NodeData {
  id: string;
  type: NodeType;
  app: AppType;
  x: number;
  y: number;
  label: string;
  selectedOptionId?: string;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
}

interface SavedTemplate {
  id: string;
  name: string;
  nodes: NodeData[];
  connections: Connection[];
  createdAt: string;
}

// --- Domain Data (n8n Style) ---
const APP_DEFINITIONS: Record<AppType, AppDefinition> = {
  instagram: {
    type: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: 'bg-gradient-to-br from-pink-500 to-rose-500',
    triggers: [
      { id: 'ig_comment', label: 'On New Comment', description: 'Triggers when someone comments on your post.', icon: '💬' },
      { id: 'ig_keyword', label: 'On DM Keyword', description: 'Triggers on specific DM keywords (e.g., "SALE").', icon: '🔑' }
    ],
    actions: [
      { id: 'ig_send_dm', label: 'Send Direct Message', description: 'Sends an automated response to the user.', icon: '✉️' },
      { id: 'ig_reply', label: 'Reply to Comment', description: 'Publicly replies to a user comment.', icon: '↩️' }
    ]
  },
  whatsapp: {
    type: 'whatsapp',
    name: 'WhatsApp',
    icon: '💬',
    color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    triggers: [
      { id: 'wa_cart', label: 'On Abandoned Cart', description: 'Triggers when a cart is abandoned for 1 hour.', icon: '🛒' },
      { id: 'wa_msg', label: 'On New Message', description: 'Triggers when any customer sends a message.', icon: '📥' }
    ],
    actions: [
      { id: 'wa_template', label: 'Send Template Message', description: 'Sends a pre-approved HSM template.', icon: '📑' },
      { id: 'wa_ai', label: 'AI Support Chat', description: 'Passes the chat to an intelligent AI agent.', icon: '🤖' }
    ]
  },
  email: {
    type: 'email',
    name: 'Email',
    icon: '✉️',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    triggers: [
      { id: 'em_sub', label: 'On New Subscriber', description: 'Triggers when a user joins your list.', icon: '👤' },
      { id: 'em_order', label: 'On Order Placed', description: 'Triggers immediately after a purchase.', icon: '💰' }
    ],
    actions: [
      { id: 'em_campaign', label: 'Send Campaign', description: 'Sends a targeted email newsletter.', icon: '📧' },
      { id: 'em_review', label: 'Request Review', description: 'Sends a post-purchase feedback email.', icon: '⭐' }
    ]
  },
  system: {
    type: 'system',
    name: 'Logic/AI',
    icon: '🧠',
    color: 'bg-gradient-to-br from-slate-700 to-slate-900',
    triggers: [],
    actions: [
      { id: 'sys_filter', label: 'Filter/Branch', description: 'Splits the flow based on data logic.', icon: '🔀' },
      { id: 'sys_delay', label: 'Wait Node', description: 'Wait for a duration before next step.', icon: '🕒' },
      { id: 'sys_writer', label: 'AI Copywriter', description: 'Generates context-aware copy using AI.', icon: '✍️' }
    ]
  }
};

// --- Sub-Components ---

const Node = ({ 
  node, 
  onDragStart, 
  onSelect, 
  isSelected, 
  onDelete,
  onStartConnecting,
  isTargeted,
  isConfigOpen
}: { 
  node: NodeData, 
  onDragStart: (e: React.MouseEvent, id: string) => void,
  onSelect: (id: string) => void,
  isSelected: boolean,
  onDelete: (id: string) => void,
  onStartConnecting: (e: React.MouseEvent, id: string) => void,
  isTargeted: boolean,
  isConfigOpen: boolean
}) => {
  const appDef = APP_DEFINITIONS[node.app];
  const hasInput = node.type !== 'trigger';
  const hasOutput = true; // Most nodes in our simple hub have outputs

  return (
    <div 
      className={`absolute group select-none ${isSelected || isConfigOpen ? 'z-50' : 'z-40'}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.node-handle') || target.closest('.node-delete')) return;
        if (e.button === 0) {
          onDragStart(e, node.id);
          onSelect(node.id);
        }
      }}
    >
      {/* Input Port */}
      {hasInput && (
        <div 
          className={`node-handle absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 rounded-full z-50 transition-all 
            ${isTargeted ? 'scale-125 border-indigo-500 bg-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}
          title="Input"
        />
      )}
      
      {/* Output Port */}
      {hasOutput && (
        <div 
          className="node-handle absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-300 rounded-full cursor-crosshair hover:bg-indigo-500 hover:border-indigo-600 hover:scale-125 transition-all z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnecting(e, node.id);
          }}
          title="Output"
        >
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
        </div>
      )}

      {/* Main Node UI (n8n Style) */}
      <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-150 overflow-hidden w-52 
        ${isConfigOpen ? 'border-indigo-500 shadow-indigo-100' : isSelected ? 'border-indigo-400' : 'border-slate-200'}
        ${isTargeted ? 'ring-2 ring-indigo-400' : ''}
      `}>
        <div className={`h-1.5 w-full ${appDef.color}`} />
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${appDef.color} shadow-sm`}>
              {appDef.icon}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{appDef.name}</p>
              <h4 className="font-bold text-slate-800 text-[13px] truncate leading-tight">{node.label}</h4>
            </div>
          </div>
          
          <button 
            className="node-delete absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-md p-1 transition-all"
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Connection Line Helper ---
const drawCurve = (x1: number, y1: number, x2: number, y2: number) => {
  const curvature = 0.5;
  const hx1 = x1 + Math.abs(x2 - x1) * curvature;
  const hx2 = x2 - Math.abs(x2 - x1) * curvature;
  return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`;
};

// --- Main Builder Component ---

export default function AutomationHub() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Selection / UI State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Drag State (Standard Movement)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Pan State (Canvas)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Connection State
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Logic Helpers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      setSelectedNodeId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    setMousePos({ x: localX, y: localY });

    if (draggingNodeId) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
    }

    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }

    if (connectingFromId) {
      const layerX = localX - panOffset.x;
      const layerY = localY - panOffset.y;
      
      const target = nodes.find(n => {
        return layerX >= n.x - 20 && layerX <= n.x + 220 &&
               layerY >= n.y && layerY <= n.y + 100 &&
               n.id !== connectingFromId;
      });
      setTargetNodeId(target ? target.id : null);
    }
  };

  const handleMouseUp = () => {
    if (connectingFromId && targetNodeId) {
      const exists = connections.some(c => c.fromId === connectingFromId && c.toId === targetNodeId);
      if (!exists) {
        setConnections(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          fromId: connectingFromId,
          toId: targetNodeId
        }]);
      }
    }

    setDraggingNodeId(null);
    setIsPanning(false);
    setConnectingFromId(null);
    setTargetNodeId(null);
  };

  const addNode = (app: AppType, type: NodeType) => {
    const newNode: NodeData = {
      id: Math.random().toString(36).substr(2, 9),
      app,
      type,
      x: 300 - panOffset.x + (Math.random() * 40 - 20),
      y: 200 - panOffset.y + (Math.random() * 40 - 20),
      label: type === 'trigger' ? APP_DEFINITIONS[app].triggers[0].label : APP_DEFINITIONS[app].actions[0].label,
      selectedOptionId: type === 'trigger' ? APP_DEFINITIONS[app].triggers[0].id : APP_DEFINITIONS[app].actions[0].id,
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  return (
    <div className="flex flex-col h-[95vh] w-full bg-slate-50 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 font-sans">
      
      {/* --- n8n-style Top Bar --- */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-[100] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <span className="text-white text-xl font-bold">⚡</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">SalesAutomation Workflow</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unsaved Changes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1 mr-4">
             <button className="px-3 py-1.5 text-xs font-bold bg-white text-indigo-600 rounded-md shadow-sm">Editor</button>
             <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">Executions</button>
          </div>
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 transition-all">Execute Workflow</button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* --- Sidebar (Node Library) --- */}
        <aside className="w-[280px] bg-white border-r border-slate-200 p-6 flex flex-col gap-6 z-[60] shadow-sm">
          <div className="relative mb-2">
            <input 
              type="text" 
              placeholder="Search nodes..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all" 
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Apps</h3>
              <div className="grid grid-cols-1 gap-2">
                {(['instagram', 'whatsapp', 'email'] as AppType[]).map(app => (
                  <div key={app} className="space-y-2">
                    <button 
                      onClick={() => addNode(app, 'trigger')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
                    >
                      <div className={`w-7 h-7 rounded-md ${APP_DEFINITIONS[app].color} flex items-center justify-center text-white text-sm shadow-sm`}>
                        {APP_DEFINITIONS[app].icon}
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">{APP_DEFINITIONS[app].name} Trigger</span>
                    </button>
                    <button 
                      onClick={() => addNode(app, 'action')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
                    >
                      <div className={`w-7 h-7 rounded-md ${APP_DEFINITIONS[app].color} flex items-center justify-center text-white text-sm shadow-sm`}>
                        {APP_DEFINITIONS[app].icon}
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">{APP_DEFINITIONS[app].name} Action</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Helpers</h3>
              <button 
                onClick={() => addNode('system', 'logic')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left"
              >
                <div className={`w-7 h-7 rounded-md ${APP_DEFINITIONS.system.color} flex items-center justify-center text-white text-sm shadow-sm`}>
                  🧠
                </div>
                <span className="text-[12px] font-bold text-slate-700">AI Logic / Filter</span>
              </button>
            </div>
          </div>
        </aside>

        {/* --- Pannable Canvas --- */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <main 
            ref={canvasRef}
            className={`absolute inset-0 cursor-${isPanning ? 'grabbing' : draggingNodeId ? 'grabbing' : 'grab'} outline-none`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ 
              backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
              backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out"
              style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
            >
              <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none">
                {/* Connections */}
                {connections.map(conn => {
                  const from = nodes.find(n => n.id === conn.fromId);
                  const to = nodes.find(n => n.id === conn.toId);
                  if (!from || !to) return null;
                  
                  const x1 = from.x + 208; // width of node (w-52 = 208px)
                  const y1 = from.y + 40;  // mid-ish height
                  const x2 = to.x;
                  const y2 = to.y + 40;
                  
                  return (
                    <g key={conn.id} className="pointer-events-auto cursor-pointer group">
                      <path 
                        d={drawCurve(x1, y1, x2, y2)} 
                        stroke="transparent" 
                        strokeWidth="16" 
                        fill="none" 
                        onClick={(e) => { e.stopPropagation(); setConnections(prev => prev.filter(c => c.id !== conn.id)); }}
                      />
                      <path 
                        d={drawCurve(x1, y1, x2, y2)} 
                        stroke="#cbd5e1" 
                        strokeWidth="3" 
                        fill="none" 
                        className="group-hover:stroke-indigo-400 group-hover:stroke-[4px] transition-all"
                      />
                    </g>
                  );
                })}

                {/* Ghost line during connection */}
                {connectingFromId && (
                  <path 
                    d={drawCurve(
                      (nodes.find(n => n.id === connectingFromId)?.x || 0) + 208,
                      (nodes.find(n => n.id === connectingFromId)?.y || 0) + 40,
                      mousePos.x - panOffset.x,
                      mousePos.y - panOffset.y
                    )} 
                    stroke="#818cf8" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeDasharray="8 8"
                  />
                )}
              </svg>

              {nodes.map(node => (
                <div key={node.id} className="pointer-events-auto">
                  <Node 
                    node={node} 
                    onDragStart={(e, id) => {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      setDraggingNodeId(id);
                      setDragOffset({
                        x: e.clientX - node.x,
                        y: e.clientY - node.y
                      });
                    }} 
                    onSelect={(id) => setSelectedNodeId(id)}
                    isSelected={selectedNodeId === node.id}
                    isConfigOpen={selectedNodeId === node.id}
                    onDelete={(id) => {
                      setNodes(prev => prev.filter(n => n.id !== id));
                      setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
                      setSelectedNodeId(null);
                    }}
                    onStartConnecting={(e, id) => setConnectingFromId(id)}
                    isTargeted={targetNodeId === node.id}
                  />
                </div>
              ))}
            </div>

            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none select-none">
                <div className="text-7xl mb-6 opacity-10">🏗️</div>
                <h3 className="text-lg font-black uppercase tracking-widest opacity-20">Blank Canvas</h3>
                <p className="text-[11px] font-bold opacity-20 mt-2">Add a trigger from the library to start automating sales.</p>
              </div>
            )}
          </main>

          {/* --- Config Sidebar (Sliding Panel) --- */}
          <aside 
            className={`absolute top-0 right-0 h-full w-[400px] bg-white border-l border-slate-200 z-[100] transition-transform duration-300 ease-in-out shadow-2xl
              ${selectedNodeId ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {selectedNode && (
              <div className="flex flex-col h-full">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Node Setup</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type: {selectedNode.type}</p>
                  </div>
                  <button onClick={() => setSelectedNodeId(null)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-lg transition-all">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Node Label</label>
                    <input 
                      type="text" 
                      value={selectedNode.label}
                      onChange={(e) => setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-800 focus:border-indigo-400 outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Select Operation</label>
                    <div className="space-y-3">
                      {(selectedNode.type === 'trigger' ? APP_DEFINITIONS[selectedNode.app].triggers : APP_DEFINITIONS[selectedNode.app].actions).map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, selectedOptionId: opt.id, label: opt.label } : n))}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                            selectedNode.selectedOptionId === opt.id ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${selectedNode.selectedOptionId === opt.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                            {opt.icon}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[13px]">{opt.label}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{opt.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-7xl font-black">AI</div>
                    <p className="text-[10px] font-black uppercase text-indigo-500 mb-2">Integration Logic</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                      "Automatic intent detection is enabled for this node. Customer replies will be processed by Gemini for optimal conversion."
                    </p>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                  <button className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-900 shadow-lg shadow-slate-100 transition-all">Save Configuration</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
    </div>
  );
}
