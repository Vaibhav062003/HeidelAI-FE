import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Users, Mail, Hash, ArrowRight, Filter, BarChart3, Bell, Search, Clock, Zap, Tag } from 'lucide-react';

const LandingDashboard = () => {
  const handleNavigation = (path: string) => {
    console.log(`Navigate to: ${path}`);
  };

  return (
    <div className="h-screen w-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 hide-scrollbar">
      <div className="h-full w-full p-8 xl:p-6 lg:p-4 md:p-2 sm:p-1">
        <div className="h-full w-full">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-6 lg:gap-4 md:gap-3 sm:gap-2 h-full">
            
            {/* All Conversations Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-6 lg:pb-4 md:pb-3 sm:pb-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <div className="flex flex-wrap gap-4 lg:gap-3 md:gap-2 sm:gap-1 mb-6 lg:mb-4 md:mb-3 sm:mb-2">
                  <div className="w-14 h-14 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <MessageSquare className="w-7 h-7 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <div className="w-14 h-14 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <MessageSquare className="w-7 h-7 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <div className="w-14 h-14 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg relative transform hover:scale-105 transition-transform">
                    <Mail className="w-7 h-7 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-white" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 flex items-center justify-center font-semibold animate-pulse text-sm md:text-xs">44</span>
                  </div>
                  <div className="w-14 h-14 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg relative transform hover:scale-105 transition-transform">
                    <MessageSquare className="w-7 h-7 xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-white" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 flex items-center justify-center font-semibold animate-pulse text-sm md:text-xs">51</span>
                  </div>
                </div>
                <CardTitle className="text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm font-bold text-gray-900">
                  All your conversations in one place
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2 space-y-5 lg:space-y-4 md:space-y-3 sm:space-y-2">
                <p className="text-gray-600 leading-snug text-lg lg:text-base md:text-sm sm:text-xs">
                  View all the conversations from your customers in one single dashboard. You can filter the conversations by the incoming channel, label and status.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-3 md:gap-2 sm:gap-1">
                  <div className="flex items-center gap-3 md:gap-2 sm:gap-1 p-4 lg:p-3 md:p-2 sm:p-1 bg-gray-50 rounded-lg md:rounded-md">
                    <Filter className="w-6 h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg lg:text-base md:text-sm sm:text-xs">Smart Filtering</span>
                  </div>
                  <div className="flex items-center gap-3 md:gap-2 sm:gap-1 p-4 lg:p-3 md:p-2 sm:p-1 bg-gray-50 rounded-lg md:rounded-md">
                    <Search className="w-6 h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg lg:text-base md:text-sm sm:text-xs">Quick Search</span>
                  </div>
                  <div className="flex items-center gap-3 md:gap-2 sm:gap-1 p-4 lg:p-3 md:p-2 sm:p-1 bg-gray-50 rounded-lg md:rounded-md">
                    <Bell className="w-6 h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg lg:text-base md:text-sm sm:text-xs">Real-time Alerts</span>
                  </div>
                  <div className="flex items-center gap-3 md:gap-2 sm:gap-1 p-4 lg:p-3 md:p-2 sm:p-1 bg-gray-50 rounded-lg md:rounded-md">
                    <BarChart3 className="w-6 h-6 lg:w-5 lg:h-5 md:w-4 md:h-4 sm:w-3 sm:h-3 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg lg:text-base md:text-sm sm:text-xs">Analytics</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-6 lg:pt-4 md:pt-3 sm:pt-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <button
                  onClick={() => handleNavigation('/settings#inboxes')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 xl:px-6 lg:px-5 md:px-4 sm:px-3 py-4 xl:py-3 lg:py-2.5 md:py-2 sm:py-1.5 rounded-lg md:rounded-md flex items-center justify-center gap-3 md:gap-2 sm:gap-1 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-lg lg:text-base md:text-sm sm:text-xs"
                >
                  Create an inbox
                  <ArrowRight className="w-5 h-5 md:w-4 md:h-4 sm:w-3 sm:h-3" />
                </button>
              </CardFooter>
            </Card>

            {/* Team Members Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-6 lg:pb-4 md:pb-3 sm:pb-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <div className="flex justify-start -space-x-3 md:-space-x-2 sm:-space-x-1 mb-6 lg:mb-4 md:mb-3 sm:mb-2 overflow-hidden">
                  {[
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  ].map((src, index) => (
                    <img 
                      key={index}
                      className="w-14 h-14 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-6 sm:h-6 rounded-full border-3 lg:border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer" 
                      src={src} 
                      alt={`Team member ${index + 1}`} 
                    />
                  ))}
                  <div className="w-14 h-14 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-6 sm:h-6 rounded-full border-3 lg:border-2 border-white bg-gray-200 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-gray-600 font-semibold text-base md:text-sm sm:text-xs">+5</span>
                  </div>
                </div>
                <CardTitle className="text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm font-bold text-gray-900">
                  Invite your team members
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2 space-y-5 lg:space-y-4 md:space-y-3 sm:space-y-2">
                <p className="text-gray-600 leading-snug text-lg lg:text-base md:text-sm sm:text-xs">
                  Since you are getting ready to talk to your customer, bring in your teammates to assist you. You can invite your teammates by adding their email addresses to the agent list.
                </p>
                
                <div className="space-y-3 md:space-y-2 sm:space-y-1">
                  <h4 className="font-semibold text-gray-800 text-lg lg:text-base md:text-sm sm:text-xs">Team Roles Available:</h4>
                  <div className="grid grid-rows-2 gap-3 md:gap-2 sm:gap-1">
                    <div className="flex items-center gap-3 md:gap-2 sm:gap-1 p-4 lg:p-3 md:p-2 sm:p-1 bg-purple-50 rounded-lg md:rounded-md">
                      <div className="w-3 h-3 md:w-2 md:h-2 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 text-lg lg:text-base md:text-sm sm:text-xs">Admin</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-2 sm:gap-1 p-4 lg:p-3 md:p-2 sm:p-1 bg-blue-50 rounded-lg md:rounded-md">
                      <div className="w-3 h-3 md:w-2 md:h-2 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-lg lg:text-base md:text-sm sm:text-xs">Member</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-6 lg:pt-4 md:pt-3 sm:pt-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <button
                  onClick={() => handleNavigation('/settings#teams')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 xl:px-6 lg:px-5 md:px-4 sm:px-3 py-4 xl:py-3 lg:py-2.5 md:py-2 sm:py-1.5 rounded-lg md:rounded-md flex items-center justify-center gap-3 md:gap-2 sm:gap-1 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-lg lg:text-base md:text-sm sm:text-xs"
                >
                  Invite team member
                  <ArrowRight className="w-5 h-5 md:w-4 md:h-4 sm:w-3 sm:h-3" />
                </button>
              </CardFooter>
            </Card>

            {/* Canned Responses Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-6 lg:pb-4 md:pb-3 sm:pb-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl lg:rounded-lg p-5 lg:p-4 md:p-3 sm:p-2 mb-6 lg:mb-4 md:mb-3 sm:mb-2 border">
                  <div className="flex flex-col gap-4 lg:gap-3 md:gap-2 sm:gap-1">
                    <div className="bg-white rounded-lg md:rounded-md p-4 lg:p-3 md:p-2 sm:p-1 text-gray-700 shadow-sm border">
                      <span className="font-semibold text-gray-900 text-lg lg:text-base md:text-sm sm:text-xs">good-bye</span> 
                      <span className="text-lg lg:text-base md:text-sm sm:text-xs"> - Thank you, have a good day! 👋</span>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-3 md:gap-2 sm:gap-1 bg-white rounded-lg md:rounded-md p-4 lg:p-3 md:p-2 sm:p-1 shadow-sm border">
                      <span className="text-gray-400 font-mono text-lg lg:text-base md:text-sm sm:text-xs">/g</span>
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 lg:px-4 md:px-3 sm:px-2 py-2.5 lg:py-2 md:py-1.5 sm:py-1 rounded-md text-lg lg:text-base md:text-sm sm:text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm font-bold text-gray-900">
                  Create canned responses
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2 space-y-5 lg:space-y-4 md:space-y-3 sm:space-y-2">
                <p className="text-gray-600 leading-snug text-lg lg:text-base md:text-sm sm:text-xs">
                  Pre-written quick reply templates help you quickly respond to a conversation. Agents can type the <code className="bg-gray-100 px-1 rounded text-base md:text-sm sm:text-xs">/</code> character followed by the shortcode to insert a response.
                </p>
              </CardContent>
              
              <CardFooter className="pt-6 lg:pt-4 md:pt-3 sm:pt-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <button
                  onClick={() => handleNavigation('/settings#cannedresponses')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 xl:px-6 lg:px-5 md:px-4 sm:px-3 py-4 xl:py-3 lg:py-2.5 md:py-2 sm:py-1.5 rounded-lg md:rounded-md flex items-center justify-center gap-3 md:gap-2 sm:gap-1 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-lg lg:text-base md:text-sm sm:text-xs"
                >
                  Create response
                  <ArrowRight className="w-5 h-5 md:w-4 md:h-4 sm:w-3 sm:h-3" />
                </button>
              </CardFooter>
            </Card>

            {/* Labels Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-6 lg:pb-4 md:pb-3 sm:pb-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <div className="flex flex-wrap gap-3 md:gap-2 sm:gap-1 mb-6 lg:mb-4 md:mb-3 sm:mb-2">
                  {[
                    { name: 'sales', color: 'green' },
                    { name: 'bugs', color: 'purple' },
                    { name: 'billing', color: 'yellow' },
                    { name: 'VIP', color: 'orange' },
                    { name: 'support', color: 'blue' }
                  ].map((label) => (
                    <span 
                      key={label.name}
                      className={`px-5 lg:px-4 md:px-3 sm:px-2 py-2.5 lg:py-2 md:py-1.5 sm:py-1 rounded-full bg-${label.color}-100 text-${label.color}-800 flex items-center gap-3 md:gap-2 sm:gap-1 text-lg lg:text-base md:text-sm sm:text-xs font-medium hover:bg-${label.color}-200 transition-colors cursor-pointer transform hover:scale-105`}
                    >
                      <Hash className="w-5 h-5 lg:w-4 lg:h-4 md:w-3 md:h-3 sm:w-2 sm:h-2" />
                      {label.name}
                    </span>
                  ))}
                </div>
                <CardTitle className="text-2xl xl:text-xl lg:text-lg md:text-base sm:text-sm font-bold text-gray-900">
                  Organize conversations
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2 space-y-5 lg:space-y-4 md:space-y-3 sm:space-y-2">
                <p className="text-gray-600 leading-snug text-lg lg:text-base md:text-sm sm:text-xs">
                  Labels provide an easier way to categorize a conversation. Create some labels like <code className="bg-gray-100 px-1 rounded text-base md:text-sm sm:text-xs">#sales-enquiry</code>, <code className="bg-gray-100 px-1 rounded text-base md:text-sm sm:text-xs">#billing-question</code> and use them in a conversation later.
                </p>
                
                <div className="space-y-4 lg:space-y-3 md:space-y-2 sm:space-y-1">
                  <h4 className="font-semibold text-gray-800 text-lg lg:text-base md:text-sm sm:text-xs">Label Categories:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-2 sm:gap-1">
                    <div className="p-4 lg:p-3 md:p-2 sm:p-1 bg-blue-50 rounded-lg md:rounded-md border-l-3 lg:border-l-2 border-blue-400">
                      <div className="font-medium text-blue-700 text-lg lg:text-base md:text-sm sm:text-xs">Priority Labels</div>
                      <div className="text-gray-600 text-base md:text-sm sm:text-xs">urgent, high, low</div>
                    </div>
                    <div className="p-4 lg:p-3 md:p-2 sm:p-1 bg-green-50 rounded-lg md:rounded-md border-l-3 lg:border-l-2 border-green-400">
                      <div className="font-medium text-green-700 text-lg lg:text-base md:text-sm sm:text-xs">Department Labels</div>
                      <div className="text-gray-600 text-base md:text-sm sm:text-xs">sales, support, billing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-6 lg:pt-4 md:pt-3 sm:pt-2 p-8 xl:p-6 lg:p-4 md:p-3 sm:p-2">
                <button
                  onClick={() => handleNavigation('/settings#labels')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 xl:px-6 lg:px-5 md:px-4 sm:px-3 py-4 xl:py-3 lg:py-2.5 md:py-2 sm:py-1.5 rounded-lg md:rounded-md flex items-center justify-center gap-3 md:gap-2 sm:gap-1 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-lg lg:text-base md:text-sm sm:text-xs"
                >
                  Create tags
                  <ArrowRight className="w-5 h-5 md:w-4 md:h-4 sm:w-3 sm:h-3" />
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingDashboard;