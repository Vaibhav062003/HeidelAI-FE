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

interface AgentMember {
  id: string | number;
  identifier: string;
  role_name: string;
  user_id: string; 
  public_user_data?: {
    identifier?: string;
    user_id?: string;
  };
}

interface InvitedAgent {
  id: string | number;
  email_address: string;
  status: string;
}


const AGENT_LIMIT = 5;


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
  { icon: Users, name: 'Custom Roles', component: CustomRolesSettings},
  { icon: Clock, name: 'SLA', component: SLASettings }
];

const SettingsDashboard = () => { 
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(SettingsSections[0]);

   const [members, setMembers] = useState<AgentMember[]>([]);
  const [invited, setInvited] = useState<InvitedAgent[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchMembers = async () => {
    setInitialLoading(true);
    const orgId = localStorage.getItem('org_id');
    try {
      const res = await fetch(`/api/Agents?org_id=${orgId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        const mappedMembers = (data.members || []).map((member: AgentMember) => ({
          ...member,
          user_id: member.public_user_data?.user_id || '',
        }));
        setMembers(mappedMembers);

        const pendingInvited = (data.invited || []).filter(
          (invite: InvitedAgent) => invite.status === 'pending'
        );
        setInvited(pendingInvited);
      }
    } catch (err) {
      // handle error
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    const interval = setInterval(fetchMembers, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, []);
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
    <div className="absolute inset-0 bg-gray-50 overflow-hidden">
      <div className="h-full w-full flex relative">
        
        {/* Settings Sidebar */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          inset-y-0 left-0
          h-full
          w-80
          bg-white
          border-r border-gray-200
          flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          z-40
          shadow-xl md:shadow-none
          flex flex-col
        `}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900 truncate">Account Settings</h2>
            </div>
            {/* Close Button  */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="h-8 w-8 md:hidden hover:bg-gray-100 rounded-lg flex-shrink-0"
              aria-label="Close settings menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {SettingsSections.map((section) => (
                <Button
                  key={section.name}
                  variant={activeSection.name === section.name ? 'secondary' : 'ghost'}
                  className={`
                    w-full justify-start text-left
                    py-3 px-3 text-sm
                    transition-all duration-200
                    ${activeSection.name === section.name 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm font-medium pl-2' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    }
                    rounded-lg
                  `}
                  onClick={() => handleSectionChange(section)}
                >
                  <section.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span className="truncate flex-1">{section.name}</span>
                  
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
        <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white">
          
          {/* Desktop Header */}
          <header className="hidden md:flex items-center gap-3 p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <activeSection.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-gray-900 truncate">{activeSection.name}</h1>
              {/* {activeSection.badge && (
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium">
                  {activeSection.badge}
                </span>
              )} */}
            </div>
          </header>

          {/* Content Container - Full height */}
          <div className="flex-1 w-full overflow-y-auto">
            <activeSection.component />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsDashboard;
