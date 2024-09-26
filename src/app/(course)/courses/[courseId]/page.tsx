import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const { course } = await api.course.get({ courseId });

  if (!course) {
    return redirect("/");
  }

  return redirect(`/courses/${courseId}/chapters/${course.chapters[0]?.id}`);
};

export default CourseIdPage;
