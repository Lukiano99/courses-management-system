import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { type Chapter, type Course, type UserProgress } from "@prisma/client";
import CourseSidebarItem from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = auth();
  if (!userId) return "/";

  const { purchase } = await api.purchase.get({ courseId: course.id });

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex h-[80px] flex-col border-b p-8">
        <h1 className="font-semibold">{course.title}</h1>
        {/* Check purchase and add progress */}
        TODO: Progress{progressCount}
      </div>
      <div className="flex w-full flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
