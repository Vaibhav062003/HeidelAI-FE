import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

// Configure AWS SDK for Supabase S3-compatible storage
AWS.config.update({
  accessKeyId: "ae71b2dfaa0c52ee96397e53906aa99e",
  secretAccessKey: "a9aaabcf0c4efed87bf10ff000635e3725d0258a4a2d9ccbdcb184aeff6bb0c0",
});

const s3 = new AWS.S3({
  endpoint: "https://ffibjxjbjsekelomsyqh.supabase.co/storage/v1/s3",
  region: "us-west-1",
  signatureVersion: "v4",
  s3ForcePathStyle: true,
});

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  className?: string;
  accept?: string;
}

const ImageUploadHandler: React.FC<ImageUploadProps> = ({ 
  onUploadComplete, 
  className = '',
  accept = 'image/*'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToPublicUrl = (s3Url: string) => {
    return s3Url
      .replace("/s3/", "/object/public/")
      .replace("storage/v1/object/public", "storage/v1/object/public");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const params = {
        Bucket: "whatsapp_template",
        Key: `uploads/${Date.now()}-${file.name}`,
        Body: file,
        ACL: "public-read",
        ContentType: file.type,
      };

      const uploadResult = await s3.upload(params).promise();
      const publicUrl = convertToPublicUrl(uploadResult.Location);
      
      onUploadComplete(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        onChange={handleFileUpload}
        accept={accept}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label 
        htmlFor="file-upload" 
        className={`
          flex flex-col items-center justify-center p-6 
          border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200
          ${isUploading ? 'bg-gray-50' : 'hover:bg-gray-50'}
        `}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload file</p>
          </>
        )}
      </label>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUploadHandler;