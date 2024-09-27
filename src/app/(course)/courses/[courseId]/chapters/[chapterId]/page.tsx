import Banner from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import Preview from "@/components/preview";
import { FileIcon } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  // TODO: Refatctor this code. You can not fetch data if you didn't bought course
  // currently we successfully fetched data, and we do logic on client-side
  // which is not good

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
    courseId,
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
        <div>
          <div className="flex w-full flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb2 text-2xl font-semibold">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!course.attachments.length && purchase && (
            <>
              <Separator />
              <div className="p-4">
                {course.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    className="flex w-full items-center gap-x-2 rounded-md border bg-primary/20 p-3 text-primary transition hover:underline"
                  >
                    <FileIcon />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
