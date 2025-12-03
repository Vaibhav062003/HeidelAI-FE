import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import api from "@/lib/session_api";
import { toast } from "sonner";
// Add this import

interface SingleProductFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const SingleProductForm = ({ setIsModalOpen }: SingleProductFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const res = await api.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setLoading(false);
    if (res.status !== 200) {
      toast.error("Product creation failed!");
      return;
    }
    toast.success("Product created successfully!");
    setIsModalOpen(false); // Close dialog after success
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-2">

      {/* Product Name */}
      <div className="space-y-1">
        <Label htmlFor="product_name">Product Name</Label>
        <Input
          id="product_name"
          name="product_name"
          required
          placeholder="Enter product name"
          className="rounded-lg"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Short description"
          className="rounded-lg"
        />
      </div>

      {/* Price */}
      <div className="space-y-1">
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          placeholder="Enter price"
          className="rounded-lg"
        />
      </div>

      {/* Stock */}
      <div className="space-y-1">
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          placeholder="Enter stock"
          className="rounded-lg"
        />
      </div>

      {/* Product ID */}
      <div className="space-y-1">
        <Label htmlFor="product_id">Unique Product ID</Label>
        <Input
          id="product_id"
          name="product_id"
          required
          placeholder="Enter unique ID"
          className="rounded-lg"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-1">
        <Label htmlFor="image">Product Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="border border-gray-300 rounded-lg p-2"
        />
        <p className="text-xs text-gray-500">Optional • JPG, PNG allowed</p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};

export default SingleProductForm;
