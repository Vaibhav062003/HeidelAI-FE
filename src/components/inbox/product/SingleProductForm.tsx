"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import api from "@/lib/session_api";
import { toast } from "sonner";

interface SingleProductFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const SingleProductForm = ({ setIsModalOpen }: SingleProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    if (imageUrl) {
      formData.append("image_url", imageUrl);
    }

    const res = await api.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setLoading(false);

    if (res.status !== 200) {
      toast.error("Product creation failed!");
      return;
    }

    toast.success("Product created successfully!");
    setIsModalOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full 
        max-w-[650px] 
        mx-auto

        max-h-[70vh]
        overflow-y-auto
        pr-2

        space-y-6
        sm:space-y-5
        md:space-y-6
        lg:space-y-7

        px-2 sm:px-0
        hide-scrollbar
        mt-2
      "
    >
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Create New Product
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Fill in the details below</p>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label className="text-sm sm:text-base" htmlFor="product_name">Product Name</Label>
        <Input
          id="product_name"
          name="product_name"
          required
          placeholder="Enter product name"
          className="h-9 sm:h-10 text-sm sm:text-base rounded-md"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-sm sm:text-base" htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Short description"
          className="h-9 sm:h-10 text-sm sm:text-base rounded-md"
        />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm sm:text-base" htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm sm:text-base" htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="0"
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>
      </div>


      {/* Image URL */}
      <div className="space-y-2">
        <Label className="text-sm sm:text-base" htmlFor="image_url">Image URL (Optional)</Label>
        <Input
          id="image_url"
          name="image_url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          className="h-9 sm:h-10 text-sm sm:text-base rounded-md"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="flex justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-md border shadow-sm"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(false)}
          className="flex-1 h-9 sm:h-10 text-sm sm:text-base"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-9 sm:h-10 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default SingleProductForm;
