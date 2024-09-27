"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2Icon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}
const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const { mutate: completeChapter } =
    api.userProgress.toggleChapterStatus.useMutation();

  const onEnd = () => {
    if (completeOnEnd) {
      completeChapter(
        {
          chapterId,
          isCompleted: true,
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
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent-foreground">
          <Loader2Icon className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-accent-foreground text-secondary">
          <LockIcon className="size-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
