"use client";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type Chapter, type MuxData } from "@prisma/client";
import { PencilIcon, PlusCircleIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface ChapterVideoProps {
  initialData: Chapter & { muxData: MuxData | null };
  courseId: string;
  chapterId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideo = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const { mutate: updateVideoUrl } = api.chapter.updateVideoUrl.useMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateVideoUrl(
      { ...values, courseId, chapterId },
      {
        onSuccess: () => {
          toast.success("Chapter video updated successfully");
          toggleEdit();
          router.refresh();
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    );
  };
  return (
    <div className="mt-6 rounded-md border bg-muted p-4 transition-all">
      <div className="flex items-center justify-between font-medium transition-all">
        Course image
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-muted-foreground/10"
        >
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircleIcon size={14} className="mr-4" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <PencilIcon size={14} className="mr-4" />
              Edit <video src=""></video>
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-muted-foreground/10">
            <VideoIcon className="size-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">Video uploaded</div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterVideo;
