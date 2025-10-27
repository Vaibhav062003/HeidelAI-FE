import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductPreview from "./PreviewProduct";
import ProductsTab from "./Product";
import CustomerInfo from "./CustomerInfo";
import { User, Mail, Users, TrendingUp, Clock, Phone, Fingerprint, IdCard, MapPin, ChevronDown } from "lucide-react";
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
import { useConversations } from "../hooks/useConversations";

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

// Fluid spacing system
const fluidStyles = `
  :root {
    --sidebar-padding: clamp(0.625rem, 1.5vw, 0.875rem);
    --sidebar-gap: clamp(0.375rem, 0.75vw, 0.5rem);
    --sidebar-text-sm: clamp(0.6875rem, 1.25vw, 0.8125rem);
    --sidebar-text-xs: clamp(0.5625rem, 0.9vw, 0.6875rem);
    --avatar-size: clamp(2rem, 3.5vw, 2.5rem);
    --icon-size: clamp(0.875rem, 1.5vw, 1rem);
  }
`;

const ContactDetail = memo(({ 
  icon: Icon, 
  label,
  text,
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string;
  text: string;
}) => (
  <div className="flex items-start border-gray-100 last:border-0 gap-[calc(var(--sidebar-gap)*0.95)] py-[calc(var(--sidebar-gap)*1)]">
    <Icon className="text-gray-400 flex-shrink-0 mt-0.5 w-[calc(var(--icon-size)*0.85)] h-[calc(var(--icon-size)*0.85)]" />
    <div className="flex-1 min-w-0">
      {/* <p className="text-gray-500 font-medium mb-0.5 text-[calc(var(--sidebar-text-xs)*0.85)]">
        {label}
      </p> */}
      <p className="text-gray-900 font-medium truncate text-[calc(var(--sidebar-text-xs)*0.95)]">
        {text}
      </p>
    </div>
  </div>
));
ContactDetail.displayName = "ContactDetail";

const AnalyticsCard = memo(({ 
  icon: Icon, 
  title, 
  subtitle, 
  value, 
  color, 
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  value: string;
  color: string;
}) => (
  <Card 
    className="bg-white/80 backdrop-blur-sm border border-gray-100/60 rounded-xl hover:shadow-sm transition-all duration-300" 
    style={{ padding: 'var(--sidebar-padding)' }}
  >
    <div 
      className="flex items-center mb-1.5" 
      style={{ gap: 'var(--sidebar-gap)' }}
    >
      <div 
        className={`bg-${color}-100/80 rounded-lg flex items-center justify-center`}
        style={{ 
          width: 'calc(var(--avatar-size) * 0.7)', 
          height: 'calc(var(--avatar-size) * 0.7)' 
        }}
      >
<Icon 
  className={`text-${color}-600 w-[var(--icon-size)] h-[var(--icon-size)]`}
/>
      </div>
      <div className="flex-1 min-w-0">
        <h3 
          className="font-semibold text-gray-900 truncate" 
          style={{ fontSize: 'var(--sidebar-text-sm)' }}
        >
          {title}
        </h3>
        <p 
          className="text-gray-500 truncate" 
          style={{ fontSize: 'var(--sidebar-text-xs)' }}
        >
          {subtitle}
        </p>
      </div>
    </div>
    <p 
      className="font-bold text-gray-900" 
      style={{ 
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        marginLeft: 'calc(var(--avatar-size) * 0.7 + var(--sidebar-gap))'
      }}
    >
      {value}
    </p>
  </Card>
));
AnalyticsCard.displayName = "AnalyticsCard";

const TemplateCard = memo(({ 
  template, 
  onClick, 
}: { 
  template: WhatsAppTemplate; 
  onClick: () => void; 
}) => (
  <Card
    onClick={onClick}
    className="cursor-pointer hover:shadow-sm transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-100/60 hover:border-gray-200/80 rounded-xl"
    style={{ padding: 'calc(var(--sidebar-padding) * 0.65)' }}
  >
    <div className="flex items-center justify-between min-w-0 gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span 
            className="font-medium text-gray-900 truncate block" 
            style={{ fontSize: 'var(--sidebar-text-xs)' }}
          >
            {template.name}
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900/90 backdrop-blur-sm text-white rounded-xl text-xs">
          {template.name}
        </TooltipContent>
      </Tooltip>
      <ChevronRight 
        className="text-gray-400 flex-shrink-0" 
        style={{ width: 'calc(var(--icon-size) * 0.75)', height: 'calc(var(--icon-size) * 0.75)' }}
      />
    </div>
  </Card>
));
TemplateCard.displayName = "TemplateCard";

const AccordionSection = memo(({ 
  value, 
  icon: Icon, 
  title, 
  subtitle, 
  color, 
  children 
}: {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
}) => (
  <AccordionItem value={value} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
    <AccordionTrigger className="hover:no-underline hover:bg-gray-50/60 transition-all duration-300 px-[var(--sidebar-padding)] py-[calc(var(--sidebar-padding)*0.5)]">
      <div className="flex items-center gap-[calc(var(--sidebar-gap)*0.75)]">
        <div className={`bg-${color}-100/80 rounded-lg flex items-center justify-center flex-shrink-0 w-[calc(var(--icon-size)*1.15)] h-[calc(var(--icon-size)*1.15)]`}>
          <Icon className={`text-${color}-600 w-[calc(var(--icon-size)*0.85)] h-[calc(var(--icon-size)*0.85)]`} />
        </div>
        <div className="text-left min-w-0 flex-1">
          <span className="font-semibold text-gray-900 block truncate text-[calc(var(--sidebar-text-sm)*0.9)]">
            {title}
          </span>
          <p className="text-gray-500 truncate text-[calc(var(--sidebar-text-xs)*0.95)]">
            {subtitle}
          </p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="p-0 bg-gray-50/30">
      <div className="p-[var(--sidebar-padding)]">
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
));
AccordionSection.displayName = "AccordionSection";

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
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (passedConversation) {
      setConversation(passedConversation);
    }
  }, [passedConversation]);
  
  useEffect(() => {
    const loadTemplates = async () => {
      const cached = sessionStorage.getItem('whatsapp_templates');
      if (cached) {
        try {
          const parsedTemplates = JSON.parse(cached);
          setTemplates(parsedTemplates);
          return;
        } catch (e) {
          console.error("Cache parse error:", e);
        }
      }

      setLoading(true);
      try {
        const response = await fetch('/api/fetchTemplate');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result && result.data) {
          setTemplates(result.data);
          try {
            sessionStorage.setItem('whatsapp_templates', JSON.stringify(result.data));
          } catch (e) {
            console.error("Cache storage error:", e);
          }
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

  const handleTemplateSelect = useCallback((template: WhatsAppTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleProductShare = useCallback((product: Product) => {
    onShareProduct(product);
    setSelectedProduct(null);
  }, [onShareProduct]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTemplate(e.target.value);
  }, []);

  const handleShowCustomerInfo = useCallback(() => {
    setShowCustomerInfo(true);
  }, []);

  const handleCloseCustomerInfo = useCallback(() => {
    setShowCustomerInfo(false);
  }, []);

  const handleShowTemplateBuilder = useCallback(() => {
    setShowTemplateBuilder(true);
  }, []);

  const handleCloseTemplateBuilder = useCallback(() => {
    setShowTemplateBuilder(false);
  }, []);

  const handleCloseTemplate = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  const handleProductClose = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const saveCustomerInfo = useCallback(async (updatedData: {
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
  }, [selectedConversationId]);

  const filteredTemplates = useMemo(() => 
    templates.filter((template) =>
      template.name.toLowerCase().includes(searchTemplate.toLowerCase()) && 
      template.status === 'APPROVED'
    ),
    [templates, searchTemplate]
  );

  const analytics = useMemo(() => ({
    responseTime: "2m 30s",
    resolutionRate: "94%",
    customerSatisfaction: "4.8/5",
  }), []);

  const contactPhone = useMemo(() => 
    selectedConversationId?.split('_')[1] || "Not Available",
    [selectedConversationId]
  );

  const contactEmail = useMemo(() => 
    conversation?.email || "Not Available",
    [conversation?.email]
  );

  const customerInitial = useMemo(() => 
    conversation?.customer_name?.charAt(0).toUpperCase() || 'U',
    [conversation?.customer_name]
  );

  const platformName = useMemo(() => 
    conversation?.platform === "instagram" ? "Instagram" : "WhatsApp",
    [conversation?.platform]
  );

  const MobileOverlay = useCallback(({ children }: { children: React.ReactNode }) => {
    if (!isMobile) return <>{children}</>;
    
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onToggleVisibility}
          />
        )}
        <div className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {children}
        </div>
      </>
    );
  }, [isMobile, isOpen, onToggleVisibility]);

  const sidebarContent = useMemo(() => (
    <TooltipProvider>
      <style>
        {`
          ${fluidStyles}
          .ios-scrollbar::-webkit-scrollbar { width: 3px; }
          .ios-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .ios-scrollbar::-webkit-scrollbar-thumb { 
            background: rgba(0,0,0,0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .ios-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
          * {
            min-width: 0;
            min-height: 0;
          }
        `}
      </style>

      {showTemplateBuilder && (
        <TemplateBuilders
          isOpen={showTemplateBuilder}
          setIsOpen={handleCloseTemplateBuilder}
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
          onClose={handleCloseTemplate}
          onSend={() => {
            console.log("Sending template:", selectedTemplate);
            handleCloseTemplate();
          }}
          selectedConversationId={selectedConversationId}
          languageCode={selectedTemplate.language}
        />
      )}

      <Dialog open={showCustomerInfo} onOpenChange={handleCloseCustomerInfo}>
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
              email={contactEmail}
              billingaddress={conversation?.billingAddress || "Not Saved"}
              shippingaddress={conversation?.shippingAddress || "Not Saved"}
              platform={conversation?.platform || ""}
              selectedConversationId={selectedConversationId}
              saveCustomerInfo={saveCustomerInfo}
            />
          )}
        </DialogContent>
      </Dialog>

      <Card className="h-full max-h-screen bg-white/95 backdrop-blur-sm overflow-hidden flex flex-col relative rounded-l-3xl border-l border-gray-200/60 shadow-lg">
        {/* Header */}
        <div className="bg-white/40 backdrop-blur-sm border-b border-gray-100/60 flex-shrink-0 flex items-center justify-between px-[var(--sidebar-padding)] py-[var(--sidebar-padding)]">
          <h2 className="font-semibold text-gray-900 text-[clamp(1rem,2.5vw,1.125rem)]">Contact</h2>
          
          {onToggleVisibility && (
            <Button
              onClick={onToggleVisibility}
              variant="ghost"
              size="icon"
              className="bg-white/60 hover:bg-white/90 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center h-[clamp(2rem,4vw,2.5rem)] w-[clamp(2rem,4vw,2.5rem)]"
              aria-label="Hide details sidebar"
            >
              <X className="text-gray-600 h-[calc(var(--icon-size)*0.9)] w-[calc(var(--icon-size)*0.9)]" />
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 ios-scrollbar min-h-0">
          <div>
            {/* Customer Profile Section */}
<div className="bg-white  border-gray-100/60 p-[var(--sidebar-padding)]">
  <div className="flex items-start gap-[var(--sidebar-gap)]">
  <div 
    className="bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 w-[calc(var(--avatar-size)*0.95)] h-[calc(var(--avatar-size)*0.95)]"
  >
    <span className="text-white font-semibold text-[calc(var(--sidebar-text-sm)*0.85)]">
      {customerInitial}
    </span>
  </div>

  <div className="flex-1 min-w-0">
    <h3 
      className="font-bold text-gray-900 truncate mb-1" 
      style={{ fontSize: 'var(--sidebar-text-sm)' }}
    >
      {conversation?.customer_name || "Unknown"}
    </h3>
    
    {/* View Details Button */}
    <button 
      onClick={handleShowCustomerInfo}
      className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-left flex items-center gap-1"
      style={{ fontSize: 'calc(var(--sidebar-text-xs) * 1.05)' }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        className="w-[calc(var(--icon-size)*0.85)] h-[calc(var(--icon-size)*0.85)]"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" 
        />
      </svg>
      View details
    </button>
  </div>
</div>

  {/* Contact Details */}
  <div className="space-y-0 border-t border-gray-100 mt-[var(--sidebar-gap)] pt-[var(--sidebar-gap)]">
    <ContactDetail 
      icon={conversation?.platform === "whatsapp" ? Phone : IdCard}
      label="Phone"
      text={contactPhone}
    />
    <ContactDetail 
      icon={Mail}
      label="Email"
      text={contactEmail}
    />
    <ContactDetail 
      icon={MapPin}
      label="Location"
      text="Not Available"
    />
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
                <AccordionSection
                  value="summary"
                  icon={FileText}
                  title="Summary"
                  subtitle="Insights"
                  color="orange"
                >
                  <ConversationSummary selectedConversationId={selectedConversationId} />
                </AccordionSection>

                <AccordionSection
                  value="templates"
                  icon={FileText}
                  title="Templates"
                  subtitle="Messages"
                  color="blue"
                >
                  <div className="flex items-center gap-[var(--sidebar-gap)] mb-[var(--sidebar-gap)]">
                    <div className="relative flex-1 min-w-0">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 h-[calc(var(--icon-size)*0.8)] w-[calc(var(--icon-size)*0.8)]" />
                      <Input
                        placeholder="Search templates..."
                        value={searchTemplate}
                        onChange={handleSearchChange}
                        className="bg-white/80 border-gray-200/60 rounded-lg focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 h-[clamp(2rem,4vw,2.5rem)] pl-8 text-[var(--sidebar-text-sm)]"
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleShowTemplateBuilder}
                          className="rounded-lg border-gray-200/60 hover:bg-blue-50/80 hover:border-blue-300/60 transition-all duration-300 h-[clamp(2rem,4vw,2.5rem)] w-[clamp(2rem,4vw,2.5rem)] flex-shrink-0"
                        >
                          <Plus className="h-[calc(var(--icon-size)*0.8)] w-[calc(var(--icon-size)*0.8)]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900/90 backdrop-blur-sm text-white rounded-xl text-xs">
                        Create template
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <ScrollArea className="h-[clamp(10rem,30vh,15rem)] ios-scrollbar">
                    {loading ? (
                      <div className="flex items-center justify-center h-32 w-full">
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-blue-100/80 rounded-lg flex items-center justify-center w-[calc(var(--avatar-size)*0.8)] h-[calc(var(--avatar-size)*0.8)]">
                            <div className="animate-spin rounded-full border-2 border-blue-600 border-t-transparent h-[calc(var(--icon-size)*1.2)] w-[calc(var(--icon-size)*1.2)]"></div>
                          </div>
                          <p className="text-gray-600 text-[var(--sidebar-text-sm)]">Loading...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-red-100/80 rounded-lg flex items-center justify-center w-[calc(var(--avatar-size)*0.8)] h-[calc(var(--avatar-size)*0.8)]">
                            <X className="text-red-600 h-[var(--icon-size)] w-[var(--icon-size)]" />
                          </div>
                          <p className="text-red-600 text-[var(--sidebar-text-sm)]">{error}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-[calc(var(--sidebar-gap)*0.5)]">
                        {filteredTemplates.map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onClick={() => handleTemplateSelect(template)}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </AccordionSection>

                <AccordionSection
                  value="products"
                  icon={Package}
                  title="Products"
                  subtitle="Catalog"
                  color="purple"
                >
                  <ProductsTab
                    selectedConversationId={selectedConversationId}
                    onProductSelect={handleProductSelect}
                    onShareProduct={onShareProduct}
                  />
                </AccordionSection>

                <AccordionSection
                  value="analytics"
                  icon={BarChart3}
                  title="Analytics"
                  subtitle="Metrics"
                  color="green"
                >
                  {selectedConversationId ? (
                    <WhatsAppAnalyticsContent selectedConversationId={selectedConversationId} />
                  ) : (
                    <div className="space-y-[var(--sidebar-gap)]">
                      <AnalyticsCard
                        icon={Clock}
                        title="Response Time"
                        subtitle="Average"
                        value={analytics.responseTime}
                        color="blue"
                      />
                      <AnalyticsCard
                        icon={TrendingUp}
                        title="Resolution Rate"
                        subtitle="Success rate"
                        value={analytics.resolutionRate}
                        color="green"
                      />
                      <AnalyticsCard
                        icon={Users}
                        title="Satisfaction"
                        subtitle="Customer rating"
                        value={analytics.customerSatisfaction}
                        color="purple"
                      />

                      <div className="text-center mt-4 p-[var(--sidebar-padding)]">
                        <div className="bg-gray-100/80 rounded-2xl flex items-center justify-center mx-auto mb-2 w-[calc(var(--avatar-size)*1.2)] h-[calc(var(--avatar-size)*1.2)]">
                          <MessageSquare className="text-gray-500 h-[calc(var(--icon-size)*1.5)] w-[calc(var(--icon-size)*1.5)]" />
                        </div>
                        <p className="text-gray-600 leading-relaxed text-[var(--sidebar-text-sm)]">
                          Select a conversation to view detailed analytics
                        </p>
                      </div>
                    </div>
                  )}
                </AccordionSection>
              </Accordion>
            </div>
          </div>
        </ScrollArea>

        {selectedProduct && (
          <ProductPreview
            product={selectedProduct}
            onClose={handleProductClose}
            onShare={handleProductShare}
            open={!!selectedProduct}
          />
        )}
      </Card>
    </TooltipProvider>
  ), [
    showTemplateBuilder,
    handleCloseTemplateBuilder,
    templates,
    searchTemplate,
    selectedTemplate,
    selectedConversationId,
    handleCloseTemplate,
    showCustomerInfo,
    handleCloseCustomerInfo,
    conversation,
    contactEmail,
    saveCustomerInfo,
    onToggleVisibility,
    customerInitial,
    platformName,
    handleShowCustomerInfo,
    contactPhone,
    accordionValue,
    loading,
    error,
    filteredTemplates,
    handleTemplateSelect,
    handleProductSelect,
    onShareProduct,
    analytics,
    selectedProduct,
    handleProductClose,
    handleProductShare,
    handleSearchChange,
    handleShowTemplateBuilder
  ]);

  if (isMobile) {
    return <MobileOverlay>{sidebarContent}</MobileOverlay>;
  }

  return sidebarContent;
};

export default memo(Sidebar);
