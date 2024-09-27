import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-primary",
  success: "text-emerald-700",
};
const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress = ({ value, variant, size }: CourseProgressProps) => {
  return (
    <div>
      <Progress className={cn("h-2")} value={value} variant={variant} />
      <p
        className={cn(
          "font-medium text-primary",
          colorByVariant[variant ?? "default"],
          sizeByVariant[size ?? "default"],
        )}
      >
        {Math.round(value)}% completed
      </p>
    </div>
  );
};

export default CourseProgress;
