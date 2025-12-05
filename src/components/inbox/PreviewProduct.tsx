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
  ExternalLink,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {toast} from 'sonner'
import { Product } from "../types/product";

// interface Product {
//   id: string;
//   category: string;
//   description: string;
//   images: string;
//   name: string;
//   on_sale: string; // Use boolean if the data contains `true/false` instead of `"True"/"False"`
//   permalink: string;
//   price: number;
//   product_id: number;
//   purchasable: string; // Use boolean if the data contains `true/false`
//   regular_price: string; // Use `number` if parsed as numeric values
//   sale_price: string; // Use `number` if parsed as numeric values
//   slug: string;
//   stock_quantity: number;
// }

type MetadataValue = string | number | boolean;

interface ProductPreviewProps {
  product: Product;
  onClose: () => void;
  onShare: (product: Product) => void; 
  open: boolean;
}


const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  onClose,
  onShare,
  open
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {/* <Package className="h-5 w-5" /> */}
            Product Preview
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh]">
          <div className="flex flex-col space-y-6 pr-4">
            {/* Main Product Section */}
            <div className="flex gap-6">
              {/* Left: Image */}
              <div className="w-1/2">
                <div className="aspect-square relative rounded-lg border overflow-hidden">
                  <img
                    src={product.images}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                  {product.onsale && (
                    <Badge className="absolute top-2 left-2" variant="destructive">
                      On Sale
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right: Basic Info */}
              <div className="w-1/2 space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h2 className="text-xl font-normal">
                      {/* {product.name.length > 50 
                        ? `${product.product_name.substring(0, 50)}...` 
                        : product.product_name} */}
                        {product.product_name}
                    </h2>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] break-words">
                    <p>{product.product_name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    {product.saleprice ? (
                      <>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{product.saleprice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.regularprice}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">
                        ₹{product.regularprice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-gray-500" />
                  <Badge variant={product.purchasable ? "success" : "destructive"}>
                    {product.purchasable 
                      ? `In Stock (${product.stock})` 
                      : "Out of Stock"}
                  </Badge>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Category
                    </p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      Product ID
                    </p>
                    <p className="font-medium">{product.product_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
    <p className="text-sm text-gray-500 flex items-center gap-1">
      <Link2 className="h-4 w-4" />
      Product Link
    </p>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => window.open(product.permalink, '_blank')}
      >
        <ExternalLink className="h-4 w-4" />
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => {
          navigator.clipboard.writeText(product.permalink);
          toast.success("Link copied to clipboard");
        }}
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
    </div>
  </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </p>
                <p className="font-medium text-sm">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Share Button - Fixed at bottom */}
        <div className="pt-4 mt-4 flex border-t justify-end">
          <Button 
            onClick={() => {
              onShare(product);
              onClose();
            }}
            variant="outline"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share in Chat</span>
          </Button>
          
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default ProductPreview;
