/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, AlertCircle, BarChart4, Phone, FileText, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhoneNumber } from './WhatsappLoginDialog'; // Reuse the utility from your existing file
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface WhatsAppProfileViewProps {
  whatsappId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface WhatsAppAccountDetails {
  status: string;
  account_info: {
    name: string;
    currency: string;
    timezone_id: string;
    analytics: {
      phone_numbers: string[];
      granularity: string;
      data_points: {
        start: number;
        end: number;
        sent: number;
        delivered: number;
      }[];
    };
  };
  phone_details: {
    display_phone_number: string;
    verified_name: string;
    code_verification_status: string;
    quality_rating: string;
    status: string;
    platform_type: string;
  };
  templates_summary: {
    count: number;
    recent_templates: {
      name: string;
      parameter_format: string;
      components: {
        type: string;
        format?: string;
        text: string;
      }[];
      language: string;
      status: string;
      category: string;
    }[];
  };
  analytics_period: {
    start: string;
    end: string;
    granularity: string;
  };
}

const statusColorMap = {
  VERIFIED: "green",
  CONNECTED: "green",
  PENDING: "yellow",
  FAILED: "red",
  GREEN: "green",
  YELLOW: "yellow",
  RED: "red",
  APPROVED: "green",
  REJECTED: "red",
  PENDING_REVIEW: "yellow"
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MessageTemplateCard = ({ template }: { template: any }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{template.name}</CardTitle>
          <Badge 
            className={`${
              template.status === 'APPROVED' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
              template.status === 'REJECTED' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
              'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            {template.status}
          </Badge>
        </div>
        <CardDescription>
          Category: {template.category} | Language: {template.language.replace('_', '-')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {template.components.map((component: any, index: number) => (
          <div key={index} className="mb-2">
            <div className="text-xs uppercase text-gray-500 font-semibold mb-1">{component.type}</div>
            <div className={`p-2 rounded ${component.type === 'HEADER' ? 'bg-gray-100 font-semibold' : 'bg-gray-50'}`}>
              {component.text}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const WhatsAppProfileView: React.FC<WhatsAppProfileViewProps> = ({ whatsappId, isOpen, onClose }) => {
  const [accountDetails, setAccountDetails] = useState<WhatsAppAccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (isOpen && whatsappId) {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/details`);
          if (!response.ok) {
            throw new Error('Failed to fetch WhatsApp account details');
          }

          const data = await response.json();
          setAccountDetails(data);
        } catch (err) {
          console.error('Error fetching WhatsApp account details:', err);
          setError('Could not load account details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAccountDetails();
  }, [isOpen, whatsappId]);

  // Transform data for charts
  const prepareMessageAnalyticsData = () => {
    if (!accountDetails?.account_info?.analytics?.data_points) return [];
    
    return accountDetails.account_info.analytics.data_points.map(point => ({
      date: formatDate(point.start),
      sent: point.sent,
      delivered: point.delivered,
      deliveryRate: point.sent > 0 ? Math.round((point.delivered / point.sent) * 100) : 0
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#25D366]" />
            WhatsApp Account Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#25D366]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        ) : accountDetails ? (
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-4">
                {/* Account Status Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Business Name</span>
                          <span className="font-medium">{accountDetails.account_info.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Phone Number</span>
                          <span className="font-medium">{formatPhoneNumber(accountDetails.phone_details.display_phone_number)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Quality Rating</span>
                          <Badge className={`${
                            accountDetails.phone_details.quality_rating === 'GREEN' ? 'bg-green-100 text-green-800' :
                            accountDetails.phone_details.quality_rating === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {accountDetails.phone_details.quality_rating}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          <Badge className={`${
                            accountDetails.phone_details.status === 'CONNECTED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {accountDetails.phone_details.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Verification</span>
                          <Badge className={`${
                            accountDetails.phone_details.code_verification_status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {accountDetails.phone_details.code_verification_status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Platform</span>
                          <span className="font-medium">{accountDetails.phone_details.platform_type}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Message Templates Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Message Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-[#25D366]" />
                      </div>
                      <div>
                        <div className="text-3xl font-semibold">{accountDetails.templates_summary.count}</div>
                        <div className="text-sm text-gray-500">Total Templates</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Analytics */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Message Activity</CardTitle>
                    <CardDescription>
                      {new Date(accountDetails.analytics_period.start).toLocaleDateString()} - {new Date(accountDetails.analytics_period.end).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareMessageAnalyticsData()}
                          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sent" fill="#9333EA" name="Sent" />
                          <Bar dataKey="delivered" fill="#10B981" name="Delivered" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Message Analytics</CardTitle>
                    <CardDescription>
                      Performance metrics for your WhatsApp Business account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareMessageAnalyticsData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" orientation="left" stroke="#9333EA" />
                          <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="sent" fill="#9333EA" name="Messages Sent" />
                          <Bar yAxisId="left" dataKey="delivered" fill="#10B981" name="Messages Delivered" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Delivery Rate</CardTitle>
                      <CardDescription>
                        Percentage of messages successfully delivered
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={prepareMessageAnalyticsData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} unit="%" />
                            <Tooltip formatter={(value) => [`${value}%`, 'Delivery Rate']} />
                            <Bar dataKey="deliveryRate" fill="#3B82F6" name="Delivery Rate" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Summary Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Calculate total messages */}
                        {(() => {
                          const analytics = accountDetails.account_info.analytics.data_points;
                          const totalSent = analytics.reduce((sum, point) => sum + point.sent, 0);
                          const totalDelivered = analytics.reduce((sum, point) => sum + point.delivered, 0);
                          const overallDeliveryRate = totalSent > 0 
                            ? Math.round((totalDelivered / totalSent) * 100) 
                            : 0;
                            
                          return (
                            <>
                              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <BarChart4 className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">Total Sent</div>
                                    <div className="text-xl font-semibold">{totalSent}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">Total Delivered</div>
                                    <div className="text-xl font-semibold">{totalDelivered}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Info className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">Overall Delivery Rate</div>
                                    <div className="text-xl font-semibold">{overallDeliveryRate}%</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Message Templates ({accountDetails.templates_summary.count})</h3>
                </div>
                
                {accountDetails.templates_summary.recent_templates.map((template, index) => (
                  <MessageTemplateCard key={index} template={template} />
                ))}
                
                {accountDetails.templates_summary.count > accountDetails.templates_summary.recent_templates.length && (
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {accountDetails.templates_summary.recent_templates.length} of {accountDetails.templates_summary.count} templates
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Business Name</div>
                        <div className="font-medium">{accountDetails.account_info.name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Currency</div>
                        <div className="font-medium">{accountDetails.account_info.currency}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Timezone</div>
                        <div className="font-medium">GMT+{accountDetails.account_info.timezone_id}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phone Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Phone Number</div>
                        <div className="font-medium">{formatPhoneNumber(accountDetails.phone_details.display_phone_number)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Verified Name</div>
                        <div className="font-medium">{accountDetails.phone_details.verified_name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Quality Rating</div>
                        <div className="font-medium">
                          <Badge className={`${
                            accountDetails.phone_details.quality_rating === 'GREEN' ? 'bg-green-100 text-green-800' :
                            accountDetails.phone_details.quality_rating === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {accountDetails.phone_details.quality_rating}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium">{accountDetails.phone_details.status}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Platform Type</div>
                        <div className="font-medium">{accountDetails.phone_details.platform_type}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No account information found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppProfileView;