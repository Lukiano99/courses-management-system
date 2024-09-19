import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/server";
import { LayoutDashboardIcon } from "lucide-react";
import TitleForm from "./_components/title-form";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const courseId = params.courseId;
  const { course } = await api.course.get({ courseId });

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-muted-foreground">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-x-2">
            <Badge variant={"icon"}>
              <LayoutDashboardIcon />
            </Badge>
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm
            initialData={{ title: course.title }}
            courseId={course.id}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
