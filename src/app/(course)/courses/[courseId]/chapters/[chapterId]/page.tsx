import Banner from "@/components/banner";
import { api } from "@/trpc/server";
import VideoPlayer from "./_components/video-player";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { chapterId, courseId } = params;
  const { purchase } = await api.purchase.get({ courseId });
  const { course } = await api.course.get({ courseId });
  const { userProgress } = await api.userProgress.get({ chapterId });
  const { chapter } = await api.chapter.get({
    chapterId,
    courseId,
    isPublished: true,
  });

  if (!chapter || !course) {
    return (
      <div className="flex items-center justify-center pt-10 text-muted-foreground">
        Chapter or course not found
      </div>
    );
  }

  const { chapter: nextChapter } = await api.chapter.getNext({
    chapterId,
    position: chapter.position,
  });

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter"
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter"
          variant={"warning"}
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            courseId={courseId}
            title={chapter.title}
            nextChapterId={nextChapter?.id}
            playbackId={chapter.muxData?.playbackId ?? ""}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
