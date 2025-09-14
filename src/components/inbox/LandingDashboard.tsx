import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Users, Mail, Hash, ArrowRight, Filter, BarChart3, Bell, Search, Clock, Zap, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';


const LandingDashboard = () => {
  const router = useRouter();
 return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-auto w-full p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="h-auto max-w-none mx-auto">
          {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 auto-rows-fr h-full">
            {/* All Conversations Section */}
            <Card className="h-auto flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg relative transform hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold animate-pulse">44</span>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg relative transform hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold animate-pulse">51</span>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  All your conversations in one place
                </CardTitle>

              </CardHeader>
              <CardContent className="flex-grow space-y-2 sm:space-y-4 p-2 sm:p-4 text-xs sm:text-base">
                <p className="text-gray-600 text-xs sm:text-base leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  View all the conversations from your customers in one single dashboard. You can filter the conversations by the incoming channel, label and status.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 p-4 sm:p-3 bg-gray-50 rounded-lg">
                    <Filter className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">Smart Filtering</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Search className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Quick Search</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Bell className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Real-time Alerts</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">Analytics</span>
                  </div>
                </div>
                
                
              </CardContent>
              <CardFooter className="pt-4">
                <button
                  onClick={() => router.push('/settings#inboxes')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Create an inbox
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>

            {/* Team Members Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-start -space-x-2 sm:-space-x-3 mb-4 overflow-hidden">
                  {[
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  ].map((src, index) => (
                    <img 
                      key={index}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-3 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer" 
                      src={src} 
                      alt={`Team member ${index + 1}`} 
                    />
                  ))}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-3 border-white bg-gray-200 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-gray-600 font-semibold text-xs sm:text-sm">+5</span>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Invite your team members
                </CardTitle>
              </CardHeader>
               <CardContent className="flex-grow space-y-4">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Since you are getting ready to talk to your customer, bring in your teammates to assist you. You can invite your teammates by adding their email addresses to the agent list.
                </p>
                
                {/* Team roles preview */}
                <div className=" space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800">Team Roles Available:</h4>
                  <div className="grid grid-rows-2 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Admin</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Member</span>
                    </div>
                  </div>
                </div>  
              </CardContent>
              <CardFooter className="pt-4">
                <button
                  onClick={() => router.push('/settings#teams')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Invite team member
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>

            {/* Canned Responses Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 mb-4 border">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="bg-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-gray-700 shadow-sm border">
                      <span className="font-semibold text-gray-900">good-bye</span> - Thank you, have a good day! 👋
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 bg-white rounded-lg p-2 sm:p-3 shadow-sm border">
                      <span className="text-gray-400 font-mono text-sm">/g</span>
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Create canned responses
                </CardTitle>
              </CardHeader>
               <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Pre-written quick reply templates help you quickly respond to a conversation. Agents can type the <code className="bg-gray-100 px-1 rounded text-sm">/</code> character followed by the shortcode to insert a response.
                </p>
                
                
                
                
              </CardContent>
              <CardFooter className="pt-4">
                <button
                  onClick={() => router.push('/settings#cannedresponses')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Create response
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>

            {/* Labels Section */}
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { name: 'sales', color: 'green' },
                    { name: 'bugs', color: 'purple' },
                    { name: 'billing', color: 'yellow' },
                    { name: 'VIP', color: 'orange' },
                    { name: 'support', color: 'blue' }
                  ].map((label) => (
                    <span 
                      key={label.name}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-${label.color}-100 text-${label.color}-800 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium hover:bg-${label.color}-200 transition-colors cursor-pointer transform hover:scale-105`}
                    >
                      <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
                      {label.name}
                    </span>
                  ))}
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Organize conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Labels provide an easier way to categorize a conversation. Create some labels like <code className="bg-gray-100 px-1 rounded text-sm">#sales-enquiry</code>, <code className="bg-gray-100 px-1 rounded text-sm">#billing-question</code> and use them in a conversation later.
                </p>
                
                {/* Label categories */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800">Label Categories:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="p-2 bg-blue-50 rounded-lg border-l-3 border-blue-400">
                      <div className="font-medium text-blue-700">Priority Labels</div>
                      <div className="text-gray-600">urgent, high, low</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg border-l-3 border-green-400">
                      <div className="font-medium text-green-700">Department Labels</div>
                      <div className="text-gray-600">sales, support, billing</div>
                    </div>
                  
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <button
                  onClick={() => router.push('/settings#labels')}
                  className="w-full sm:w-auto mx-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Create tags
                  <ArrowRight className="w-4 h-4" />
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