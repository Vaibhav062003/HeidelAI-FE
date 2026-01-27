"use client";

import React, { useMemo } from "react";
import useTemplates from "./hooks/fetchTemplate";
import { WhatsAppTemplate } from "@/components/types/template";
import {
    CircleAlert,
    Sparkles,
    Layers,
    ChevronDown,
    MessageSquare,
    Search,
    Plus
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TemplatePreview, PreviewButton } from "../templateUI/TemplatePreview";
import { Button as TemplateButton } from "@/components/types/template_types";
import { Input } from "@/components/ui/input";
import { useRole } from "@/contexts/RoleContext";
import TemplateBuilders from "../TemplateBuilders";

const FetchTemplates = () => {
    const { data: templates, isLoading, error } = useTemplates();
    const [allTemplates, setAllTemplates] = React.useState<WhatsAppTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = React.useState<WhatsAppTemplate | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isBuilderOpen, setIsBuilderOpen] = React.useState(false);
    const { isAdmin } = useRole();

    React.useEffect(() => {
        if (templates) {
            setAllTemplates(templates);
        }
    }, [templates]);

    // Mock formatting function for TemplatePreview
    const getFormatedText = (text: string, type: "header" | "body") => {
        if (!text) return "";
        // Basic formatting logic similar to build
        let formatted = text
            .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
            .replace(/_(.*?)_/g, "<em>$1</em>")
            .replace(/~(.*?)~/g, "<del>$1</del>")
            .replace(/```(.*?)```/g, "<code>$1</code>");

        if (type === "body") return formatted;
        return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const handleSelectTemplate = (template: WhatsAppTemplate) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
    };

    const normalizedPreviewData = useMemo(() => {
        if (!selectedTemplate) return null;

        const components = selectedTemplate.components || [];
        const headerComp = components.find(c => c.type === 'HEADER');
        const bodyComp = components.find(c => c.type === 'BODY');
        const footerComp = components.find(c => c.type === 'FOOTER');
        const buttonsComp = components.find(c => c.type === 'BUTTONS');

        // Extract Header
        let headerContent = headerComp?.text || "";
        let headerType = (headerComp?.format?.toLowerCase() as any) || "none";

        if (!headerContent && selectedTemplate.header) {
            if (typeof selectedTemplate.header === 'string') {
                headerContent = selectedTemplate.header;
                headerType = "text";
            } else if (typeof selectedTemplate.header === 'object') {
                headerContent = (selectedTemplate.header as any).content || "";
                headerType = (selectedTemplate.header as any).type?.toLowerCase() || "none";
            }
        }

        // Extract Body
        let messageBody = bodyComp?.text || selectedTemplate.body || "";

        // Handle Variable Replacement in Body
        const bodyParams = (selectedTemplate as any).body_params;
        if (Array.isArray(bodyParams)) {
            bodyParams.forEach((param, index) => {
                const placeholder = `{{${index + 1}}}`;
                messageBody = messageBody.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), param);
            });
        }

        // Extract Footer
        const footerText = footerComp?.text || selectedTemplate.footer || "";

        // Extract Buttons
        let buttons: PreviewButton[] = [];
        if (buttonsComp?.buttons) {
            buttons = buttonsComp.buttons.map((b, i) => ({ id: i.toString(), text: b.text }));
        } else {
            const rawButtons = (selectedTemplate as any).buttons || (selectedTemplate as any).button;
            if (Array.isArray(rawButtons)) {
                buttons = rawButtons.map((b, i) => ({ id: i.toString(), text: b.text }));
            } else if (rawButtons && typeof rawButtons === 'object') {
                buttons = [{ id: '0', text: (rawButtons as any).text }];
            }
        }

        return {
            headerType,
            headerContent,
            messageBody,
            footer: footerText,
            buttons
        };
    }, [selectedTemplate]);

    const groupedTemplates = useMemo(() => {
        if (!allTemplates) return { prebuilt: [], custom: [] };

        const filtered = allTemplates.filter((t: WhatsAppTemplate) =>
            t.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
            prebuilt: filtered.filter((t: WhatsAppTemplate) => t.type === 'PREBUILT'),
            custom: filtered.filter((t: WhatsAppTemplate) => t.type === 'USER_CREATED'),
        };
    }, [allTemplates, searchQuery]);

    const getStatusColor = (status?: string) => {
        const s = status?.toUpperCase() || "";
        switch (s) {
            case "APPROVED": return "bg-green-500/10 text-green-600 border-green-200";
            case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "REJECTED": return "bg-red-500/10 text-red-600 border-red-200";
            default: return "bg-gray-500/10 text-gray-600 border-gray-200";
        }
    };

    const TemplateItem = ({ template }: { template: WhatsAppTemplate }) => (
        <div className="flex items-center justify-between w-full gap-3 py-0.5">
            <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate text-xs font-medium text-gray-700">
                    {template.name?.replace(/_/g, ' ') || 'Unnamed'}
                </span>
            </div>
            <Badge
                variant="outline"
                className={cn("h-4 px-1 text-[9px] font-medium border rounded-full shrink-0", getStatusColor(template.status))}
            >
                {template.status?.toLowerCase() || 'unknown'}
            </Badge>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 p-3 bg-white/50 backdrop-blur-sm rounded-xl">
            {/* Search and Add Section */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 pl-8 text-xs bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-100"
                    />
                </div>
                {isAdmin && (
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600 shrink-0"
                        onClick={() => setIsBuilderOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <div className="h-9 w-full bg-gray-100 animate-pulse rounded-md" />
                    <div className="h-9 w-full bg-gray-100 animate-pulse rounded-md" />
                </div>
            ) : error ? (
                <div className="p-4 text-center">
                    <CircleAlert className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Failed to load templates</p>
                </div>
            ) : (
                <>
                    {/* Custom Templates Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            Custom Templates
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-9 justify-between text-xs font-normal border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all px-3"
                                >
                                    <span className="text-gray-500">Select custom template...</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]" align="start">
                                <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-tight px-2 py-1.5">
                                    Available Custom Templates
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup className="max-h-[300px] overflow-y-auto p-1">
                                    {groupedTemplates.custom.length > 0 ? (
                                        groupedTemplates.custom.map((t: WhatsAppTemplate) => (
                                            <DropdownMenuItem
                                                key={t.id || t.name}
                                                className="focus:bg-blue-50 cursor-pointer rounded-md"
                                                onSelect={() => handleSelectTemplate(t)}
                                            >
                                                <TemplateItem template={t} />
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center italic text-gray-400 text-[10px]">
                                            No custom templates found
                                        </div>
                                    )}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Prebuilt Templates Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                            <Layers className="w-3 h-3 text-purple-500" />
                            Prebuilt Templates
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-9 justify-between text-xs font-normal border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all px-3"
                                >
                                    <span className="text-gray-500">Select prebuilt template...</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]" align="start">
                                <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-tight px-2 py-1.5">
                                    Prebuilt Library
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup className="max-h-[300px] overflow-y-auto p-1">
                                    {groupedTemplates.prebuilt.length > 0 ? (
                                        groupedTemplates.prebuilt.map((t: WhatsAppTemplate) => (
                                            <DropdownMenuItem
                                                key={t.id || t.name}
                                                className="focus:bg-purple-50 cursor-pointer rounded-md"
                                                onSelect={() => handleSelectTemplate(t)}
                                            >
                                                <TemplateItem template={t} />
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center italic text-gray-400 text-[10px]">
                                            No prebuilt templates found
                                        </div>
                                    )}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            )}
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Custom Templates
                </label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-9 justify-between text-xs font-normal border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all px-3"
                        >
                            <span className="text-gray-500">Select custom template...</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]" align="start">
                        <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-tight px-2 py-1.5">
                            Available Custom Templates
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto p-1">
                            {groupedTemplates.custom.length > 0 ? (
                                groupedTemplates.custom.map((t: WhatsAppTemplate) => (
                                    <DropdownMenuItem
                                        key={t.id || t.name}
                                        className="focus:bg-blue-50 cursor-pointer rounded-md"
                                        onSelect={() => handleSelectTemplate(t)}
                                    >
                                        <TemplateItem template={t} />
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="p-4 text-center italic text-gray-400 text-[10px]">
                                    No custom templates found
                                </div>
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Prebuilt Templates Dropdown */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                    <Layers className="w-3 h-3 text-purple-500" />
                    Prebuilt Templates
                </label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-9 justify-between text-xs font-normal border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all px-3"
                        >
                            <span className="text-gray-500">Select prebuilt template...</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]" align="start">
                        <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-tight px-2 py-1.5">
                            Prebuilt Library
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto p-1">
                            {groupedTemplates.prebuilt.length > 0 ? (
                                groupedTemplates.prebuilt.map((t: WhatsAppTemplate) => (
                                    <DropdownMenuItem
                                        key={t.id || t.name}
                                        className="focus:bg-purple-50 cursor-pointer rounded-md"
                                        onSelect={() => handleSelectTemplate(t)}
                                    >
                                        <TemplateItem template={t} />
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="p-4 text-center italic text-gray-400 text-[10px]">
                                    No prebuilt templates found
                                </div>
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden gap-0">
                    <DialogHeader className="p-4 border-b bg-gray-50/50">
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            {selectedTemplate?.name?.replace(/_/g, ' ') || 'Template Preview'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 bg-white overflow-y-auto max-h-[60vh]">
                        {selectedTemplate && normalizedPreviewData && (
                            <TemplatePreview
                                headerType={normalizedPreviewData.headerType}
                                headerContent={normalizedPreviewData.headerContent}
                                previewFile={null}
                                messageBody={normalizedPreviewData.messageBody}
                                footer={normalizedPreviewData.footer}
                                button={normalizedPreviewData.buttons}
                                getFormatedText={getFormatedText}
                                templateType={selectedTemplate.template || 'custom'}
                                templateName={selectedTemplate.name}
                                language={selectedTemplate.language}
                                setLanguage={() => { }}
                                languages={[selectedTemplate.language]}
                                codeDeliveryMethod="copy_code"
                                setCodeDeliveryMethod={() => { }}
                                addSecurityRecommendation={false}
                                setAddSecurityRecommendation={() => { }}
                                addExpirationTime={false}
                                setAddExpirationTime={() => { }}
                                validityPeriod=""
                                setValidityPeriod={() => { }}
                                autofillText=""
                                setAutofillText={() => { }}
                                copyCodeText=""
                                setCopyCodeText={() => { }}
                                apps={[]}
                                setApps={() => { }}
                                customValidityPeriod={false}
                                setCustomValidityPeriod={() => { }}
                                validityPeriods={[]}
                            />
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-gray-50/50 border-t flex-row gap-2 mt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setIsPreviewOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                                console.log("Sending template:", selectedTemplate?.name);
                                setIsPreviewOpen(false);
                            }}
                        >
                            Send Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Template Builder Dialog */}
            <TemplateBuilders
                isOpen={isBuilderOpen}
                setIsOpen={setIsBuilderOpen}
                templates={allTemplates}
                setTemplates={setAllTemplates}
                searchTemplate={searchQuery}
                setSearchTemplate={setSearchQuery}
            />
        </div>
    );
};

export default FetchTemplates;