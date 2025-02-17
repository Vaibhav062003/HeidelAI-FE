import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddProduct from "@/components/inbox/AddProduct";
import ProductPreview from "./PreviewProduct";
import ProductsTab from "./Product";
import { X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

interface Metadata {
  category: string;
  description: string;
  images: string;
  name: string;
  on_sale: string; // Use boolean if the data contains `true/false` instead of `"True"/"False"`
  permalink: string;
  price: number;
  product_id: number;
  purchasable: string; // Use boolean if the data contains `true/false`
  regular_price: string; // Use `number` if parsed as numeric values
  sale_price: string; // Use `number` if parsed as numeric values
  slug: string;
  stock_quantity: number;
}

interface Product {
  id: string;
  category: string;
  metadata: Metadata;
}

type PlatformType = "pinecone" | "shopify" | "other";

interface SidebarProps {
  selectedConversationId?: string;
  onConversationSelect?: (id: string) => void;
  templates?: Array<{ id: string; title: string; category: string }>;
  products?: Array<Product>; // Update this line to use the main Product interface

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
  selectedConversationId,
  analytics = {
    responseTime: "2m 30s",
    resolutionRate: "94%",
    customerSatisfaction: "4.8/5",
  },
}: SidebarProps) => {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | "">("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/Dataset.json");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleAddProduct = () => {
  //   fetchProducts(); // Re-fetch products after adding a new one
  // };

  const toggleForm = () => setShowForm((prev) => !prev);

  // Filter products based on search term and category
  useEffect(() => {
    const filtered = products.filter((product: Product) => {
      const matchesSearch =
        product.metadata.name &&
        product.metadata.name
          .toLowerCase()
          .includes(searchProduct.toLowerCase());
  
      // Apply category filter
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
  
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchProduct, selectedCategory, products]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOptionSelect = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    setShowForm(true);
    setShowOptions(false);
  };

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);

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
     
     <Card className="h-full max-h-screen p-2 bg-white border-l">
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

          <TabsContent value="summary" className=" h-full">
          <div className="h-full">
            <ConversationSummary selectedConversationId={selectedConversationId}/>
          </div>
          </TabsContent>

          <TabsContent value="templates" className="p-4 h-full">
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
                <ScrollArea className="h-screen">
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

          <TabsContent className="h-full" value="products">
            <ProductsTab onProductSelect={(product: Product) => setSelectedProduct(product)} />
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
        {selectedProduct && (
          <ProductPreview
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Card>
    </TooltipProvider>
  );
};

export default Sidebar;
