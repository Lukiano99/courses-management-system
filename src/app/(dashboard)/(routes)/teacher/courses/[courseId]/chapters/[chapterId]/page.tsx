import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeftIcon, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const user = await currentUser();
  const { chapterId, courseId } = params;
  if (!user) {
    redirect("/");
  }

  const { chapter } = await api.chapter.get({ chapterId, courseId });
  if (!chapter) {
    redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="mb-6 flex items-center text-sm transition hover:opacity-75"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Course setup
          </Link>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-muted-foreground">
                Complete all fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <Badge variant={"icon"}>
                <LayoutDashboardIcon />
              </Badge>
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            {/* TODO Chapter Title Form */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
