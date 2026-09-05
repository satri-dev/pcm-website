"use client";

import { Suspense, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import { restorePageScroll } from "@/lib/restore-page-scroll";

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
  useEffect(() => () => restorePageScroll(), []);

  return (
    <Suspense fallback={null}>
      <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      uploadPreset={
        process.env.NEXT_PUBLIC_CLOUDINARY_DOCUMENT_PRESET
      }
      options={{
        resourceType: "raw",
        sources: ["local"],
        multiple: true,
        maxFiles: 10,
        clientAllowedFormats: ["pdf", "doc", "docx"],
        maxFileSize: 5_000_000,
      }}
      onClose={restorePageScroll}
      onSuccess={(result) => {
        restorePageScroll();
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16285B] text-white font-semibold text-sm hover:bg-[#1e3a7a] transition-colors cursor-pointer"
        >
          <Upload size={14} />
          Upload Document
        </button>
      )}
    </CldUploadWidget>
    </Suspense>
  );
}