import React, { useState } from 'react';
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
    name: 'Canned Responses', 
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
  const [activeSection, setActiveSection] = useState(SettingsSections[0]);

  return (
    <Card className="w-full h-screen">
      <CardContent className="p-6 flex h-full">
        <div className="w-64 border-r pr-4">
          <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          
          <div className="space-y-1">
            {SettingsSections.map((section) => (
              <Button
                key={section.name}
                variant={activeSection.name === section.name ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection(section)}
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
          <activeSection.component />
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsDashboard;