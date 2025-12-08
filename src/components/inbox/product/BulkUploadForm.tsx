"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      headers: { "Content-Type": "multipart/form-data" },
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
    <div
      className="
        w-full 
        max-w-[650px] 
        mx-auto

        max-h-[70vh]
        overflow-y-auto
        pr-2

        space-y-8
        sm:space-y-6
        md:space-y-7

        px-2 sm:px-0
        hide-scrollbar
      "
    >
      <form onSubmit={handleBulkUpload} className="space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Bulk Upload Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Upload multiple products at once using our template
          </p>
        </div>

        {/* Template Download Box */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 flex items-center gap-2">
                <File className="w-4 h-4 text-blue-700" />
                Sample Template
              </h3>
              <p className="text-sm text-gray-600">
                Download and fill product details following the format.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => window.open("add_product_template.xlsx", "_blank")}
              className="
                bg-blue-600 hover:bg-blue-700 
                text-white 
                gap-2
                h-9 sm:h-10
                text-sm sm:text-base
              "
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-900">
            Upload File
          </Label>

          <input
            type="file"
            id="file-upload"
            name="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFileName(file ? file.name : null);
            }}
          />

          <label
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center 
              w-full 
              p-8 sm:p-10
              border-2 border-dashed 
              rounded-xl 
              cursor-pointer 
              text-center 
              transition-all

              ${
                selectedFileName
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }
            `}
          >
            {!selectedFileName ? (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  CSV or XLSX (Max 10MB)
                </p>
              </>
            ) : (
              <>
                <FileCheck className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {selectedFileName}
                </p>
                <p className="text-xs sm:text-sm text-green-600">
                  File selected
                </p>
              </>
            )}
          </label>
        </div>

        {/* Submit Buttons */}
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
            disabled={!selectedFileName || loading}
            className="flex-1 h-9 sm:h-10 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white gap-2"
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
