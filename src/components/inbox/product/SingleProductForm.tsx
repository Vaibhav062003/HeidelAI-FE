import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import api from "@/lib/session_api";
import { toast } from "sonner";
import { Upload, Package, FileImage, Link as LinkIcon } from "lucide-react";

interface SingleProductFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const SingleProductForm = ({ setIsModalOpen }: SingleProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // ---------- HANDLE IMAGE FILE ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(""); // Clear URL if file selected
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- HANDLE IMAGE URL ----------
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url ? url : null);
  };

  // ---------- SUBMIT FORM ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    // Append image_url field if provided
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
    <form onSubmit={handleSubmit} className="space-y-6 mt-2 px-1">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2.5 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create New Product</h2>
          <p className="text-sm text-gray-600">Fill in the details below</p>
        </div>
      </div>

      {/* Product Name */}
      <div className="space-y-2.5">
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
      <div className="space-y-2.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Short description"
          className="rounded-lg"
        />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="0"
          />
        </div>
      </div>

      {/* Product ID */}
      <div className="space-y-2.5">
        <Label htmlFor="product_id">Unique Product ID</Label>
        <Input
          id="product_id"
          name="product_id"
          required
          placeholder="SKU-XXXXXXX"
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2.5">
        <Label htmlFor="image_url">Image URL (Optional)</Label>
        <div className="relative">
          <Input
            id="image_url"
            name="image_url"
            placeholder="https://example.com/image.jpg"
            className="pl-10 rounded-lg"
            value={imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
          />
          <LinkIcon className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Image Upload OR URL Preview */}
      <div className="space-y-2.5">
        <Label>Product Image</Label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {!imagePreview ? (
          <label
            htmlFor="image"
            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <div className="flex flex-col items-center">
              <FileImage className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload OR enter a URL
              </p>
              <p className="text-xs text-gray-600">JPG, PNG • Up to 5MB</p>
            </div>
          </label>
        ) : (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border-2 border-green-300"
            />
            <label
              htmlFor="image"
              className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
            >
              <div className="text-center">
                <Upload className="w-6 h-6 text-white mb-2" />
                <p className="text-white text-sm">Change image</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(false)}
          className="flex-1"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
          disabled={loading}
        >
          <Upload className="w-4 h-4" />
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default SingleProductForm;
