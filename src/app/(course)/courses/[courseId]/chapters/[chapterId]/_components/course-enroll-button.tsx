"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
  const { mutate: getPayment, isPending } = api.checkout.get.useMutation();
  const onClick = () => {
    getPayment(
      { courseId },
      {
        onSuccess: (data) => {
          if (data?.url) window.location.assign(data?.url);
        },
        onError: (error) => {
          console.log("FRONT");
          toast.error("Something went wrong", { description: error.message });
        },
      },
    );
  };

  return (
    <Button
      className="w-full md:w-auto"
      size={"sm"}
      onClick={onClick}
      disabled={isPending}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
