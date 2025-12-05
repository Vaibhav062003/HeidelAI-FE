import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import api from "@/lib/session_api";
import { toast } from "sonner";
import { Download, Upload, FileCheck, File } from "lucide-react";

interface BulkUploadFormProps {
  setIsModalOpen: (open: boolean) => void;
}

const BulkUploadForm = ({ setIsModalOpen }: BulkUploadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await api.post("/api/products/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setLoading(false);
    if (res.status !== 200) {
      toast.error("Bulk upload failed!");
      return;
    }
    toast.success("Bulk upload successful!");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleBulkUpload} className="space-y-6">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Products</h2>
          <p className="text-gray-600">Upload multiple products at once using our template</p>
        </div>

        {/* Template Download Box */}
        <div className="bg-white border-dashed border-2 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                <File className="w-5 h-5 text-blue-600" />
                Sample Template
              </h3>
              <p className="text-gray-700 text-sm">Download the Excel file and enter your product details following the format.</p>
            </div>
            <Button
              type="button"
              onClick={() => window.open("add_product_template.xlsx", "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-3">
          <Label className="text-gray-900 font-semibold">Upload Your File</Label>
          
          {/* Upload Box */}
          <div className="relative">
            <input
              type="file"
              name="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setSelectedFileName(file ? file.name : null);
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                selectedFileName
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              {!selectedFileName ? (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="font-medium text-gray-900">Click to upload or drag & drop</p>
                    <p className="text-sm text-gray-600">CSV or XLSX only (Max 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileCheck className="w-8 h-8 text-green-600" />
                  <p className="font-medium text-gray-900">{selectedFileName}</p>
                  <p className="text-xs text-green-600">File selected</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
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
            disabled={!selectedFileName || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BulkUploadForm;