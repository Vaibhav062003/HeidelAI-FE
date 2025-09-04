import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductPreview from "./PreviewProduct";
import ProductsTab from "./Product";
import { User, Mail, Users, TrendingUp, Clock, Phone, Fingerprint, IdCard } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  FileText,
  Package,
  BarChart3,
  Plus,
} from "lucide-react";

import ConversationSummary from "./ConversationSummary";
import TemplateBuilders from "./TemplateBuilders";
import { WhatsAppTemplateDialog } from "./WhatsAppTemplateDialog";
import { WhatsAppTemplate } from "../types/template";
import WhatsAppAnalyticsContent from "@/components/inbox/WhatsAppAnalyticsContent";
import { Conversation } from '../types/conversation';

interface Product {
  id: string;
  category: string;
  description: string;
  images: string;
  name: string;
  on_sale: string;
  permalink: string;
  price: number;
  product_id: number;
  purchasable: string;
  regular_price: string;
  sale_price: string;
  slug: string;
  stock_quantity: number;
}

interface SidebarProps {
  selectedConversationId: string;
  onShareProduct: (product: Product) => void;
  onConversationSelect: (id: string) => void;
}

const Sidebar = ({ 
  selectedConversationId,
  onShareProduct,
}: SidebarProps) => { 
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [accordionValue, setAccordionValue] = useState("customer");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/fetchTemplate');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        
        if (result && result.data){
          setTemplates(result.data);
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fetch error");
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // Fetch conversation data when selectedConversationId changes
  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedConversationId) {
        setConversation(null);
        return;
      }

      try {
        setLoading(true);
        
        // Check if this is an Instagram or WhatsApp conversation
        const platform = selectedConversationId.split("_")[0];
        let response;

        if (platform === "instagram") {
          const instagramId = localStorage.getItem("instagram_user_id");
          
          if (!instagramId) {
            console.error("No Instagram ID found for fetching conversation");
            throw new Error("No Instagram ID found");
          }

          response = await fetch(
            `https://heidelai-backend2.koyeb.app/api/instagram/${instagramId}/conversations/${selectedConversationId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else if (platform === "whatsapp") {
          const whatsappId = localStorage.getItem("whatsapp_user_id");
          
          if (!whatsappId) {
            console.error("No WhatsApp ID found for fetching conversation");
            throw new Error("No WhatsApp ID found");
          }

          response = await fetch(
            `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (response && response.ok) {
          const data = await response.json();
          setConversation(data);
        } else {
          throw new Error("Failed to fetch conversation");
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setConversation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [selectedConversationId]);

  const filteredTemplates = (templates || []).filter((template) =>
    template.name.toLowerCase().includes(searchTemplate.toLowerCase()) && template.status === 'APPROVED'
  );

  const analytics = {
    responseTime: "2m 30s",
    resolutionRate: "94%",
    customerSatisfaction: "4.8/5",
  };
  
  return (
    <TooltipProvider>
      {selectedTemplate && selectedConversationId && (
        <WhatsAppTemplateDialog
          template={selectedTemplate}
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onSend={() => {
            console.log("Sending template:", selectedTemplate);
            setSelectedTemplate(null);
          }}
          selectedConversationId={selectedConversationId}
          languageCode={selectedTemplate.language}
        />
      )}

      <Card className="h-full max-h-screen p-1 bg-white border-l">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full"
        >
          {/* Customer Info Section */}
          <AccordionItem value="customer" className="border-b">
            <AccordionTrigger className="p-4 hover:no-underline flex justify-between items-center mt-9">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>Customer Info</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="space-y-3 text-sm text-gray-700">
  {/* Name Display */}
  <div className="flex items-start gap-3">
    <User className="h-4 w-4 text-gray-500 mt-0.5" />
    <div>
      <p className="text-xs text-gray-400">Name</p>
      <p className="font-medium">{conversation?.customer_name || "Not available"}</p>
    </div>
  </div>

  {/* Email Display */}
  <div className="flex items-start gap-3">
    <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
    <div>
      <p className="text-xs text-gray-400">Email</p>
      <p className="font-medium break-all">{conversation?.email || "Not available"}</p>
    </div>
  </div>

  {/* Phone/User ID Display */}
  <div className="flex items-start gap-3">
  {conversation?.platform === "whatsapp" ? (
    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
  ) : (
    <IdCard className="h-4 w-4 text-gray-500 mt-0.5" />
  )}
  <div>
    <p className="text-xs text-gray-400">
      {conversation?.platform === "whatsapp" ? "Phone" : "User ID"}
    </p>
    <p className="font-medium">
      {selectedConversationId?.split('_')[1] || "Not available"}
    </p>
  </div>
</div>

</div>

            </AccordionContent>
          </AccordionItem>

          {/* Summary Section */}
          <AccordionItem value="summary" className="border-b">
            <AccordionTrigger className="p-4 hover:no-underline flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Summary</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="h-full">
                <ConversationSummary
                  selectedConversationId={selectedConversationId}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Templates Section */}
          <AccordionItem value="templates" className="border-b">
            <AccordionTrigger className="p-4 hover:no-underline flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Templates</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {showTemplateBuilder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Create Template</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTemplateBuilder(false)}
                    >
                      Back
                    </Button>
                  </div>
                  <TemplateBuilders
                    isOpen={showTemplateBuilder}
                    setIsOpen={setShowTemplateBuilder}
                    templates={templates}
                    setTemplates={setTemplates}
                    searchTemplate={searchTemplate}
                    setSearchTemplate={setSearchTemplate}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      placeholder="Search templates..."
                      value={searchTemplate}
                      onChange={(e) => setSearchTemplate(e.target.value)}
                      className="flex-1"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setShowTemplateBuilder(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create new template</TooltipContent>
                    </Tooltip>
                  </div>
                  <ScrollArea className="h-[calc(100vh-160px)]">
                    {loading === true ? (
                      <div className="flex items-center justify-center h-40 w-full">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          <p className="text-sm text-gray-600">
                            Loading templates...
                          </p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-40 text-red-500">
                        <div className="flex flex-col items-center gap-2">
                          <X className="h-8 w-8" />
                          <p>{error}</p>
                        </div>
                      </div>
                    ) : (
                      filteredTemplates.map((template) => (
                        <Card
                          onClick={() => setSelectedTemplate(template)}
                          key={template.id}
                          className="p-3 mb-3 cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-semibold max-w-[150px] block">
                                  {template.name}
                                </span>
                              </TooltipTrigger>
                            </Tooltip>
                          </div>
                        </Card>
                      ))
                    )}
                  </ScrollArea>
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Products Section */}
          <AccordionItem value="products" className="border-b">
            <AccordionTrigger className="p-4 hover:no-underline flex justify-between items-center">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span>Products</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ProductsTab
                selectedConversationId={selectedConversationId}
                onProductSelect={(product: Product) =>
                  setSelectedProduct(product)
                }
                onShareProduct={onShareProduct}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Analytics Section */}
          <AccordionItem value="analytics" className="border-b">
            <AccordionTrigger className="p-4 hover:no-underline flex justify-between items-center">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>Analytics</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              {selectedConversationId ? (
                <WhatsAppAnalyticsContent
                  selectedConversationId={selectedConversationId}
                />
              ) : (
                <div className="space-y-4 p-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Avg Response Time</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {analytics.responseTime}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Resolution Rate</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {analytics.resolutionRate}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Customer Satisfaction</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {analytics.customerSatisfaction}
                    </p>
                  </Card>

                  <div className="text-center text-sm text-gray-500 mt-8">
                    <p>
                      Select a conversation to view detailed WhatsApp analytics
                    </p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {selectedProduct && (
          <ProductPreview
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onShare={(product) => {
              onShareProduct(product);
              setSelectedProduct(null);
            }}
            open={!!selectedProduct}
          />
        )}
      </Card>
    </TooltipProvider>
  );
};

export default Sidebar;