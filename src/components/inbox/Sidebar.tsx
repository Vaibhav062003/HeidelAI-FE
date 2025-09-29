import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductPreview from "./PreviewProduct";
import ProductsTab from "./Product";
import CustomerInfo from "./CustomerInfo";
import { User, Mail, Users, TrendingUp, Clock, Phone, Fingerprint, IdCard, MapPin } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Package,
  BarChart3,
  Plus,
  Search,
  ChevronRight,
  ArrowLeft,
  MessageSquare
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
  onShareProduct: (Product: Product) => void;
  onConversationSelect: (id: string) => void;
  onToggleVisibility?: () => void;
  isMobile?: boolean; 
  isOpen?: boolean;
  conversation?: Conversation | null;   
}

const Sidebar = ({ 
  selectedConversationId,
  onShareProduct,
  conversation: passedConversation,
  onToggleVisibility,
  isMobile = false,     
  isOpen = true,        
}: SidebarProps) => { 
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [accordionValue, setAccordionValue] = useState("summary");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  
  const conversation = passedConversation;

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

  //fetchConversation useEffect

  const saveCustomerInfo = async (updatedData: {
    name: string;
    email: string;
    billingaddress: string;
    shippingaddress: string;
    gstin: string;
    phoneOrUserId: string;
  }) => {
    try {
      const response = await fetch(
        `https://your-api-endpoint/conversations/${selectedConversationId}/update_customer_info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer info");
      }

      const updatedConversation = await response.json();
      console.log("Customer information updated successfully!");
    } catch (error) {
      console.error("Error updating customer info:", error);
      throw error;
    }
  };

  const filteredTemplates = (templates || []).filter((template) =>
    template.name.toLowerCase().includes(searchTemplate.toLowerCase()) && template.status === 'APPROVED'
  );

  const analytics = {
    responseTime: "2m 30s",
    resolutionRate: "94%",
    customerSatisfaction: "4.8/5",
  };

  // Mobile overlay component
  const MobileOverlay = ({ children }: { children: React.ReactNode }) => {
    if (!isMobile) return <>{children}</>;
    
    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onToggleVisibility}
          />
        )}
        {/* Mobile modal */}
        <div className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {children}
        </div>
      </>
    );
  };

  const sidebarContent = (
    <TooltipProvider>
      <style>
        {`
          .ios-scrollbar::-webkit-scrollbar {
            width: 3px;
          }

          .ios-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .ios-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .ios-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
          }

          .ios-backdrop {
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }
        `}
      </style>

      {/* Template Builder Modal */}
      {showTemplateBuilder && (
        <TemplateBuilders
          isOpen={showTemplateBuilder}
          setIsOpen={setShowTemplateBuilder}
          templates={templates}
          setTemplates={setTemplates}
          searchTemplate={searchTemplate}
          setSearchTemplate={setSearchTemplate}
        />
      )}

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

      <Dialog open={showCustomerInfo} onOpenChange={setShowCustomerInfo}>
        <DialogContent className="max-w-4xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-600" />
              Customer Information
            </DialogTitle>
          </DialogHeader>
          
          {conversation && (
            <CustomerInfo
              name={conversation?.customer_name || "Not Saved"}
              email={conversation?.email || "Not Saved"}
              billingaddress={conversation?.billingAddress || "Not Saved"}
              shippingaddress={conversation?.shippingAddress || "Not Saved"}
              platform={conversation?.platform || ""}
              selectedConversationId={selectedConversationId}
              saveCustomerInfo={saveCustomerInfo}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Main Card - Responsive */}
      <Card className={`
        h-full max-h-screen bg-white/95 ios-backdrop overflow-hidden flex flex-col relative
        ${isMobile 
          ? 'rounded-l-3xl border-l border-gray-200/60 shadow-2xl' 
          : 'border-l border-gray-200/60 shadow-lg'
        }
      `}>
        {/* Header */}
        <div className={`
          bg-white/40 ios-backdrop border-b border-gray-100/60 flex-shrink-0 flex items-center justify-between
          ${isMobile ? 'px-4 py-4' : 'px-3 py-3'}
        `}>
          <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-base'}`}>
            Contact
          </h2>
          
          {/* Close button */}
          {onToggleVisibility && (
            <Button
              onClick={onToggleVisibility}
              variant="ghost"
              size="icon"
              className={`
                bg-white/60 hover:bg-white/90 rounded-xl transition-all duration-200 hover:scale-105
                flex items-center justify-center
                ${isMobile ? 'h-10 w-10' : 'h-7 w-7'}
              `}
              aria-label="Hide details sidebar"
            >
              <X className={`text-gray-600 ${isMobile ? 'h-5 w-5' : 'h-3.5 w-3.5'}`} />
            </Button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 ios-scrollbar">
          <div>
            {/* Customer Profile Section */}
            <div className={`bg-white/30 ios-backdrop border-b border-gray-100/60 ${isMobile ? 'p-4' : 'p-3'}`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`
                    bg-gradient-to-br from-gray-500 to-gray-400 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0
                    ${isMobile ? 'w-12 h-12' : 'w-9 h-9'}
                  `}>
                    <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      {conversation?.customer_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-base' : 'text-sm'}`}>
                      {conversation?.customer_name || "Unknown"}
                    </h3>
                    {isMobile && (
                      <p className="text-sm text-gray-500 font-medium">
                        {conversation?.platform === "instagram" ? "Instagram" : "WhatsApp"}
                      </p>
                    )}
                  </div>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`
                        bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 rounded-lg transition-all duration-300 font-medium flex-shrink-0
                        ${isMobile ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'}
                      `}
                      onClick={() => setShowCustomerInfo(true)}
                    >
                      <User className={`mr-1 ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                      View
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    align="center"
                    className="bg-gray-900/90 ios-backdrop text-white rounded-xl text-xs"
                    sideOffset={5}
                  >
                    View detailed information
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Contact Details */}
              <div className="space-y-2">
                <div className="bg-white/80 ios-backdrop rounded-lg p-3 border border-gray-100/60">
                  <div className="flex items-center gap-2">
                    <div className={`
                      bg-gray-100/80 rounded-md flex items-center justify-center flex-shrink-0
                      ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                    `}>
                      {conversation?.platform === "whatsapp" ? (
                        <Phone className={`text-black-600 ${isMobile ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'}`} />
                      ) : (
                        <IdCard className={`text-black-600 ${isMobile ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'}`} />
                      )}
                    </div>
                    <p className={`font-medium text-gray-900 truncate ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      {selectedConversationId?.split('_')[1] || "Not Available"}
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 ios-backdrop rounded-lg p-3 border border-gray-100/60">
                  <div className="flex items-center gap-2">
                    <div className={`
                      bg-gray-100/80 rounded-md flex items-center justify-center flex-shrink-0
                      ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                    `}>
                      <Mail className={`text-black-600 ${isMobile ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'}`} />
                    </div>
                    <p className={`font-medium text-gray-900 truncate ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      {conversation?.email || "Not Available"}
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 ios-backdrop rounded-lg p-3 border border-gray-100/60">
                  <div className="flex items-center gap-2">
                    <div className={`
                      bg-gray-100/80 rounded-md flex items-center justify-center flex-shrink-0
                      ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                    `}>
                      <MapPin className={`text-black-600 ${isMobile ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'}`} />
                    </div>
                    <p className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      Not Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion */}
            <div>
              <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={setAccordionValue}
                className="w-full"
              >
                {/* Summary Section */}
                <AccordionItem value="summary" className="border-0 bg-white/60 ios-backdrop overflow-hidden">
                  <AccordionTrigger className={`
                    hover:no-underline hover:bg-gray-50/60 transition-all duration-300
                    ${isMobile ? 'px-4 py-3' : 'px-3 py-2'}
                  `}>
                    <div className="flex items-center">
                      <div className={`
                        bg-orange-100/80 rounded-lg flex items-center justify-center mr-2
                        ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                      `}>
                        <FileText className={`text-orange-600 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                      </div>
                      <div className="text-left">
                        <span className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>
                          Summary
                        </span>
                        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                          Insights
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-gray-50/30">
                    <div className={isMobile ? 'p-4' : 'p-3'}>
                      <ConversationSummary selectedConversationId={selectedConversationId} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Templates Section */}
                <AccordionItem value="templates" className="border-0 bg-white/60 ios-backdrop overflow-hidden">
                  <AccordionTrigger className={`
                    hover:no-underline hover:bg-gray-50/60 transition-all duration-300
                    ${isMobile ? 'px-4 py-3' : 'px-3 py-2'}
                  `}>
                    <div className="flex items-center">
                      <div className={`
                        bg-blue-100/80 rounded-lg flex items-center justify-center mr-2
                        ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                      `}>
                        <FileText className={`text-blue-600 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                      </div>
                      <div className="text-left">
                        <span className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>
                          Templates
                        </span>
                        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                          Messages
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-gray-50/30">
                    <div className={isMobile ? 'p-4' : 'p-3'}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex-1">
                          <Search className={`
                            absolute left-2 top-1/2 -translate-y-1/2 text-gray-500
                            ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}
                          `} />
                          <Input
                            placeholder="Search templates..."
                            value={searchTemplate}
                            onChange={(e) => setSearchTemplate(e.target.value)}
                            className={`
                              bg-white/80 border-gray-200/60 rounded-lg focus:ring-2 focus:ring-blue-500/30 transition-all duration-300
                              ${isMobile ? 'h-10 pl-8 text-sm' : 'h-7 pl-7 text-xs'}
                            `}
                          />
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setShowTemplateBuilder(true)}
                              className={`
                                rounded-lg border-gray-200/60 hover:bg-blue-50/80 hover:border-blue-300/60 transition-all duration-300
                                ${isMobile ? 'h-10 w-10' : 'h-7 w-7'}
                              `}
                            >
                              <Plus className={isMobile ? 'h-4 w-4' : 'h-3 w-3'} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900/90 backdrop-blur-sm text-white rounded-xl text-xs">
                            Create template
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <ScrollArea className={isMobile ? 'h-48 ios-scrollbar' : 'h-40 ios-scrollbar'}>
                        {loading === true ? (
                          <div className="flex items-center justify-center h-32 w-full">
                            <div className="flex flex-col items-center gap-2">
                              <div className={`
                                bg-blue-100/80 rounded-lg flex items-center justify-center
                                ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}
                              `}>
                                <div className={`
                                  animate-spin rounded-full border border-blue-600 border-t-transparent
                                  ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}
                                `}></div>
                              </div>
                              <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                Loading...
                              </p>
                            </div>
                          </div>
                        ) : error ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="flex flex-col items-center gap-2">
                              <div className={`
                                bg-red-100/80 rounded-lg flex items-center justify-center
                                ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}
                              `}>
                                <X className={`text-red-600 ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                              </div>
                              <p className={`text-red-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                {error}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {filteredTemplates.map((template) => (
                              <Card
                                onClick={() => setSelectedTemplate(template)}
                                key={template.id}
                                className={`
                                  cursor-pointer hover:shadow-sm transition-all duration-300 bg-white/80 ios-backdrop 
                                  border border-gray-100/60 hover:border-gray-200/80 rounded-lg
                                  ${isMobile ? 'p-3' : 'p-2'}
                                `}
                              >
                                <div className="flex items-center justify-between">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className={`
                                        font-medium text-gray-900 truncate block
                                        ${isMobile ? 'text-sm max-w-[180px]' : 'text-xs max-w-[120px]'}
                                      `}>
                                        {template.name}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-900/90 backdrop-blur-sm text-white rounded-xl text-xs">
                                      {template.name}
                                    </TooltipContent>
                                  </Tooltip>
                                  <ChevronRight className={`text-gray-400 ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Products Section */}
                <AccordionItem value="products" className="border-0 bg-white/60 ios-backdrop overflow-hidden">
                  <AccordionTrigger className={`
                    hover:no-underline hover:bg-gray-50/60 transition-all duration-300
                    ${isMobile ? 'px-4 py-3' : 'px-3 py-2'}
                  `}>
                    <div className="flex items-center">
                      <div className={`
                        bg-purple-100/80 rounded-lg flex items-center justify-center mr-2
                        ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                      `}>
                        <Package className={`text-purple-600 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                      </div>
                      <div className="text-left">
                        <span className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>
                          Products
                        </span>
                        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                          Catalog
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-gray-50/30">
                    <div className={isMobile ? 'p-4' : 'p-3'}>
                      <ProductsTab
                        selectedConversationId={selectedConversationId}
                        onProductSelect={(product: Product) => setSelectedProduct(product)}
                        onShareProduct={onShareProduct}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Analytics Section */}
                <AccordionItem value="analytics" className="border-0 bg-white/60 ios-backdrop overflow-hidden">
                  <AccordionTrigger className={`
                    hover:no-underline hover:bg-gray-50/60 transition-all duration-300
                    ${isMobile ? 'px-4 py-3' : 'px-3 py-2'}
                  `}>
                    <div className="flex items-center">
                      <div className={`
                        bg-green-100/80 rounded-lg flex items-center justify-center mr-2
                        ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                      `}>
                        <BarChart3 className={`text-green-600 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                      </div>
                      <div className="text-left">
                        <span className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>
                          Analytics
                        </span>
                        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                          Metrics
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-gray-50/30">
                    <div className={isMobile ? 'p-4' : 'p-3'}>
                      {selectedConversationId ? (
                        <WhatsAppAnalyticsContent selectedConversationId={selectedConversationId} />
                      ) : (
                        <div className="space-y-3">
                          {/* Analytics Cards */}
                          <Card className={`
                            bg-white/80 ios-backdrop border border-gray-100/60 rounded-lg hover:shadow-sm transition-all duration-300
                            ${isMobile ? 'p-4' : 'p-3'}
                          `}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`
                                bg-blue-100/80 rounded-lg flex items-center justify-center
                                ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}
                              `}>
                                <Clock className={`text-blue-600 ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                  Response Time
                                </h3>
                                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                  Average
                                </p>
                              </div>
                            </div>
                            <p className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                              {analytics.responseTime}
                            </p>
                          </Card>

                          <Card className={`
                            bg-white/80 ios-backdrop border border-gray-100/60 rounded-lg hover:shadow-sm transition-all duration-300
                            ${isMobile ? 'p-4' : 'p-3'}
                          `}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`
                                bg-green-100/80 rounded-lg flex items-center justify-center
                                ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}
                              `}>
                                <TrendingUp className={`text-green-600 ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                  Resolution Rate
                                </h3>
                                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                  Success rate
                                </p>
                              </div>
                            </div>
                            <p className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                              {analytics.resolutionRate}
                            </p>
                          </Card>

                          <Card className={`
                            bg-white/80 ios-backdrop border border-gray-100/60 rounded-lg hover:shadow-sm transition-all duration-300
                            ${isMobile ? 'p-4' : 'p-3'}
                          `}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`
                                bg-purple-100/80 rounded-lg flex items-center justify-center
                                ${isMobile ? 'w-8 h-8' : 'w-6 h-6'}
                              `}>
                                <Users className={`text-purple-600 ${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                  Satisfaction
                                </h3>
                                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                                  Customer rating
                                </p>
                              </div>
                            </div>
                            <p className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                              {analytics.customerSatisfaction}
                            </p>
                          </Card>

                          <div className="text-center mt-4 p-3">
                            <div className={`
                              bg-gray-100/80 rounded-2xl flex items-center justify-center mx-auto mb-2
                              ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}
                            `}>
                              <MessageSquare className={`text-gray-500 ${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                            </div>
                            <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-sm' : 'text-xs'}`}>
                              Select a conversation to view detailed analytics
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ScrollArea>

        {/* Product Preview Modal */}
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

  if (isMobile) {
    return <MobileOverlay>{sidebarContent}</MobileOverlay>;
  }

  return sidebarContent;
};

export default Sidebar;
