"use client";

import { Suspense } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onUpload: (result: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    original_filename: string;
  }) => void;
  className?: string;
}

export default function ImageUpload({ onUpload, className }: ImageUploadProps) {
  return (
    <Suspense fallback={null}>
      <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        resourceType: "image",
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: 5,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
        maxFileSize: 5_000_000,
      }}
      onSuccess={(result) => {
        if (
          typeof result.info === "object" &&
          "secure_url" in result.info &&
          "public_id" in result.info
        ) {
          onUpload({
            public_id: String(result.info.public_id),
            secure_url: String(result.info.secure_url),
            width: Number(result.info.width),
            height: Number(result.info.height),
            format: String(result.info.format),
            original_filename: String(
              (result.info as Record<string, unknown>).original_filename || result.info.public_id
            ),
          });
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className={
            className ||
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16285B] text-white font-semibold text-sm hover:bg-[#1e3a7a] transition-colors cursor-pointer"
          }
        >
          <Upload size={14} />
          Upload Image
        </button>
      )}
    </CldUploadWidget>
    </Suspense>
  );
}
