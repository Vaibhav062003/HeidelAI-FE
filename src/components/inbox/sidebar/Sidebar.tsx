import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  IdCard,
  FileText,
  Package,
  ArrowLeftRight,
  MessageSquare,
  X,
} from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
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

// Hooks & Constants
import { useSidebarLogic } from "./hooks/useSidebarLogic";
import { FLUID_STYLES, ACCORDION_CONFIG } from "./constants";

import ProductPreview from "../PreviewProduct";
import ProductsTab from "../Product";
import CustomerInfo from "../CustomerInfo";
import ConversationSummary from "../ConversationSummary";
import TemplateBuilders from "../TemplateBuilders";
import { WhatsAppTemplateDialog } from "../WhatsAppTemplateDialog";
import AnalyticsSection from "../AnalyticsSection";
import AssignDropdown from "../AssignToAgent";

import ContactDetail from "./ContactDetail";
import AccordionSection from "./AccordionSection";
import TagDropdown from "./TagDropdown";

// Types & Libs
import { WhatsAppTemplate } from "@/components/types/template";
import { Conversation } from "@/components/types/conversation";
import { Product } from "@/components/types/product";
import { useApi } from "@/lib/session_api";
import { ApiContact } from "@/components/types/contacts";

interface SidebarProps {
  selectedConversationId: string;
  onShareProduct: (product: Product) => void;
  onConversationSelect: (id: string) => void;
  onToggleVisibility?: () => void;
  conversation?: Conversation | null;
  currentAgentUsername: string;
}

const Sidebar = ({
  selectedConversationId,
  onShareProduct,
  conversation: passedConversation,
  onToggleVisibility,
  currentAgentUsername,
}: SidebarProps) => {
  // 1. Logic Extracted to Hook
  const {
    conversation,
    allTags,
    assignedTags,
    templates,
    isUpdatingTags,
    handleToggleTag,
    saveCustomerInfo
  } = useSidebarLogic(selectedConversationId, passedConversation);

  // 2. UI State
  const [uiState, setUiState] = useState({
    showTemplateBuilder: false,
    showCustomerInfo: false,
    accordionValue: "summary",
    searchTemplate: "",
  });

  const [selectedData, setSelectedData] = useState<{
    product: Product | null;
    template: WhatsAppTemplate | null;
  }>({ product: null, template: null });

  // 3. UI Handlers
  const toggleUi = (key: keyof typeof uiState, value: any) => {
    setUiState(prev => ({ ...prev, [key]: value }));
  };

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedData(prev => ({ ...prev, product }));
  }, []);

  const handleProductShare = useCallback((product: Product) => {
    onShareProduct(product);
    setSelectedData(prev => ({ ...prev, product: null }));
  }, [onShareProduct]);

  const handleRemoveTag = useCallback((tag: string, event: React.MouseEvent) => {
    event.stopPropagation();
    handleToggleTag(tag);
  }, [handleToggleTag]);

  // 4. Derived Data
  const contactPhone = useMemo(() => 
    selectedConversationId?.replace(/^(instagram_|whatsapp_)/, "") || "Not Available", 
  [selectedConversationId]);

  const customerInitial = useMemo(() => 
    conversation?.customer_name?.charAt(0).toUpperCase() || "U", 
  [conversation?.customer_name]);

  // 5. Re-ordering Logic (RESTORED)
  // This ensures the open accordion item moves to the top of the list
  const orderedSections = useMemo(() => {
    if (!uiState.accordionValue) return ACCORDION_CONFIG;
    
    const activeSection = ACCORDION_CONFIG.find(
      (s) => s.value === uiState.accordionValue
    );
    const otherSections = ACCORDION_CONFIG.filter(
      (s) => s.value !== uiState.accordionValue
    );
    
    return activeSection 
      ? [activeSection, ...otherSections] 
      : ACCORDION_CONFIG;
  }, [uiState.accordionValue]);

  // 6. Render Logic for Accordion Content
  const renderAccordionContent = (sectionValue: string) => {
    switch (sectionValue) {
      case "summary":
        return <ConversationSummary selectedConversationId={selectedConversationId} />;
      case "templates":
        return (
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-white/50 min-h-[250px]">
             {/* Animated Background Elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl animate-pulse" />
               <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-700" />
             </div>
             <div className="relative z-10 text-center">
               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/50 backdrop-blur-sm rounded-full border border-indigo-200/50 mb-4 mx-auto">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Under Development</span>
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Coming Soon</h3>
               <p className="text-[var(--sidebar-text-sm)] text-slate-600 leading-relaxed max-w-[180px] mx-auto">
                 Powerful messaging templates are arriving soon.
               </p>
               <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-medium text-slate-500">
                 <div className="w-3 h-3 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                 <span>ETA: FEB 2026</span>
               </div>
             </div>
          </div>
        );
      case "products":
        return (
          <ProductsTab
            selectedConversationId={selectedConversationId}
            onProductSelect={handleProductSelect}
            onShareProduct={onShareProduct}
          />
        );
      case "analytics":
        return (
          <AnalyticsSection
            selectedConversationId={selectedConversationId}
            currentAgentUsername={currentAgentUsername}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <style>{FLUID_STYLES}</style>

      {/* --- Modals --- */}
      {uiState.showTemplateBuilder && (
        <TemplateBuilders
          isOpen={uiState.showTemplateBuilder}
          setIsOpen={(v) => toggleUi('showTemplateBuilder', v)}
          templates={templates}
          setTemplates={() => {}} 
          searchTemplate={uiState.searchTemplate}
          setSearchTemplate={(v) => toggleUi('searchTemplate', v)}
        />
      )}

      {selectedData.template && (
        <WhatsAppTemplateDialog
          template={selectedData.template}
          isOpen={!!selectedData.template}
          onClose={() => setSelectedData(prev => ({ ...prev, template: null }))}
          onSend={() => setSelectedData(prev => ({ ...prev, template: null }))}
          selectedConversationId={selectedConversationId}
          languageCode={selectedData.template.language}
        />
      )}

      <Dialog open={uiState.showCustomerInfo} onOpenChange={(v) => toggleUi('showCustomerInfo', v)}>
        <DialogContent className="max-w-4xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" /> Customer Information
            </DialogTitle>
          </DialogHeader>
          {conversation && (
            <CustomerInfo
              name={conversation.customer_name || "Not Saved"}
              email={conversation.email || "Not Available"}
              billingaddress={conversation.billingAddress || "Not Saved"}
              shippingaddress={conversation.shippingAddress || "Not Saved"}
              platform={conversation.platform || ""}
              selectedConversationId={selectedConversationId}
              saveCustomerInfo={saveCustomerInfo}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* --- Sidebar UI --- */}
      <Card className="h-full max-h-screen bg-white/95 backdrop-blur-sm flex flex-col border-l border-gray-200/60 shadow-lg">
        <div className="bg-white/40 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-[var(--sidebar-padding)] py-2">
          <h2 className="font-semibold text-gray-900 text-sm">Contact</h2>
          {onToggleVisibility && (
            <Button
              onClick={onToggleVisibility}
              variant="ghost"
              size="icon"
              className="bg-white/60 hover:bg-white/90 rounded-xl transition-all h-8 w-8"
            >
              <X className="text-gray-600 h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 ios-scrollbar min-h-0">
          <div className="bg-white p-[var(--sidebar-padding)]">
            {/* Header Profile */}
            <div className="flex items-start gap-[var(--sidebar-gap)] pb-3.5 mb-3.5 border-b border-gray-200">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center w-[calc(var(--avatar-size)*0.95)] h-[calc(var(--avatar-size)*0.95)] shadow-md">
                  <span className="text-white font-semibold text-[calc(var(--sidebar-text-sm)*0.85)]">{customerInitial}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3 className="font-bold text-gray-900 truncate flex-1 leading-tight" style={{ fontSize: "var(--sidebar-text-sm)" }}>
                    {conversation?.customer_name || "Unknown"}
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => toggleUi('showCustomerInfo', true)} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg group">
                        <User className="w-[15px] h-[15px]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Customer details</TooltipContent>
                  </Tooltip>
                </div>
                <ContactDetail icon={conversation?.platform === "whatsapp" ? Phone : IdCard} label="Phone" text={contactPhone} />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div className="group">
                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Tags</label>
                <TagDropdown
                  assignedTags={assignedTags}
                  allTags={allTags}
                  isUpdatingTags={isUpdatingTags}
                  onToggleTag={handleToggleTag}
                  onRemoveTag={handleRemoveTag}
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Assigned Agent</label>
                <AssignDropdown />
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex-1 flex flex-col">
            <Accordion 
              type="single" 
              collapsible 
              value={uiState.accordionValue} 
              onValueChange={(v) => toggleUi('accordionValue', v)} 
              className="w-full"
            >
              {/* Uses orderedSections instead of ACCORDION_CONFIG to enable sorting */}
              {orderedSections.map((section) => (
                <AccordionSection
                  key={section.value}
                  value={section.value}
                  icon={section.icon}
                  title={section.title}
                  subtitle={section.subtitle}
                  color={section.color}
                >
                  {renderAccordionContent(section.value)}
                </AccordionSection>
              ))}
            </Accordion>
          </div>
        </ScrollArea>

        {selectedData.product && (
          <ProductPreview
            product={selectedData.product}
            onClose={() => setSelectedData(prev => ({ ...prev, product: null }))}
            onShare={handleProductShare}
            open={!!selectedData.product}
          />
        )}
      </Card>
    </TooltipProvider>
  );
};

export default memo(Sidebar);