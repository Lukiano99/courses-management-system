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

  const toggleUpdating = () => setIsUpdating((current) => !current);
  const toggleCreating = () => setIsCreating((current) => !current);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addChapter(
      { ...values, courseId },
      {
        onSuccess: (data) => {
          toast.success(`${data.success}`);
          toggleCreating();
          router.refresh();
        },
        onError: (e) => {
          toast.error(`${e.message}`);
        },
      },
    );
  };
  const onErrors = () => {
    toast.error("Error");
  };
  return (
    <div className="mt-6 rounded-md border bg-muted p-4 transition-all">
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
          {/* TODO add a list of chapters */}
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
