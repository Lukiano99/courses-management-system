"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { CopyXIcon, Loader2Icon, ShareIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) => {
  const router = useRouter();
  // const { mutate: deleteChapter, isPending: isDeleting } =
  //   api.course.delete.useMutation();
  const { mutate: publishCourse, isPending: isPublishing } =
    api.course.togglePublish.useMutation();
  const { mutate: deleteCourse, isPending: isDeleting } =
    api.course.delete.useMutation();

  const onDelete = () => {
    deleteCourse(
      {
        courseId,
      },
      {
        onSuccess: () => {
          toast.success("Course successfully deleted");
          router.refresh();
          router.push(`/teacher/courses`);
        },
        onError: () => {
          toast.error("Something went wrong while deleting the course");
        },
      },
    );
  };

  const onTogglePublish = () => {
    if (!isPublished) {
      publishCourse(
        {
          courseId,
        },
        {
          onSuccess: () => {
            toast.success("Course is published successfully!");
            router.refresh();
          },
          onError: () => {
            toast.error("Something went wrong!");
          },
        },
      );
    }
    if (isPublished) {
      publishCourse(
        {
          courseId,
        },
        {
          onSuccess: () => {
            toast.success("Course is unpublished successfully!");
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
        onClick={onTogglePublish}
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

export default CourseActions;
