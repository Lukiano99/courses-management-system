"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isValid } = form.formState;
  const router = useRouter();

  const { mutate: createCourse, isPending } = api.course.create.useMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCourse(
      { ...values },
      {
        onSuccess: (data) => {
          toast.success(`${data.success}`, {
            description: `Date created: ${data.course.createdAt.toDateString()}`,
          });
          router.push(`/teacher/courses/${data.course.id}`);
        },
        onError: (e) => {
          toast.error(`${e.message}`);
        },
      },
    );
  };
  const onErrors = () => {
    toast.error("ERROR");
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-muted-foreground">
          What would you like to name your course? Don&apos;t worry, you can
          change this later
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course tittle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Advanced web development"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant={"ghost"}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending || !isValid}>
                {!isPending && "Continue"}
                {isPending && (
                  <>
                    <Loader2Icon size={22} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
