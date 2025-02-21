import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddProduct from "@/components/inbox/AddProduct";
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
} from "@/components/ui/tooltip";
import { ExternalLink, Send, Plus, Search, Eye, Share2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";


type PlatformType = "pinecone" | "shopify" | "other" | undefined;

const WS_URL = 'wss://egenie-whatsapp.koyeb.app/cs';


interface Product {
  id: string;
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



interface ProductsTabProps {
  selectedConversationId?: string;
  onProductSelect: (product: Product) => void;
  onShareProduct: (product: Product) => void; // Add this line
}

const LoadingState = () => (
  <div className="p-3 mb-2 bg-white shadow-sm">
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex-1 relative">
        <Input
          placeholder="Search products..."
          className="pl-8 pr-3 py-1.5 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      {/* Updated Add Product button with dropdown */}
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add new product</TooltipContent>
        </Tooltip>
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
          <Skeleton className="w-20 h-12 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductsTab = ({ 
  onProductSelect, 
  selectedConversationId,
  onShareProduct 
}: ProductsTabProps) => {
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [retries, setRetries] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);
  

  const maxRetries = 5;
  const retryDelay = 3000;

  const fetchProducts = async (conversationId: string) => {
    if (!conversationId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://egenie-whatsapp.koyeb.app/product_recommendations/${conversationId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();

      if (data['status'] == "error") {
        setError('Failed to fech products');
        return;
      }
      setError("")
      console.log(data)
      setProducts(data['data']);
      setFilteredProducts(data['data']);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedConversationId) return;

    // Initial fetch
    fetchProducts(selectedConversationId);

    // WebSocket connection
    const connectWebSocket = () => {
      const wsConnection = new WebSocket(`${WS_URL}/client-${Date.now()}`);
      
      wsConnection.onopen = () => {
        // setError(null);
        setRetries(0);
      };
      
      wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (
          data.type === 'products_updated' && 
          data.conversation_id === selectedConversationId
        ) {
          fetchProducts(selectedConversationId);
        }
      };

      wsConnection.onerror = () => {
        setError('WebSocket connection failed');
        if (retries < maxRetries) {
          setRetries(prev => prev + 1);
          setTimeout(connectWebSocket, retryDelay);
        }
      };

      wsConnection.onclose = () => {
        if (retries < maxRetries) {
          setRetries(prev => prev + 1);
          setTimeout(connectWebSocket, retryDelay);
        }
      };

      setWs(wsConnection);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [selectedConversationId]);

  // Filter products when search or category changes
  useEffect(() => {
    const filtered = products?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchProduct.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchProduct, selectedCategory, products]);

  const handleOptionSelect = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    setShowForm(true);
    setShowOptions(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-3 h-screen mb-2 bg-white shadow-sm">

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex-1 relative">
        <Input
          placeholder="Search products..."
          className="pl-8 pr-3 py-1.5 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      {/* Updated Add Product button with dropdown */}
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add new product</TooltipContent>
        </Tooltip>
      </div>
    </div>
      <div className="p-4 my-4 text-red-500 bg-white rounded-lg border border-red-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">Failed fetch products</p>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="p-3 mb-2 max-h-screen bg-white  shadow-sm">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search products..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        {/* Updated Add Product button with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowOptions(!showOptions)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add new product</TooltipContent>
          </Tooltip>

          {showOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-xl border border-gray-200 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleOptionSelect("pinecone")}
                  className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-white 
                            border border-transparent hover:border-gray-300 
                            hover:bg-gray-50 text-left transition-all"
                >
                  Add to Pinecone
                </button>
                <button
                  onClick={() => handleOptionSelect("shopify")}
                  className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-white 
                            border border-transparent hover:border-gray-300 
                            hover:bg-gray-50 text-left transition-all"
                >
                  Add to Shopify
                </button>
                <button
                  onClick={() => handleOptionSelect("other")}
                  className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-white 
                            border border-transparent hover:border-gray-300 
                            hover:bg-gray-50 text-left transition-all"
                >
                  Add to Wordpress
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-145px)] pr-2">
        <div className="space-y-2 ">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => onProductSelect(product)} // Add this line
            >
              <div className="w-20  bg-gray-50 rounded-md overflow-hidden">
                <Image
                  height={100}
                  width={100}
                  src={product.images}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{product.price}
                  </p>
                  {/* <Badge variant="outline" className="text-xs text-gray-500">
                    {product.category}
                  </Badge> */}
                </div>
              </div>

              {/* Update buttons to stop propagation */}
              <div className="flex flex-col gap-2 ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent div's click
                        onProductSelect(product);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Preview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareProduct(product);
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share product</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500">
            No products found matching your criteria
          </div>
        )}
      </ScrollArea>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowForm(false);
            setSelectedPlatform(undefined);
          }}
        >
          <AddProduct
            closeForm={() => {
              setShowForm(false);
              setSelectedPlatform(undefined);
            }}
            platform={selectedPlatform}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
