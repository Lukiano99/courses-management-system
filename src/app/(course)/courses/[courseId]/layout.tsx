import { getUserProgress } from "@/server/api/routers/user-pgoress";
import { api } from "@/trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { courseId } = params;

  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  const { course } = await api.course.get({ courseId, userProgress: true });
  if (!course) {
    return redirect("/");
  }

  const progressCount = await getUserProgress(courseId, user.id);

  return (
    <div className="h-full">
      <div className="inset-y-0 z-50 h-[80px] md:pl-80">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="h-full md:pl-80">{children}</main>
    </div>
  );
};

export default CourseLayout;
