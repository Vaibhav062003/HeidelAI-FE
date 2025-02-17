import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AgentsSettings from './Agent_management';
import TeamsConfiguration from './Team_configuration';
import CannedResponses from './CannedResponses';
import { Construction } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Add component */}
      <AgentsSettings />
      <TeamsConfiguration />
      <CannedResponses/>
      {/* You can add other dashboard components here */}
    </div>
  );
}

export const InboxSettings = () => {
  const [inboxConfig, setInboxConfig] = useState({
    autoAssign: true,
    defaultTeam: 'Support Team',
    emailRouting: 'intelligent'
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inbox Management</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-4 rounded-lg">
          <div>
            <h3 className="font-semibold">Auto Assignment</h3>
            <p className="text-sm text-muted-foreground">
              Automatically route incoming messages to agents
            </p>
          </div>
          <Switch 
            checked={inboxConfig.autoAssign}
            onCheckedChange={(checked) => setInboxConfig(prev => ({...prev, autoAssign: checked}))}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Email Routing</h3>
          <Select 
            value={inboxConfig.emailRouting}
            onValueChange={(value) => setInboxConfig(prev => ({...prev, emailRouting: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select routing method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intelligent">Intelligent Routing</SelectItem>
              <SelectItem value="round-robin">Round Robin</SelectItem>
              <SelectItem value="manual">Manual Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export const LabelsSettings = () => {
  const [labels, setLabels] = useState([
    { id: '1', name: 'Urgent', color: 'red' },
    { id: '2', name: 'Follow Up', color: 'blue' }
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Labels Management</h2>
      <div className="border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <div 
              key={label.id} 
              className={`px-3 py-1 rounded-full text-white bg-${label.color}-500`}
            >
              {label.name}
            </div>
          ))}
        </div>
        <Button className="mt-4">Create Label</Button>
      </div>
    </div>
  );
};

// Placeholder for the remaining components with similar structure
export const CustomAttributesSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Custom Attributes</h2>
    <p>Configure custom fields for contacts and conversations</p>
  </div>
);

export const AutomationSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Automation Rules</h2>
    <p>Create and manage automated workflows</p>
  </div>
);

export const MacrosSettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
          Macros functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);



export const IntegrationsSettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon...
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
          Integration functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);

export const AuditLogsSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Audit Logs</h2>
    <p>Track and review system activities</p>
  </div>
);

export const CustomRolesSettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
          Custom Role functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);

export const SLASettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
        Service Level Agreements functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);