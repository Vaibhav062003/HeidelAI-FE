import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductPreview from "./PreviewProduct";
import ProductsTab from "./Product";
import CustomerInfo from "./CustomerInfo";
import {
  User,
  Phone,
  IdCard,
  Tag,
  Search,
  Check,
  X,
  FileText,
  Package,
  ArrowLeftRight,
  Plus,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

import ConversationSummary from "./ConversationSummary";
import TemplateBuilders from "./TemplateBuilders";
import { WhatsAppTemplateDialog } from "./WhatsAppTemplateDialog";
import { WhatsAppTemplate } from "../types/template";
import { Conversation } from "../types/conversation";
import { Product } from "../types/product";
import AssignDropdown from "./AssignToAgent";
import api from "@/lib/session_api";
import AnalyticsSection from "./AnalyticsSection";
import { ApiContact } from "../types/contacts";

interface SidebarProps {
  selectedConversationId: string;
  onShareProduct: (product: Product) => void;
  onConversationSelect: (id: string) => void;
  onToggleVisibility?: () => void;
  conversation?: Conversation | null;
  currentAgentUsername: string;
}

const fluidStyles = `
  :root {
    --sidebar-padding: clamp(0.625rem, 1.5vw, 0.875rem);
    --sidebar-gap: clamp(0.375rem, 0.75vw, 0.5rem);
    --sidebar-text-sm: clamp(0.6875rem, 1.25vw, 0.8125rem);
    --sidebar-text-xs: clamp(0.5625rem, 0.9vw, 0.6875rem);
    --avatar-size: clamp(2rem, 3.5vw, 2.5rem);
    --icon-size: clamp(0.875rem, 1.5vw, 1rem);
  }
  .scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb { background: #cbd5e1; }
  .ios-scrollbar::-webkit-scrollbar { width: 3px; }
  .ios-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .ios-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 8px; transition: all 0.3s ease; }
  .ios-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
  * { min-width: 0; min-height: 0; }
`;

const ContactDetail = memo<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  text: string;
}>(({ icon: Icon, label, text }) => (
  <div className="flex items-start border-gray-100 last:border-0 gap-[calc(var(--sidebar-gap)*0.95)] py-[calc(var(--sidebar-gap)*1)]">
    <Icon className="text-gray-400 flex-shrink-0 mt-0.5 w-[calc(var(--icon-size)*0.85)] h-[calc(var(--icon-size)*0.85)]" />
    <div className="flex-1 min-w-0">
      <p className="text-gray-900 font-medium truncate text-[calc(var(--sidebar-text-xs)*0.95)]">
        {text}
      </p>
    </div>
  </div>
));
ContactDetail.displayName = "ContactDetail";

const TemplateCard = memo<{
  template: WhatsAppTemplate;
  onClick: () => void;
}>(({ template, onClick }) => (
  <Card
    onClick={onClick}
    className="cursor-pointer hover:shadow-sm transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-100/60 hover:border-gray-200/80 rounded-xl"
    style={{ padding: "calc(var(--sidebar-padding) * 0.65)" }}
  >
    <div className="flex items-center justify-between min-w-0 gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="font-medium text-gray-900 truncate block"
            style={{ fontSize: "var(--sidebar-text-xs)" }}
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
        style={{
          width: "calc(var(--icon-size) * 0.75)",
          height: "calc(var(--icon-size) * 0.75)",
        }}
      />
    </div>
  </Card>
));
TemplateCard.displayName = "TemplateCard";

const AccordionSection = memo<{
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
}>(({ value, icon: Icon, title, subtitle, color, children }) => (
  <AccordionItem
    value={value}
    className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden"
  >
    <AccordionTrigger className="hover:no-underline hover:bg-gray-50/60 transition-all duration-300 px-[var(--sidebar-padding)] py-[calc(var(--sidebar-padding)*0.5)]">
      <div className="flex items-center gap-[calc(var(--sidebar-gap)*0.75)]">
        <div
          className={`bg-${color}-100/80 rounded-lg flex items-center justify-center flex-shrink-0 w-[calc(var(--icon-size)*1.15)] h-[calc(var(--icon-size)*1.15)]`}
        >
          <Icon
            className={`text-${color}-600 w-[calc(var(--icon-size)*0.85)] h-[calc(var(--icon-size)*0.85)]`}
          />
        </div>
        <div className="text-left min-w-0 flex-1 flex items-center gap-2">
          <span className="font-semibold text-gray-900 truncate text-[calc(var(--sidebar-text-sm)*0.9)]">
            {title}
          </span>
          <p className="text-gray-500 truncate text-[calc(var(--sidebar-text-xs)*0.95)]">
            {subtitle}
          </p>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="p-0 bg-gray-50/30 data-[state=open]:flex-1 data-[state=open]:flex data-[state=open]:flex-col min-h-0">
      {children}
    </AccordionContent>
  </AccordionItem>
));
AccordionSection.displayName = "AccordionSection";

interface TagDropdownProps {
  assignedTags: string[];
  allTags: string[];
  isUpdatingTags: boolean;
  onToggleTag: (tag: string) => void;
  onRemoveTag: (
    tag: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const TagDropdown = memo<TagDropdownProps>(
  ({ assignedTags, allTags, isUpdatingTags, onToggleTag, onRemoveTag }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    }, [isOpen]);

    // Filter tags based on search
    const filteredTags = useMemo(() => {
      if (!searchQuery.trim()) return allTags;
      return allTags.filter((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [allTags, searchQuery]);

    const handleClearAll = useCallback(() => {
      assignedTags.forEach((tag) => onToggleTag(tag));
    }, [assignedTags, onToggleTag]);

    return (
      <div className="relative w-full" ref={dropdownRef}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={isUpdatingTags}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Tag className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />

                {assignedTags.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {assignedTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-sans text-xs font-medium border border-blue-100 max-w-[80px] truncate"
                        title={tag}
                      >
                        {tag}
                        <button
                          onClick={(e) => onRemoveTag(tag, e)}
                          disabled={isUpdatingTags}
                          className="hover:text-blue-900 transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}

                    {assignedTags.length > 2 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-sans text-xs font-semibold border border-blue-200 flex-shrink-0">
                        +{assignedTags.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-sans text-xs font-medium text-gray-500">
                    Assign tags
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {assignedTags.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-100">
                    {assignedTags.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white text-xs rounded-lg px-3 py-1.5">
            {assignedTags.length > 0
              ? `Manage ${assignedTags.length} tag${assignedTags.length > 1 ? "s" : ""
              }`
              : "Assign tags to this contact"}
          </TooltipContent>
        </Tooltip>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* Header with Search */}
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-sans text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Selected Tags Summary */}
              {assignedTags.length > 0 && (
                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                      Selected ({assignedTags.length})
                    </span>
                    <button
                      onClick={handleClearAll}
                      disabled={isUpdatingTags}
                      className="text-[10px] font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {assignedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-sans text-xs font-medium border border-blue-100 whitespace-nowrap flex-shrink-0"
                      >
                        {tag}
                        <button
                          onClick={(e) => onRemoveTag(tag, e)}
                          disabled={isUpdatingTags}
                          className="hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags List */}
            <div className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filteredTags.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-500">
                    {searchQuery ? "No matching tags" : "No tags available"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2">
                  {filteredTags.map((tag) => {
                    const isSelected = assignedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => onToggleTag(tag)}
                        disabled={isUpdatingTags}
                        className={`w-full px-3 py-2.5 mb-1 flex items-center gap-3 text-left rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isSelected
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                          }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 bg-white"
                            }`}
                        >
                          {isSelected && (
                            <Check
                              className="h-3.5 w-3.5 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className={`font-sans text-xs flex-1 transition-all ${isSelected
                            ? "font-semibold text-blue-700"
                            : "font-medium text-gray-700"
                            }`}
                        >
                          {tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredTags.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span className="font-medium">
                    {filteredTags.length} tag
                    {filteredTags.length > 1 ? "s" : ""} available
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
TagDropdown.displayName = "TagDropdown";

const Sidebar = ({
  selectedConversationId,
  onShareProduct,
  conversation: passedConversation,
  onToggleVisibility,
  currentAgentUsername,
}: SidebarProps) => {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [accordionValue, setAccordionValue] = useState("summary");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WhatsAppTemplate | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [allTags, setAllTags] = useState<string[]>([]);
  const [assignedTags, setAssignedTags] = useState<string[]>([]);
  const [isUpdatingTags, setIsUpdatingTags] = useState(false);

  // Fetch contact tags
  const fetchContactTags = useCallback(async () => {
    if (!selectedConversationId) return;

    try {
      const response = await api.get("/api/contacts");
      if (!response.data || !Array.isArray(response.data.contacts)) return;

      const currentContact = response.data.contacts.find(
        (contact: ApiContact) =>
          contact.conversation_id === selectedConversationId
      );

      if (currentContact) {
        const tags = currentContact.categories || [];
        setAssignedTags(tags);
      } else {
        setAssignedTags([]);
      }
    } catch (error) {
      console.error("Error fetching contact tags:", error);
      setAssignedTags([]);
    }
  }, [selectedConversationId]);

  // Sync conversation data
  useEffect(() => {
    if (passedConversation) {
      setConversation(passedConversation);
      const currentTags = passedConversation.categories || [];
      setAssignedTags(currentTags);
    }
  }, [passedConversation]);

  // Fetch tags when conversation changes
  useEffect(() => {
    fetchContactTags();
  }, [selectedConversationId, fetchContactTags]);

  // Fetch all available tags
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await api.get<{ tags: string[] }>(
          "/api/org/metadata/tags"
        );
        setAllTags(response.data.tags || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchAllTags();
  }, []);

  // Handle tag toggle
  const handleToggleTag = useCallback(
    async (tag: string) => {
      setAssignedTags((prev) => {
        const isCurrentlySelected = prev.includes(tag);
        return isCurrentlySelected
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
      });

      setIsUpdatingTags(true);

      try {
        const newTags = assignedTags.includes(tag)
          ? assignedTags.filter((t) => t !== tag)
          : [...assignedTags, tag];

        const response = await api.post("/api/contacts/update-categories", {
          conversation_id: selectedConversationId,
          categories: newTags,
        });

        if (response.status === 200 || response.data?.success) {
          setConversation((prev) =>
            prev ? { ...prev, categories: newTags } : prev
          );
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (error) {
        console.error("Error updating tags:", error);
        // Revert on error
        setAssignedTags((prev) => {
          const isCurrentlySelected = prev.includes(tag);
          return isCurrentlySelected
            ? [...prev, tag]
            : prev.filter((t) => t !== tag);
        });
      } finally {
        setIsUpdatingTags(false);
      }
    },
    [assignedTags, selectedConversationId]
  );

  // Handle tag removal
  const handleRemoveTag = useCallback(
    async (tag: string, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      await handleToggleTag(tag);
    },
    [handleToggleTag]
  );

  useEffect(() => {
    const loadTemplates = async () => {
      const cached = sessionStorage.getItem("whatsapp_templates");
      if (cached) {
        try {
          setTemplates(JSON.parse(cached));
          return;
        } catch (e) {
          console.error("Cache parse error:", e);
        }
      }

      setLoading(true);
      try {
        const response = await fetch("/api/fetchTemplate");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result?.data) {
          setTemplates(result.data);
          sessionStorage.setItem(
            "whatsapp_templates",
            JSON.stringify(result.data)
          );
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

  const handleProductShare = useCallback(
    (product: Product) => {
      onShareProduct(product);
      setSelectedProduct(null);
    },
    [onShareProduct]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTemplate(e.target.value);
    },
    []
  );

  const handleShowCustomerInfo = useCallback(
    () => setShowCustomerInfo(true),
    []
  );
  const handleShowTemplateBuilder = useCallback(
    () => setShowTemplateBuilder(true),
    []
  );
  const handleCloseTemplateBuilder = useCallback(
    () => setShowTemplateBuilder(false),
    []
  );
  const handleCloseTemplate = useCallback(() => setSelectedTemplate(null), []);
  const handleProductClose = useCallback(() => setSelectedProduct(null), []);

  const saveCustomerInfo = useCallback(
    async (updatedData: {
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );
        if (!response.ok) throw new Error("Failed to update customer info");
      } catch (error) {
        console.error("Error updating customer info:", error);
        throw error;
      }
    },
    [selectedConversationId]
  );

  const filteredTemplates = useMemo(
    () =>
      templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTemplate.toLowerCase()) &&
          template.status === "APPROVED"
      ),
    [templates, searchTemplate]
  );

  const contactPhone = useMemo(
    () => selectedConversationId?.split("_")[1] || "Not Available",
    [selectedConversationId]
  );

  const contactEmail = useMemo(
    () => conversation?.email || "Not Available",
    [conversation?.email]
  );

  const customerInitial = useMemo(
    () => conversation?.customer_name?.charAt(0).toUpperCase() || "U",
    [conversation?.customer_name]
  );

  const accordionSections = useMemo(
    () => [
      {
        value: "summary",
        icon: FileText,
        title: "Summary",
        subtitle: "Insights",
        color: "orange",
        content: (
          <ConversationSummary
            selectedConversationId={selectedConversationId}
          />
        ),
      },
      {
        value: "templates",
        icon: MessageSquare,
        title: "Templates",
        subtitle: "Messages",
        color: "blue",
        content: (
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-white/50 min-h-[250px]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-700" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/50 backdrop-blur-sm rounded-full border border-indigo-200/50 mb-4 mx-auto">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Under Development</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Coming Soon
              </h3>

              <p className="text-[var(--sidebar-text-sm)] text-slate-600 leading-relaxed max-w-[180px] mx-auto">
                Powerful messaging templates are arriving soon to streamline your conversations.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-medium text-slate-500">
                <div className="w-3 h-3 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <span>ETA: FEB 2026</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        value: "products",
        icon: Package,
        title: "Products",
        subtitle: "Catalog",
        color: "purple",
        content: (
          <ProductsTab
            selectedConversationId={selectedConversationId}
            onProductSelect={handleProductSelect}
            onShareProduct={onShareProduct}
          />
        ),
      },
      {
        value: "analytics",
        icon: ArrowLeftRight,
        title: "Transfers",
        subtitle: "Metrics",
        color: "green",
        content: (
          <AnalyticsSection
            selectedConversationId={selectedConversationId}
            currentAgentUsername={currentAgentUsername}
          />
        ),
      },
    ],
    [
      selectedConversationId,
      currentAgentUsername,
      handleProductSelect,
      onShareProduct,
    ]
  );

  const orderedSections = useMemo(() => {
    if (!accordionValue) return accordionSections;
    const activeSection = accordionSections.find(
      (s) => s.value === accordionValue
    );
    const otherSections = accordionSections.filter(
      (s) => s.value !== accordionValue
    );
    return activeSection
      ? [activeSection, ...otherSections]
      : accordionSections;
  }, [accordionValue, accordionSections]);

  return (
    <TooltipProvider>
      <style>{fluidStyles}</style>

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
          onSend={handleCloseTemplate}
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

      <Card className="h-full max-h-screen bg-white/95 backdrop-blur-sm flex flex-col border-l border-gray-200/60 shadow-lg">
        {/* Header */}
        <div className="bg-white/40 backdrop-blur-sm border-b border-gray-200 flex-shrink-0 flex items-center justify-between px-[var(--sidebar-padding)] py-2">
          <h2 className="font-semibold text-gray-900 text-sm">Contact</h2>
          {onToggleVisibility && (
            <Button
              onClick={onToggleVisibility}
              variant="ghost"
              size="icon"
              className="bg-white/60 hover:bg-white/90 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center h-8 w-8"
              aria-label="Hide details sidebar"
            >
              <X className="text-gray-600 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 ios-scrollbar min-h-0">
          {/* Customer Profile Section */}
          <div className="bg-white p-[var(--sidebar-padding)]">
            {/* Customer Header */}
            <div className="flex items-start gap-[var(--sidebar-gap)] pb-3.5 mb-3.5 border-b border-gray-200">
              {/* Avatar */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 w-[calc(var(--avatar-size)*0.95)] h-[calc(var(--avatar-size)*0.95)] shadow-md">
                  <span className="text-white font-semibold text-[calc(var(--sidebar-text-sm)*0.85)]">
                    {customerInitial}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3
                    className="font-bold text-gray-900 truncate flex-1 leading-tight"
                    style={{ fontSize: "var(--sidebar-text-sm)" }}
                  >
                    {conversation?.customer_name || "Unknown"}
                  </h3>

                  {/* View Details Button with Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleShowCustomerInfo}
                        className="text-gray-400 hover:text-blue-600 transition-all duration-200 p-1.5 hover:bg-blue-50/80 rounded-lg group flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-[15px] h-[15px] group-hover:scale-110 transition-transform"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="bg-gray-900 text-white text-xs px-2.5 py-1.5"
                    >
                      Customer details
                    </TooltipContent>
                  </Tooltip>
                </div>

                <ContactDetail
                  icon={conversation?.platform === "whatsapp" ? Phone : IdCard}
                  label="Phone"
                  text={contactPhone}
                />
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-3">
              {/* Tags */}
              <div className="group">
                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">
                  Tags
                </label>
                <TagDropdown
                  assignedTags={assignedTags}
                  allTags={allTags}
                  isUpdatingTags={isUpdatingTags}
                  onToggleTag={handleToggleTag}
                  onRemoveTag={handleRemoveTag}
                />
              </div>

              {/* Assigned Agent */}
              <div className="group">
                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">
                  Assigned Agent
                </label>
                <AssignDropdown />
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex-1 flex flex-col">
            <Accordion
              type="single"
              collapsible
              value={accordionValue}
              onValueChange={setAccordionValue}
              className="w-full flex-1 flex flex-col"
            >
              {orderedSections.map((section) => (
                <AccordionSection
                  key={section.value}
                  value={section.value}
                  icon={section.icon}
                  title={section.title}
                  subtitle={section.subtitle}
                  color={section.color}
                >
                  {section.content}
                </AccordionSection>
              ))}
            </Accordion>
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
  );
};

export default memo(Sidebar);
