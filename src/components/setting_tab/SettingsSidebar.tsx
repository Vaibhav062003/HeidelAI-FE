import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AgentsSettings from './Agent_management';
import TeamsConfiguration from './Team_configuration';
import { InboxSettings, LabelsSettings, CustomAttributesSettings, AutomationSettings, MacrosSettings, IntegrationsSettings, AuditLogsSettings, CustomRolesSettings, SLASettings } from './SidebarItem';
import { 
  Users, 
  List, 
  Inbox, 
  Tag, 
  Puzzle, 
  Workflow, 
  FileText, 
  Shield, 
  Clock, 
  UserCog, 
  Link,
  X,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CannedResponses from './CannedResponsesContext';

const SettingsSections = [
  { icon: Users, name: 'Agents', component: AgentsSettings },
  { icon: UserCog, name: 'Teams', component: TeamsConfiguration },
  { icon: Inbox, name: 'Inboxes', component: InboxSettings },
  { icon: Tag, name: 'Labels', component: LabelsSettings },
  { icon: Puzzle, name: 'Custom Attributes', component: CustomAttributesSettings },
  { icon: Workflow, name: 'Automation', component: AutomationSettings },
  { icon: FileText, name: 'Macros', component: MacrosSettings },
  { 
    icon: List, 
    name: 'CannedResponses', 
    component: () => <CannedResponses onInsertResponse={(message: string) => {
      console.log('Inserting response:', message);
    }} />
  },
  { icon: Link, name: 'Integrations', component: IntegrationsSettings },
  { icon: Shield, name: 'Audit Logs', component: AuditLogsSettings },
  { icon: Users, name: 'Custom Roles', component: CustomRolesSettings, badge: 'Beta' },
  { icon: Clock, name: 'SLA', component: SLASettings, badge: 'Beta' }
];

const SettingsDashboard = () => { 
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(SettingsSections[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const section = SettingsSections.find((s) => s.name.toLowerCase() === hash.toLowerCase());
    if (section) {
      setActiveSection(section);
    }
  }, []);

  // Listen for mobile header trigger
  useEffect(() => {
    const handleOpenSettingsSidebar = () => {
      setIsSidebarOpen(true);
    };

    window.addEventListener('openSettingsSidebar', handleOpenSettingsSidebar);
    return () => window.removeEventListener('openSettingsSidebar', handleOpenSettingsSidebar);
  }, []);

  const handleSectionChange = (section: typeof SettingsSections[0]) => {
    setActiveSection(section);
    router.push(`#${section.name.toLowerCase()}`);
    setIsSidebarOpen(false);
  };

  return (
    /* No conflicting mobile header */
    <div className="h-full w-full bg-gray-50 overflow-hidden">
      <div className="h-full w-full flex">
        
        {/* Navigation bar spacer for desktop */}
        <div className="w-0 md:w-20 flex-shrink-0"></div>
        
        {/* Settings Sidebar - No mobile header conflict */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          top-0 md:top-auto
          left-0 md:left-auto
          h-full
          w-80 md:w-80
          bg-white
          border-r border-gray-200
          flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          z-40 md:z-auto
          shadow-xl md:shadow-none
        `}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>
            {/* Close Button - Only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="h-8 w-8 md:hidden hover:bg-gray-100 rounded-lg"
              aria-label="Close settings menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {SettingsSections.map((section) => (
                <Button
                  key={section.name}
                  variant={activeSection.name === section.name ? 'secondary' : 'ghost'}
                  className={`
                    w-full justify-start text-left
                    py-4 px-4 text-base md:text-sm md:py-3
                    transition-all duration-200
                    ${activeSection.name === section.name 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm font-medium' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    }
                    rounded-lg
                  `}
                  onClick={() => handleSectionChange(section)}
                >
                  <section.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate flex-1">{section.name}</span>
                  {section.badge && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {section.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        <div 
          className={`
            fixed inset-0 bg-black/50 backdrop-blur-sm z-30
            transition-opacity duration-300
            md:hidden
            ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Main Content Area */}
        <main className="
          flex-1 
          h-full
          flex flex-col
          min-w-0
          overflow-hidden
          bg-white
        ">
          
          {/* Desktop Header - Only visible on desktop */}
          <header className="
            hidden md:flex
            items-center gap-4 
            p-6 border-b border-gray-200
            bg-white
            flex-shrink-0
          ">
            <activeSection.icon className="h-7 w-7 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeSection.name}</h1>
              {activeSection.badge && (
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium">
                  {activeSection.badge}
                </span>
              )}
            </div>
          </header>

          {/* Content Container */}
          <div className="flex-1 w-full overflow-hidden">
            <activeSection.component />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsDashboard;
