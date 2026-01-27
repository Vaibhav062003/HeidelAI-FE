import { Plus, Search, LayoutTemplate, FileText, Loader2 } from "lucide-react";
import useTemplates from "./hooks/fetchTemplate";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { memo, useCallback, useEffect, useState } from "react";
import { WhatsAppTemplateDialog } from "../WhatsAppTemplateDialog";
import TemplateBuilders from "../TemplateBuilders";
import { WhatsAppTemplate } from "../../types/template";
const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="px-3 py-6 text-xs text-gray-400 text-center border-2 border-dashed border-gray-50 rounded-xl">
        {message}
    </div>
);

const TemplateCard = memo(({ template, onClick }: { template: any; onClick: (t: any) => void }) => (
    <Card
        className="mb-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50 group border-gray-100 shadow-sm"
        onClick={() => onClick(template)}
    >
        <CardHeader className="p-3">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary/10 transition-colors">
                    <FileText className="h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-xs font-medium text-gray-700 leading-tight">
                    {template.name}
                </CardTitle>
            </div>
        </CardHeader>
    </Card>
));
TemplateCard.displayName = "TemplateCard";

const FetchTemplates = ({ selectedConversationId }: { selectedConversationId?: string }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading } = useTemplates({ enabled: isOpened || searchQuery.length > 0 });
    const isAdmin = useRole();
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
    const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
    const [searchTemplate, setSearchTemplate] = useState("");
    const [accordionValue, setAccordionValue] = useState<string[]>([]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setAccordionValue(["prebuilt", "user"]);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (data) {
            setTemplates(data);
        }
    }, [data]);

    const filteredData = data?.filter((t: any) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const prebuilt = filteredData?.filter((t: any) => t.type === "PREBUILT");
    const userCreated = filteredData?.filter((t: any) => t.type === "USER_CREATED");

    const handleTemplateClick = useCallback((template: any) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
    }, []);

    return (
        <div className="flex flex-col gap-4 py-2">
            {/* Search */}
            <div className="flex flex-row px-4">
                <div className="relative group flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-9 h-9 text-sm bg-gray-50/50 border-gray-100 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="pl-2">
                    {isAdmin && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-9 w-9 border-gray-100 hover:bg-primary/5 hover:text-primary transition-colors"
                                    onClick={() => setIsTemplateBuilderOpen(true)}
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add new template</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className="px-4 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                <Accordion
                    type="multiple"
                    value={accordionValue}
                    onValueChange={(value) => {
                        setAccordionValue(value);
                        if (value.length > 0) setIsOpened(true);
                    }}
                    className="w-full space-y-2"
                >
                    {/* Prebuilt Templates */}
                    <AccordionItem value="prebuilt" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                            Prebuilt Templates
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            {isLoading ? (
                                <LoadingState />
                            ) : prebuilt?.length ? (
                                prebuilt.map((template: any) => (
                                    <TemplateCard key={template.id} template={template} onClick={handleTemplateClick} />
                                ))
                            ) : (
                                <EmptyState message="No prebuilt templates found" />
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* User Created Templates */}
                    <AccordionItem value="user" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                            Your Templates
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            {isLoading ? (
                                <LoadingState />
                            ) : userCreated?.length ? (
                                userCreated.map((template: any) => (
                                    <TemplateCard key={template.id} template={template} onClick={handleTemplateClick} />
                                ))
                            ) : (
                                <EmptyState message="No custom templates yet" />
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <WhatsAppTemplateDialog
                template={selectedTemplate}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                selectedConversationId={selectedConversationId}
            />

            <TemplateBuilders
                isOpen={isTemplateBuilderOpen}
                setIsOpen={setIsTemplateBuilderOpen}
                templates={templates}
                setTemplates={setTemplates}
                searchTemplate={searchTemplate}
                setSearchTemplate={setSearchTemplate}
            />
        </div>
    );
};

export default FetchTemplates;
