import React from 'react';
import { Settings, Trash2, Copy, Info } from 'lucide-react';

interface SidebarSettingsProps {
  node: any; // In a real app, use the Node interface
  onClose: () => void;
}

export default function SidebarSettings({ node, onClose }: SidebarSettingsProps) {
  if (!node) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <h3 className="font-bold text-slate-800">Edit Step</h3>
        <button 
          onClick={onClose}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 bg-indigo-50 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Node Identity */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className={`p-2 rounded-lg shrink-0 ${
              node.type === 'trigger' ? 'bg-blue-100 text-blue-600' : 
              node.type === 'logic' ? 'bg-amber-100 text-amber-600' : 
              'bg-purple-100 text-purple-600'
            }`}>
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Step Type</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{node.label}</p>
              <p className="text-xs text-slate-500 mt-1">ID: {node.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Step Name</label>
            <input 
              type="text" 
              defaultValue={node.description}
              className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
              placeholder="e.g. Send Welcome Message"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Dynamic Content Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase">Configuration</h4>
          </div>

          {node.app === 'instagram' && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-500 block">Message Text</label>
              <textarea 
                className="w-full h-32 px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all"
                placeholder="Type your message here..."
                defaultValue={node.data?.text || ''}
              />
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all">
                  + Add Button
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all">
                  + Quick Reply
                </button>
              </div>
            </div>
          )}

          {node.type === 'trigger' && (
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
              <p className="text-xs font-medium text-blue-800">Trigger Settings</p>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="keyword" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                <label htmlFor="keyword" className="text-sm text-slate-600">Keyword is "Automation"</label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
          <Copy className="w-4 h-4" /> Duplicate
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-rose-500 text-xs font-bold hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}