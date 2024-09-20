"use client";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Attachment, type Course } from "@prisma/client";
import {
  FileIcon,
  Loader2Icon,
  PlusCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  url: z.string().min(1, {
    message: "File is required",
  }),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const { mutate: addAttachment } = api.course.addAttachment.useMutation();
  const { mutate: deleteAttachment } =
    api.course.deleteAttachment.useMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addAttachment(
      { ...values, courseId },
      {
        onSuccess: () => {
          toast.success("Attachment added successfully");
          toggleEdit();
          router.refresh();
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    );
  };

  const onDelete = (attachmentId: string) => {
    setDeletingId(attachmentId);
    deleteAttachment(
      {
        courseId,
        attachmentId: attachmentId,
      },
      {
        onSuccess: () => {
          setDeletingId(null);

          toast.success("Attachment deleted successfully");

          router.refresh();
        },
        onError: () => {
          setDeletingId(null);

          toast.error("Something went wrong!");
        },
      },
    );
  };

  return (
    <div className="mt-6 rounded-md border bg-muted p-4 transition-all">
      <div className="flex items-center justify-between font-medium transition-all">
        Course attachments
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-muted-foreground/10"
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircleIcon size={14} className="mr-4" />
              Add an file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border border-primary/40 bg-primary/20 p-3 text-primary"
                >
                  <FileIcon size={18} className="mr-2 flex-shrink-0" />
                  <p className="line-clamp-1 break-words text-xs">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2Icon className="animate-spin" size={18} />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <XIcon size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachments"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
