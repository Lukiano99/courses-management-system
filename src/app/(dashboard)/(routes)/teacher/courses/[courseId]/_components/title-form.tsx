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
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });
  const { isValid } = form.formState;
  const router = useRouter();
  const { mutate: updateTitle, isPending } =
    api.course.updateTitle.useMutation();

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateTitle(
      { ...values, courseId },
      {
        onSuccess: (data) => {
          toast.success(`${data.success}`);
          toggleEdit();
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
        Course title
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-muted-foreground/10"
        >
          {!isEditing ? (
            <>
              <PencilIcon size={14} className="mr-4" />
              Edit title
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}
      {isEditing && (
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
                      disabled={isPending} // TODO
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={!isValid || isPending}
                className="gap-2"
              >
                {isPending && (
                  <Loader2Icon size={18} className="animate-spin" />
                )}
                {!isPending ? "Save" : "Saving..."}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TitleForm;
