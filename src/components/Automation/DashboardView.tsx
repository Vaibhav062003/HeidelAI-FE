import React, { useState } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  Trash2,
  FolderPlus,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAutomation: (id: string) => void;
}

const INSTAGRAM_ICON = (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-dash)" />
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
    <defs>
      <linearGradient id="ig-dash" x1="2" y1="22" x2="22" y2="2">
        <stop offset="0%" stopColor="#FD5949" />
        <stop offset="50%" stopColor="#D6249F" />
        <stop offset="100%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
  </svg>
);

const sampleAutomations = [
  {
    id: '1',
    name: 'Untitled',
    status: 'DRAFT' as const,
    triggers: [{ text: 'User comments on specific Post or Reel', keywords: [] }],
    runs: 'n/a',
    ctr: 'n/a',
    modified: '5 hours ago',
  },
  {
    id: '2',
    name: 'Untitled',
    status: 'DRAFT' as const,
    triggers: [
      { text: 'User comments on specific Post or Reel and comment contains', keywords: ['hello'] },
      { text: 'User comments on specific Post or Reel', keywords: [] },
    ],
    runs: 'n/a',
    ctr: 'n/a',
    modified: '9 months ago',
  },
];

export default function DashboardView({ onOpenAutomation }: DashboardViewProps) {
  const [search, setSearch] = useState('');
  const [anyTrigger, setAnyTrigger] = useState('Any Trigger');
  const [anyTriggerStates, setAnyTriggerStates] = useState('Any Trigger states');
  const [viewAsGrid, setViewAsGrid] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Left sub-nav: My Automations, Basic, Sequences */}
      <div className="flex flex-1 min-h-0">
        <aside className="w-56 shrink-0 border-r border-slate-200 bg-white py-4 px-3">
          <h2 className="text-lg font-bold text-slate-900 px-3 mb-4">Automation</h2>
          <nav className="space-y-0.5">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 font-medium text-sm"
            >
              <LayoutGrid className="w-4 h-4 text-slate-600" />
              My Automations
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm">
              <span className="w-4 h-4 rounded bg-slate-200" />
              Basic
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm">
              <span className="w-4 h-4">▶</span>
              Sequences
            </button>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">My Automations</h1>

            {/* Toolbar: search, filters, New Folder, New Automation, Trash, View as grid */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search all Automations"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={anyTrigger}
                  onChange={(e) => setAnyTrigger(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option>Any Trigger</option>
                </select>
                <select
                  value={anyTriggerStates}
                  onChange={(e) => setAnyTriggerStates(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option>Any Trigger states</option>
                </select>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                >
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Trash
                </button>
                <button
                  type="button"
                  onClick={() => setViewAsGrid(!viewAsGrid)}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  <LayoutGrid className="w-4 h-4" />
                  View as grid
                </button>
                <button
                  onClick={() => onOpenAutomation('new')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Automation
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1">
                        Name <ChevronsUpDown className="w-4 h-4" />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Runs</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">CTR</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1">
                        Modified <ChevronsUpDown className="w-4 h-4" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sampleAutomations.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      onClick={() => onOpenAutomation(row.id)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-slate-400 uppercase">DRAFT</span>
                            <span className="font-semibold text-slate-900">{row.name}</span>
                          </div>
                          <div className="space-y-1">
                            {row.triggers.map((t, i) => (
                              <div key={i} className="flex items-center gap-2 flex-wrap">
                                {INSTAGRAM_ICON}
                                <span className="text-sm text-slate-600">
                                  {t.text}
                                  {t.keywords.length > 0 && (
                                    <>
                                      {' '}
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                        {t.keywords[0]}
                                      </span>
                                      {t.text.includes('and') ? ' and' : ''}
                                    </>
                                  )}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setToggles((prev) => ({
                                      ...prev,
                                      [`${row.id}-${i}`]: !prev[`${row.id}-${i}`],
                                    }));
                                  }}
                                  className={`relative w-10 h-5 rounded-full transition-colors ${
                                    toggles[`${row.id}-${i}`] ? 'bg-indigo-600' : 'bg-slate-200'
                                  }`}
                                >
                                  <span
                                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                      toggles[`${row.id}-${i}`] ? 'left-5' : 'left-0.5'
                                    }`}
                                  />
                                </button>
                                <span className="text-xs text-slate-400">Off</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{row.runs}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{row.ctr}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{row.modified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
