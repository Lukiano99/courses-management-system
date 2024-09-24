"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { CopyXIcon, Loader2Icon, ShareIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const { mutate: deleteChapter, isPending: isDeleting } =
    api.chapter.delete.useMutation();
  const { mutate: publishChapter, isPending: isPublishing } =
    api.chapter.publish.useMutation();

  const onDelete = () => {
    deleteChapter(
      {
        courseId,
        chapterId,
      },
      {
        onSuccess: () => {
          toast.success("Chapter successfully deleted");
          router.refresh();
          router.push(`/teacher/courses/${courseId}`);
        },
        onError: () => {
          toast.error("Something went wrong while deleting chapter");
        },
      },
    );
  };

  const onPublish = () => {
    if (!isPublished) {
      publishChapter(
        {
          courseId,
          chapterId,
        },
        {
          onSuccess: () => {
            toast.success("Chapter is published successfully!");
            router.refresh();
          },
          onError: () => {
            toast.error("Something went wrong!");
          },
        },
      );
    }
    if (isPublished) {
      publishChapter(
        {
          courseId,
          chapterId,
        },
        {
          onSuccess: () => {
            toast.success("Chapter is unpublished successfully!");
            router.refresh();
          },
          onError: () => {
            toast.error("Something went wrong!");
          },
        },
      );
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isPublishing}
        variant={"outline"}
        size={"sm"}
        className="flex items-center gap-x-2"
      >
        {!isPublishing && (
          <>
            {isPublished ? <CopyXIcon size={16} /> : <ShareIcon size={16} />}
            {isPublished ? "Unpublish" : "Publish"}
          </>
        )}
        {isPublishing && (
          <>
            <Loader2Icon size={18} className="animate-spin" />
            {
              <p className="animate-pulse text-sm">
                {!isPublished ? "Publishing" : "Unpublishing"}
              </p>
            }
          </>
        )}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} variant={"destructive"} disabled={isDeleting}>
          {!isDeleting && <TrashIcon size={16} />}
          {isDeleting && <Loader2Icon size={16} className="animate-spin" />}
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
