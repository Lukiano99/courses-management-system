"use client";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type Course } from "@prisma/client";
import { ImageIcon, PencilIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface TitleFormProps {
  initialData: Course;
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const { mutate: updateImageUrl } = api.course.updateImageUrl.useMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateImageUrl(
      { ...values, courseId },
      {
        onSuccess: () => {
          toast.success("Image updated successfully");
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
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircleIcon size={14} className="mr-4" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <PencilIcon size={14} className="mr-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-muted-foreground/10">
            <ImageIcon className="size-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="upload"
              fill
              src={initialData.imageUrl}
              className="rounded-md object-cover"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommanded
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
