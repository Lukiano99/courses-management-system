import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CircleXIcon,
  InfoIcon,
} from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning:
          "bg-yellow-100 text-yellow-800 border-yellow-400 p-4 dark:bg-yellow-600 dark:text-yellow-100 dark:border-yellow-500",
        success:
          "bg-green-100 text-green-800 border-green-400 p-4 dark:bg-green-600 dark:text-green-100 dark:border-green-500",
        error:
          "bg-red-100 text-red-800 border-red-400 p-4 dark:bg-red-600 dark:text-red-100 dark:border-red-500",
        info: "bg-blue-100 text-blue-800 border-blue-400 p-4 dark:bg-blue-600 dark:text-blue-100 dark:border-blue-500",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label?: string;
}

const iconMap = {
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
  error: CircleXIcon,
  info: InfoIcon,
};

const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant ?? "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-2 size-4" />
      {label}
    </div>
  );
};

export default Banner;
