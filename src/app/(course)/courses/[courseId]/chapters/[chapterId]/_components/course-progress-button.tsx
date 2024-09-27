"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { api } from "@/trpc/react";
import { XCircleIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted: boolean;
  nextChapterId?: string;
}
const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const { mutate: completeChapter, isPending } =
    api.userProgress.toggleChapterStatus.useMutation();
  const Icon = isCompleted ? XCircleIcon : CheckCircleIcon;
  const onClick = () => {
    completeChapter(
      {
        chapterId,
        isCompleted: !isCompleted,
      },
      {
        onSuccess: (data) => {
          if (data.isCompleted && !nextChapterId) {
            confetti.onOpen();
          }

          if (data.isCompleted && nextChapterId) {
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          }
          router.refresh();
          toast.success("Progress updated");
        },
        onError: (e) => {
          toast.error("Something went wrong", { description: e.message });
        },
      },
    );
  };

  return (
    <Button
      onClick={onClick}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      disabled={isPending}
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      {!isPending && <Icon size={16} className="ml-2" />}
      {isPending && <Loader2Icon size={16} className="ml-2 animate-spin" />}
    </Button>
  );
};

export default CourseProgressButton;
