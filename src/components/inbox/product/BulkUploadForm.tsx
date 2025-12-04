import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import api from "@/lib/session_api";
import { toast } from "sonner";

interface BulkUploadFormProps {
  setIsModalOpen: (open: boolean) => void;
}

const BulkUploadForm = ({ setIsModalOpen }: BulkUploadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setIsModalOpen(false); // Close dialog after success
  };

  return (
    <form onSubmit={handleBulkUpload} className="space-y-6 mt-2">

      {/* Download Template */}
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-gray-200">
        <div>
          <p className="text-gray-800 font-medium">Sample Template</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Use this file to format your product list correctly.
          </p>
        </div>

        <Button
          type="button"
          className="bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          onClick={() => window.open("add_product_template.xlsx", "_blank")}
        >
          Download
        </Button>
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-sm text-gray-800 mb-2 block">
          Upload CSV or Excel File
        </Label>

        {/* Styled File Box */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative"
        >
          {!selectedFileName ? (
            <div className="flex flex-col items-center justify-center pt-3 pb-4">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5 7.5 12m4.5-4.5V15" />
              </svg>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-500 mt-1">.csv or .xlsx only</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <p className="text-sm text-gray-800 font-medium truncate w-full text-center">
                {selectedFileName}
              </p>
              <p className="text-xs text-gray-500 mt-1">File selected</p>
            </div>
          )}

          <Input
            id="file-upload"
            type="file"
            name="file"
            required
            accept=".csv, .xlsx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFileName(file ? file.name : null);
            }}
          />
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  );
};

export default BulkUploadForm;
