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
  name: string;
  on_sale: boolean;
  price: string;
  product_id: string;
  purchasable: boolean;
  regular_price: string;
  sale_price: string;
  stock_quantity: string;
  metadata: Record<string, any>;
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
        { key: "sale_price", label: "Sale Price", condition: product.on_sale },
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

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Pricing Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Price:</span>
                <span className="font-medium text-lg text-gray-900">
                  ₹{product.metadata.price}
                </span>
              </div>
              {product.on_sale && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Regular Price:</span>
                    <span className="text-gray-400 line-through">
                      ₹{product.metadata.regular_price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Sale Price:</span>
                    <span className="font-medium text-green-600">
                      ₹{product.metadata.sale_price}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Inventory Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Inventory</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stock Quantity:</span>
                <span className="font-medium text-gray-900">
                  {product.metadata.stock_quantity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Availability:</span>
                <Badge variant={product.purchasable ? "default" : "destructive"}>
                  {product.purchasable ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Product Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium text-gray-900">
                {product.metadata.sku || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium text-gray-900">
                {product.category}
              </span>
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
            
            {product.metadata.url && (
              <a
                href={product.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm text-gray-600 hover:text-gray-900 underline"
              >
                View full product page ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
