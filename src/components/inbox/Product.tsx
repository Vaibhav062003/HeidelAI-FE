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
import { ExternalLink, Send, Plus, Search, Eye, Share2 } from "lucide-react";

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


interface ProductsTabProps {
  onProductSelect: (product: Product) => void;
}

type PlatformType = "pinecone" | "shopify" | "other" | undefined;


const ProductsTab = ({ onProductSelect }: ProductsTabProps) => {
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/Dataset.json");
      if (!response.ok) throw new Error("Failed to fetch products");
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

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.metadata.name
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

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-3 mb-2 bg-white rounded-lg border border-gray-100 shadow-sm">
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

      <ScrollArea className="h-screen pr-2">
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => onProductSelect(product)} // Add this line
            >
              <div className="w-20 aspect-video bg-gray-50 rounded-md overflow-hidden">
                <img
                  src={product.metadata.images}
                  alt={product.metadata.name}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {product.metadata.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{product.metadata.price}
                  </p>
                  <Badge variant="outline" className="text-xs text-gray-500">
                    {product.category}
                  </Badge>
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
                        e.stopPropagation(); // Prevent parent div's click
                        console.log("Share", product);
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

        {loading && (
          <div className="text-center py-6 text-sm text-gray-500">
            Loading products...
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500">
            No products found matching your criteria
          </div>
        )}

        {error && (
          <div className="text-center py-6 text-sm text-red-500">{error}</div>
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
