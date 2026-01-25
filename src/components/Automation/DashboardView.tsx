import React from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  Filter, 
  ArrowUpRight,
  MessageCircle,
  Users,
  MousePointerClick
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAutomation: (id: string) => void;
}

export default function DashboardView({ onOpenAutomation }: DashboardViewProps) {
  return (
    <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your automation performance</p>
        </div>
        <button 
          onClick={() => onOpenAutomation('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> New Automation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Conversations', value: '1,284', change: '+12%', icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Subscribers', value: '8,530', change: '+4.3%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Click-Through Rate', value: '24.8%', change: '+1.2%', icon: MousePointerClick, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Automations List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Your Automations</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Triggers</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Stats</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: '1', name: 'Welcome Sequence', status: 'Live', triggers: 'DM "Start"', sent: '1.2k', open: '98%' },
              { id: '2', name: 'Black Friday Promo', status: 'Draft', triggers: 'Comment "BF2024"', sent: '-', open: '-' },
              { id: '3', name: 'Support Bot V1', status: 'Live', triggers: 'Keyword "Help"', sent: '450', open: '82%' },
            ].map((row) => (
              <tr 
                key={row.id} 
                className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onOpenAutomation(row.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${row.status === 'Live' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} />
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{row.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border ${
                    row.status === 'Live' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{row.triggers}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span>{row.sent} sent</span>
                    <span>{row.open} open</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}