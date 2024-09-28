import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface InfoCardPorps {
  variant?: string;
  label: string;
  icon: LucideIcon;
  numberOfItems: number;
}
const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardPorps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <Badge
        variant={"icon"}
        className={cn(
          variant === "success" &&
            "bg-emerald-200 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-700 dark:text-emerald-200 hover:dark:bg-emerald-700",
        )}
      >
        <Icon />
      </Badge>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
