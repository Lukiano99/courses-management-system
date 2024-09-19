"use client";

import { type ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}
const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log({ res });
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        console.log({ error });
        toast.error(`${error.message}`);
      }}
    />
  );
};

export default FileUpload;