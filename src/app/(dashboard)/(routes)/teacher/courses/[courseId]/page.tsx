import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/server";
import {
  CircleDollarSignIcon,
  FileIcon,
  LayoutDashboardIcon,
  ListCheckIcon,
} from "lucide-react";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form copy";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const courseId = params.courseId;

  const { course } = await api.course.get({ courseId });
  if (!course) {
    // TODO 404 pages
    return <div>There is no course with this Id</div>;
  }
  const { categories } = await api.category.list();

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished), // at least one chapter that is published
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
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <Badge variant={"icon"}>
                <ListCheckIcon />
              </Badge>
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <Badge variant={"icon"}>
                <CircleDollarSignIcon />
              </Badge>
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={courseId} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <Badge variant={"icon"}>
                <FileIcon />
              </Badge>
              <h2 className="text-xl">Resources and attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
