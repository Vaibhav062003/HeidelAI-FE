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
  Link 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  { 
    icon: Users, 
    name: 'Agents', 
    component: AgentsSettings 
  },
  { 
    icon: UserCog, 
    name: 'Teams', 
    component: TeamsConfiguration
  },
  { 
    icon: Inbox, 
    name: 'Inboxes', 
    component: InboxSettings 
  },
  { 
    icon: Tag, 
    name: 'Labels', 
    component: LabelsSettings 
  },
  { 
    icon: Puzzle, 
    name: 'Custom Attributes', 
    component: CustomAttributesSettings 
  },
  { 
    icon: Workflow, 
    name: 'Automation', 
    component: AutomationSettings 
  },
  { 
    icon: FileText, 
    name: 'Macros', 
    component: MacrosSettings 
  },
  { 
    icon: List, 
    name: 'CannedResponses', 
    component: () => <CannedResponses onInsertResponse={(message: string) => {
      // Handle the response insertion here
      console.log('Inserting response:', message);
    }} />
  },
  { 
    icon: Link, 
    name: 'Integrations', 
    component: IntegrationsSettings 
  },
  { 
    icon: Shield, 
    name: 'Audit Logs', 
    component: AuditLogsSettings 
  },
  { 
    icon: Users, 
    name: 'Custom Roles', 
    component: CustomRolesSettings,
    badge: 'Beta'
  },
  { 
    icon: Clock, 
    name: 'SLA', 
    component: SLASettings,
    badge: 'Beta'
  }
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

  // Handle navigation based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const section = SettingsSections.find((s) => s.name.toLowerCase() === hash.toLowerCase());
    if (section) {
      setActiveSection(section);
    }
  }, []);

  const handleSectionChange = (section: typeof SettingsSections[0]) => {
    setActiveSection(section);
    router.push(`#${section.name.toLowerCase()}`); // Update the URL hash
  };

  return (
      <Card className="h-[100vh] w-[1350px] translate-x-[-40px] mx-auto my-2 shadow-lg rounded-xl">
      <CardContent className="p-6 flex h-full">
        <div className="w-64 border-r pr-4">
          <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          
          <div className="space-y-1">
            {SettingsSections.map((section) => (
              <Button
                key={section.name}
                variant={activeSection.name === section.name ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleSectionChange(section)}
              >
                <section.icon className="mr-2 h-4 w-4" />
                {section.name}
                {section.badge && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                    {section.badge}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 pl-6">
          {activeSection.name === 'Agents' ? (
            <AgentsSettings
              members={members}
              invited={invited}
              initialLoading={initialLoading}
              refresh={fetchMembers}
              agentlimit={AGENT_LIMIT}
            />
          ) : (
            React.createElement(activeSection.component)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsDashboard;