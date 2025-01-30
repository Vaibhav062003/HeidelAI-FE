import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddProduct from "@/components/inbox/AddProduct";
import ProductList from "@/components/inbox/ProductList";
import ProductPreview from "./PreviewProduct";
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
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [showForm, setShowForm] = useState(false);

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
      products.metadata.name.toLowerCase().includes(searchProduct.toLowerCase());

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


  return (
    <TooltipProvider>
      <Card className="h-[550px] w-[360px] bg-white border-l">
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

          <TabsContent
            value="products"
            className="p-2 bg-gradient-to-b from-white via-gray-100 to-white rounded-md shadow-sm"
          >
            <div className="mb-1 flex gap-2">
              <button
                className="bg-blue-500 text-white w-12 h-9 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-all self-start"
                onClick={toggleForm}
                aria-label="Add Product"
              >
                <span className="text-2xl font-bold">+</span>
              </button>

              {/* Conditionally render the AddProduct form */}
              {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <AddProduct closeForm={() => setShowForm(false)} />{" "}
                  {/* Pass closeForm */}
                </div>
              )}

              <Input
                placeholder="Search products..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-400 text-xs"
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[120px] bg-white text-gray-900 border border-gray-300 p-1 rounded-md text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="jewelery">Jewelry</SelectItem>
                  <SelectItem value="men's clothing">Men's Clothing</SelectItem>
                  <SelectItem value="women's clothing">
                    Women's Clothing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[450px] bg-gradient-to-r from-white to-gray-100 rounded-md p-2 overflow-auto shadow-md">
              <div className="grid grid-cols-1 gap-2">
                {loading && (
                  <p className="text-center text-xs font-medium text-gray-700">
                    Loading products...
                  </p>
                )}
                {error && (
                  <p className="text-center text-red-500 font-medium text-xs">
                    {error}
                  </p>
                )}
                {!loading && !error && filteredProducts.length === 0 && (
                  <p className="text-center text-xs font-medium text-gray-700">
                    No products found.
                  </p>
                )}
                {filteredProducts.map((product: any) => (
                  <Card
                    key={product.id}
                    className="p-1 bg-white shadow-sm rounded-md hover:shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center bg-gradient-to-t from-white via-gray-100 to-gray-200 p-1 rounded-md">
                      <img
                        src={product.metadata.images}
                        alt={product.metadata.name}
                        className="w-16 h-16 object-cover rounded-md mr-8 transition-all duration-200 hover:scale-110"
                      />
                      <div className="flex flex-col justify-center">
                        <h3 className="font-medium text-xs text-gray-900">
                          {product.metadata.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          ₹{product.metadata.price}
                        </p>
                        <div className="flex gap-6 mt-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProductSelect(product)} // Call handleProductSelect
                                className="hover:bg-blue-500 text-blue-500 px-2 py-0.5 text-xs"
                              >
                                <ExternalLink className="h-3 w-3 mr-2" />
                                View
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              View product details
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const productLink = `Check out ${product.metadata.name}: ${product.metadata.permalink}`;
                                  console.log("Share product:", productLink);
                                }}
                                className="hover:bg-blue-500 text-blue-500 px-2 py-0.5 text-xs"
                              >
                                <Send className="h-3 w-3 mr-2" />
                                Share
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share in chat</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
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
