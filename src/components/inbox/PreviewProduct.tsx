import React from "react";
import {
  X,
  Package,
  Tag,
  Clock,
  Warehouse,
  ShoppingCart,
  Link2,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  category: string;
  on_sales: number;
  metadata: {
    images: string;
    name: string;
    price: string;
    permalink: string;
    // price: number;
    product_id: number;
    purchasable: string; // Use boolean if the data contains `true/false`
    regular_price: string; // Use `number` if parsed as numeric values
    sale_price: string; // Use `number` if parsed as numeric values
    slug: string;
    stock_quantity: number;
  };
}


interface ProductPreviewProps {
  product: Product;
  onClose: () => void;
}


const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  onClose,
}) => {
  const fieldGroups = [
    {
      title: "Product Information",
      icon: <Package className="h-5 w-5" />,
      fields: [
        { key: "name", label: "Product Name" },
        { key: "product_id", label: "SKU/ID" },
      ],
    },
    {
      title: "Pricing",
      icon: <Tag className="h-5 w-5" />,
      fields: [
        { key: "regular_price", label: "Regular Price" },
        { key: "sale_price", label: "Sale Price", condition: product.on_sales },
        { key: "price", label: "Current Price" },
      ],
    },
    {
      title: "Inventory",
      icon: <Warehouse className="h-5 w-5" />,
      fields: [
        { key: "stock_quantity", label: "Stock Available" },
        { key: "purchasable", label: "Status" },
      ],
    },
  ];

  const formatValue = (key: string, value: any) => {
    if (key === "purchasable") return value ? "In Stock" : "Out of Stock";
    if (key.includes("price")) return `₹${value}`;
    return value || "N/A";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full min-w-[500px] max-w-xl p-6 relative">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <img
              src={product.metadata.images}
              alt={product.metadata.name}
              className="w-20 h-20 object-cover rounded-lg border"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {product.metadata.name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
                <span className="text-sm text-gray-500">
                  ID: {product.metadata.product_id}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

         {/* Main Content */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="border rounded-lg overflow-hidden">
              <img
                src={product.metadata.images}
                alt={product.metadata.name}
                className="w-full h-48 object-contain bg-gray-50"
              />
            </div>

            {/* Product Identifiers */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Identifiers</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium text-gray-900">
                    {product.metadata.product_id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Slug:</span>
                  <span className="font-medium text-gray-900 text-xs">
                    {product.metadata.slug}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Permalink:</span>
                  <a
                    href={product.metadata.permalink}
                    target="_blank"
                    rel="noopener"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View Link
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing Section - Keep existing */}

            {/* Inventory & Availability */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Stock Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stock Quantity:</span>
                  <span className="font-medium text-gray-900">
                    {product.metadata.stock_quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Purchasable:</span>
                  <Badge variant={product.metadata.purchasable === 'true' ? "default" : "destructive"}>
                    {product.metadata.purchasable === 'true' ? "Available" : "Available"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Regular Price:</span>
                  <span className="font-medium text-gray-900">
                    ₹{product.metadata.regular_price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sale Price:</span>
                  <span className="font-medium text-gray-900">
                    ₹{product.metadata.sale_price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-medium text-gray-900">
                    ₹{product.metadata.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="border-t pt-5">
          <div className="flex flex-col gap-3">
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 
              bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 
              transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Share in Chat</span>
            </button>
            
            {/* {product.metadata.url && (
              <a
                href={product.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm text-gray-600 hover:text-gray-900 underline"
              >
                View full product page ↗
              </a>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
