"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

interface DocumentUploadProps {
  onUpload: (result: {
    public_id: string;
    secure_url: string;
    format: string;
    bytes: number;
    original_filename: string;
  }) => void;
}

export default function DocumentUpload({
  onUpload,
}: DocumentUploadProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      uploadPreset={
        process.env.NEXT_PUBLIC_CLOUDINARY_DOCUMENT_PRESET
      }
      options={{
        resourceType: "raw",
        sources: ["local"],
        multiple: false,
        clientAllowedFormats: ["pdf", "doc", "docx"],
        maxFileSize: 5_000_000,
      }}
      onSuccess={(result) => {
        if (
          typeof result.info === "object" &&
          "secure_url" in result.info &&
          "public_id" in result.info
        ) {
          const info = result.info;

          onUpload({
            public_id: String(info.public_id),
            secure_url: String(info.secure_url),
            format: String(info.format || "pdf"),
            bytes: Number(info.bytes || 0),
            original_filename: String(
              info.original_filename || info.public_id
            ),
          });
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="admin-btn admin-btn--primary admin-btn--sm flex items-center gap-2"
        >
          <Upload size={14} />
          Upload Document
        </button>
      )}
    </CldUploadWidget>
  );
}