import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea} from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import {
  FileText,
  Package,
  BarChart3,
  Plus,
  TrendingUp,
  Clock,
  Users,
  Send,
  ExternalLink,
} from "lucide-react";
import ConversationSummary from "./ConversationSummary";
import { WhatsAppTemplate } from "../types/template";
import TemplateBuilders from "./TemplateBuilders";
import { WhatsAppTemplateDialog } from "./WhatsAppTemplateDialog";




interface SidebarProps {
  products?: Array<{
    id: string;
    name: string;
    price: string;
    image: string;
    url?: string;
  }>;
  analytics?: {
    responseTime: string;
    resolutionRate: string;
    customerSatisfaction: string;
  };
}

const Sidebar = ({
  // templates = [
  //   { id: "1", title: "Order Status Update", category: "Support" },
  //   { id: "2", title: "Product Information", category: "Sales" },
  //   { id: "3", title: "Welcome Message", category: "Greeting" },
  // ],

  products = [
    {
      id: "1",
      name: "Premium Package",
      price: "$99.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      url: "https://example.com/products/premium-package",
    },
    {
      id: "2",
      name: "Basic Bundle",
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      url: "https://example.com/products/basic-bundle",
    },
  ],
  analytics = {
    responseTime: "2m 30s",
    resolutionRate: "94%",
    customerSatisfaction: "4.8/5",
  },
}: SidebarProps) => {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase()),
  );

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
  
        const response = await fetch('/api/fetchTemplate');
        console.log("Response:", response);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        
        if (result && result.data){
          setTemplates(result.data);
        }else {
          console.error("Invalid response format:", result);
          setError("Invalid response format from server");
        }
        
      } catch (err) {
        console.error("Error in fetch:", err);
        setError(err instanceof Error ? err.message : "Fetch error");
      } finally {
        setLoading(false);
      
      }
    };
    loadTemplates();
  }, []);

  const filteredTemplates = (templates || []).filter((template) =>
    template.name.toLowerCase().includes(searchTemplate.toLowerCase()) && template.status === 'APPROVED' //added condition
);

  
  return (

      
    <TooltipProvider>
      {selectedTemplate && (
        <WhatsAppTemplateDialog
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onSend={() => {
          // Handle send logic
          console.log("Sending template:", selectedTemplate);
          setSelectedTemplate(null);
    }}
      />
      )}
     
      <Card className="h-[550px] w-[430px] bg-white border-l">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">
              <FileText className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="p-4 h-full">
          <div className="h-full">
            <ConversationSummary />
          </div>
          </TabsContent>

          <TabsContent value="templates" className="p-4">
            {showTemplateBuilder ? (
              <div className=" space-y-4">
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
                <ScrollArea className="h-[400px]">
                    {loading ?(
                      <div className="flex items-center justify-center h-20">
                        <p>Loading templates...</p>
                      </div>
                    ): error ?(
                      <div className="flex items-center justify-center h-20 text-red-500">
                      {error}
                    </div>
                    ):(
                      filteredTemplates.map((template) => (
                        <Card 
                        onClick={() => setSelectedTemplate(template)}
                        key={template.id}
                        className="p-3 mb-3 cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-semibold max-w-[150px] block">
                                  {template.name}
                              </span>
                            </TooltipTrigger>
                            {/* <TooltipContent>{template.name}</TooltipContent> */}
                          </Tooltip>
                        </div>
                        </Card>
                      )
                    ))}
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="products" className="p-4">
            <div className="mb-4">
              <Input
                placeholder="Search products..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full"
              />
            </div>
            <ScrollArea className="h-[400px]">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.price}</p>
                      <div className="flex gap-2 mt-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(product.url, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" /> View
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Open product page</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const productLink = `Check out ${product.name}: ${product.url}`;
                                console.log("Share product:", productLink);
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" /> Share
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share in chat</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="p-4">
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Avg Response Time</h3>
                </div>
                <p className="text-2xl font-bold">{analytics.responseTime}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Resolution Rate</h3>
                </div>
                <p className="text-2xl font-bold">{analytics.resolutionRate}</p>
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
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </TooltipProvider>
  );
};

export default Sidebar;
