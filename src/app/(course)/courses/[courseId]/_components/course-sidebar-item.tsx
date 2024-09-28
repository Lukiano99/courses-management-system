"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2Icon, LockIcon, PlayCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
  label: string;
  id: string;
}

const CourseSidebarItem = ({
  courseId,
  isCompleted,
  isLocked,
  label,
  id,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked
    ? LockIcon
    : isCompleted
      ? CheckCircle2Icon
      : PlayCircleIcon;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm transition-all hover:bg-muted",
        isActive && "bg-primary/10 font-semibold hover:bg-primary/20",
        isCompleted &&
          "bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/40",
        isCompleted &&
          isActive &&
          "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-green-400 dark:hover:bg-emerald-900/50",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={
            cn()
            // "text-muted-foreground",
            // isActive && "text-accent-foreground/80",
            // isCompleted && "text-emerald-700",
          }
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto h-full border-2 border-primary opacity-0 transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700",
        )}
      />
    </button>
  );
};

export default CourseSidebarItem;
