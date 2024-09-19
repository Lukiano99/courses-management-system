"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Course } from "@prisma/client";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: {
    label: string;
    value: string;
  }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId ?? "",
    },
  });
  const { isValid } = form.formState;
  const router = useRouter();
  const { mutate: updateCategory, isPending } =
    api.course.updateCategory.useMutation();

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCategory(
      { ...values, courseId },
      {
        onSuccess: () => {
          toast.success("Category updated successfully");
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

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId,
  );

  return (
    <div className="mt-6 rounded-md border bg-muted p-4 transition-all">
      <div className="flex items-center justify-between font-medium transition-all">
        Course category
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-muted-foreground/10"
        >
          {!isEditing ? (
            <>
              <PencilIcon size={14} className="mr-4" />
              Edit category
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.categoryId && "italic text-muted-foreground",
          )}
        >
          {selectedOption?.label ?? "No category "}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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

export default CategoryForm;
