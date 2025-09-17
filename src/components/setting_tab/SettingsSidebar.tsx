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
  Menu,
  X,
  Settings
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // Auto-close sidebar on larger screens
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    router.push(`#${section.name.toLowerCase()}`);
    // Close sidebar on mobile after selection
    if (screenWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Determine layout type
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  return (
    <div className="h-screen w-full flex bg-gray-50">
      <Card className="h-full w-full max-w-full shadow-lg rounded-none overflow-hidden">
        <CardContent className="p-0 flex flex-col lg:flex-row h-full">
          
          {/* Mobile Header */}
          {(isMobile || isTablet) && (
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white lg:hidden">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {isMobile ? 'Settings' : 'Account Settings'}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}

          {/* Current Section Title for Mobile */}
          {isMobile && !isSidebarOpen && (
            <div className="p-3 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <activeSection.icon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{activeSection.name}</span>
                {activeSection.badge && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                    {activeSection.badge}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className={`
            ${isSidebarOpen || isDesktop ? 'block' : 'hidden'}
            ${isDesktop ? 'relative' : 'absolute inset-0 lg:relative'}
            ${isDesktop ? 'w-64 xl:w-72' : 'w-full lg:w-64'}
            ${isDesktop ? 'border-r' : ''}
            bg-white z-30 lg:z-auto
            flex flex-col h-full
          `}>
            
            {/* Sidebar Header - Desktop only */}
            {isDesktop && (
              <div className="p-4 lg:p-6 border-b">
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                    Account Settings
                  </h2>
                </div>
              </div>
            )}

            {/* Mobile/Tablet Sidebar Header */}
            {!isDesktop && isSidebarOpen && (
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Settings Navigation */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-4">
              <div className="space-y-1">
                {SettingsSections.map((section) => (
                  <Button
                    key={section.name}
                    variant={activeSection.name === section.name ? 'secondary' : 'ghost'}
                    className={`
                      w-full justify-start text-left
                      ${isMobile ? 'py-3 px-3' : 'py-2.5 px-3'}
                      ${activeSection.name === section.name ? 'bg-blue-50 text-blue-700 border-blue-200' : 'hover:bg-gray-100'}
                    `}
                    onClick={() => handleSectionChange(section)}
                  >
                    <section.icon className={`mr-2 sm:mr-3 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0`} />
                    <span className={`${isMobile ? 'text-base' : 'text-sm'} truncate flex-1`}>
                      {section.name}
                    </span>
                    {section.badge && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded flex-shrink-0">
                        {section.badge}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {(isMobile || isTablet) && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className={`
            flex-1 flex flex-col min-w-0 h-full
            ${!isDesktop && isSidebarOpen ? 'hidden' : 'flex'}
          `}>
            {/* Desktop Header */}
            {isDesktop && (
              <div className="p-4 lg:p-6 border-b bg-white">
                <div className="flex items-center gap-3">
                  <activeSection.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {activeSection.name}
                    </h1>
                    {activeSection.badge && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {activeSection.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Container - Only inner content scrolls */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
              <div className="max-w-none">
                <activeSection.component />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsDashboard;
