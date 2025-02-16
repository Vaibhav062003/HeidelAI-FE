import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddProduct from "@/components/inbox/AddProduct";
import ProductList from "@/components/inbox/ProductList";
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
import { Badge } from "@/components/ui/badge";
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
  Search,
  Plus,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  Send,
  ExternalLink,
  Link,
} from "lucide-react";
import TemplateBuilder from "./TemplateBuilder";
import ConversationSummary from "./ConversationSummary";

interface SidebarProps {
  templates?: Array<{ id: string; title: string; category: string }>;
  products?: Array<{
    id: string;
    name: string;
    price: string;
    image: string;
    url?: string;
    title: string;
    category: string;
    metadata?: Metadata; // Adding the Metadata interface here
  }>;
  analytics?: {
    responseTime: string;
    resolutionRate: string;
    customerSatisfaction: string;
  };
}

const Sidebar = ({
  templates = [
    { id: "1", title: "Order Status Update", category: "Support" },
    { id: "2", title: "Product Information", category: "Sales" },
    { id: "3", title: "Welcome Message", category: "Greeting" },
  ],
  analytics = {
    responseTime: "2m 30s",
    resolutionRate: "94%",
    customerSatisfaction: "4.8/5",
  },
}: SidebarProps) => {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter templates based on the search input
  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchTemplate.toLowerCase())
  );

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
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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
    const filtered = products.filter((products) => {
      const matchesSearch =
        products.metadata.name &&
        products.metadata.name
          .toLowerCase()
          .includes(searchProduct.toLowerCase());

      // Apply category filter
      const matchesCategory =
        selectedCategory === "All" || products.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchProduct, selectedCategory, products]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleOptionSelect = (platform) => {
    setSelectedPlatform(platform);
    setShowForm(true);
    setShowOptions(false);
  };

  return (
    <TooltipProvider>
      {/* Toggle Button */}
      {/* <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed right-4 top-9 p-2 rounded-lg bg-gray-100 hover:bg-gray-300 transition-colors z-50 shadow-sm"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <span className="text-xl">☰</span>
        )}
      </button> */}

      {/* Collapsible Sidebar Card */}
      <Card className="fixed right-0 top-0 h-[725px] w-[380px] bg-white border-l shadow-xl z-40">

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-4 gap-2 px-4 bg-gray-50 rounded-lg border p-1.5 h-[50px]">
            <TabsTrigger
              value="summary"
              className="col-span-1 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              Summary
            </TabsTrigger>

            <TabsTrigger
              value="templates"
              className="col-span-1 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>

            <TabsTrigger
              value="products"
              className="col-span-1 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>

            <TabsTrigger
              value="collaboration"
              className="col-span-1 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="p-12 h-full">
            <ConversationSummary />
          </TabsContent>

          <TabsContent value="templates" className="p-4">
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
                <TemplateBuilder
                  onSave={(template) => {
                    console.log("Template saved:", template);
                    setShowTemplateBuilder(false);
                  }}
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
                <ScrollArea className="h-[700px]">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="p-3 mb-3 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{template.title}</span>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                    </Card>
                  ))}
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab onProductSelect={setSelectedProduct} />
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
