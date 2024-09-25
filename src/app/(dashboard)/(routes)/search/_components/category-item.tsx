"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  value: string;
  label: string;
  icon: LucideIcon;
}

const CategoryItem = ({ value, label, icon: Icon }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-1 rounded-full border border-muted-foreground/40 px-3 py-2 text-sm transition hover:border-primary/80 hover:text-primary/80",
        isSelected && "border-primary bg-muted text-primary",
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
