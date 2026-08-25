"use client";

import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  onUpload: (result: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
  }) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        resourceType: "image",
        sources: ["local"],
        multiple: false,

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
          });
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
}
