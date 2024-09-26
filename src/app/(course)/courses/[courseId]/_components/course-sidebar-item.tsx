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
        "flex items-center gap-x-2 pl-6 text-sm font-[500] text-muted-foreground/80 transition-all hover:bg-muted hover:text-muted-foreground",
        isActive && "bg-muted text-accent-foreground/80",
        isCompleted && "bg-emerald-100 text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-muted-foreground",
            isActive && "text-accent-foreground/80",
            isCompleted && "text-emerald-700",
          )}
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
