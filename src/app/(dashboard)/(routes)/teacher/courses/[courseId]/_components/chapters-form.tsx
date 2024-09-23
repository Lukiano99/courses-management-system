"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Chapter, type Course } from "@prisma/client";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ChaptersList from "./chapters-list";
import { type ReorderChaptersType } from "@/schemas";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // reorder chapters
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isValid } = form.formState;

  const { mutate: addChapter, isPending } = api.course.addChapter.useMutation();
  const { mutate: reorderChapters } = api.course.reorderChapters.useMutation();

  const toggleUpdating = () => setIsUpdating((current) => !current);
  const toggleCreating = () => setIsCreating((current) => !current);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toggleUpdating();
    addChapter(
      { ...values, courseId },
      {
        onSuccess: (data) => {
          toggleUpdating();

          toast.success(`${data.success}`);
          toggleCreating();
          form.reset();

          router.refresh();
        },
        onError: (e) => {
          toggleUpdating();
          toast.error(`${e.message}`);
        },
      },
    );
  };
  const onErrors = () => {
    toast.error("Something went wront");
  };

  const onReorder = (reorderedChapters: ReorderChaptersType) => {
    toggleUpdating();
    reorderChapters(
      {
        courseId,
        list: reorderedChapters,
      },
      {
        onSuccess: () => {
          toggleUpdating();
          toast.success("Chapter position changed successfully");
          form.reset();
          // TODO - Here seems like router doesn't refresh
          router.refresh();
        },
        onError: () => {
          toggleUpdating();
          toast.error("Something went wrong");
        },
      },
    );
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 rounded-md border bg-muted p-4 transition-all">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex size-full items-center justify-center rounded-md bg-muted-foreground/20 text-primary">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium transition-all">
        Course chapters
        <Button
          variant={"ghost"}
          onClick={toggleCreating}
          className="hover:bg-muted-foreground/10"
        >
          {!isCreating ? (
            <>
              <PlusCircleIcon size={14} className="mr-4" />
              Add a chapter
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="gap-2"
            >
              {isPending && <Loader2Icon size={18} className="animate-spin" />}
              {!isPending ? "Create" : "Creating..."}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.chapters.length && "italic text-muted-foreground",
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
            onEdit={(chapterId) => onEdit(chapterId)}
            onReorder={(reorderedChapters) => onReorder(reorderedChapters)}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChaptersForm;
