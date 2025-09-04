import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Users, Mail, Hash, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'

const LandingDashboard = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* All Conversations Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex gap-2 mb-4">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg relative">
                <Mail className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">44</span>
              </div>
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg relative">
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">51</span>
              </div>
            </div>
            <CardTitle>All your conversations in one place</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">View all the conversations from your customers in one single dashboard. You can filter the conversations by the incoming channel, label and status.</p>
          </CardContent>
          <CardFooter className="mt-auto flex justify-center">
          <button
              onClick={() => router.push('/settings#inboxes')}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2 font-medium"
            >
              Click here to create an inbox
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardFooter>
        </Card>

        {/* Team Members Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex -space-x-2 mb-4">
              <img className="w-12 h-12 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Team member" />
              <img className="w-12 h-12 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Team member" />
              <img className="w-12 h-12 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Team member" />
              <img className="w-12 h-12 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Team member" />
            </div>
            <CardTitle>Invite your team members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Since you are getting ready to talk to your customer, bring in your teammates to assist you. You can invite your teammates by adding their email addresses to the agent list.</p>
          </CardContent>
          <CardFooter className="mt-auto flex justify-center">
          <button
              onClick={() => router.push('/settings#teams')}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2 font-medium"
            >
              Click here to invite a team member
          </button>
          </CardFooter>
        </Card>

        {/* Canned Responses Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="bg-gray-100 rounded-lg p-2 mb-2">
              <div className="flex flex-col gap-2">
                <div className="bg-white rounded p-1 text-sm text-gray-600">good-bye - Thank you, have a good day! 👋</div>
                <div className="flex items-center gap-4 bg-white rounded p-2">
                  <span className="text-gray-400">/g</span>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
                </div>
              </div>
            </div>
            <CardTitle>Create canned responses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Pre-written quick reply templates help you quickly respond to a conversation. Agents can type the `/` character followed by the shortcode to insert a response.</p>
          </CardContent>
          <CardFooter className="mt-auto flex justify-center">
  <button
    onClick={() => router.push('/settings#cannedresponses')}
    className="text-blue-500 hover:text-blue-600 flex items-center gap-2 font-medium"
  >
    Click here to create a canned response
    <ArrowRight className="w-4 h-4" />
  </button>
</CardFooter>
        </Card>

        {/* Labels Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                sales
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-800 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                bugs
              </span>
              <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                billing
              </span>
              <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-800 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                VIP
              </span>
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                support
              </span>
            </div>
            <CardTitle>Organize conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Labels provide an easier way to categorize a conversation. Create some labels like #sales-enquiry, #billing-question and use them in a conversation later.</p>
          </CardContent>
          <CardFooter className="mt-auto flex justify-center">
            <button
              onClick={() => router.push('/settings#labels')}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2 font-medium"
            >
              Click here to create tags
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LandingDashboard;