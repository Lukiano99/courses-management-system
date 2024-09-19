import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("On upload complete");
    }),
  courseAttachments: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("On upload complete");
    }),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("On upload complete");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
