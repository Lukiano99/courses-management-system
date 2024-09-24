"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Loader2Icon, TrashIcon } from "lucide-react";
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
  const { mutate: deleteChapter, isPending } = api.chapter.delete.useMutation();
  const onDelete = async () => {
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

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => {
          console.log("Pusblish test");
        }}
        disabled={disabled || isPending}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} variant={"destructive"} disabled={isPending}>
          {!isPending && <TrashIcon size={18} />}
          {isPending && <Loader2Icon size={18} className="animate-spin" />}
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
