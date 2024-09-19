import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-medium text-muted-foreground/90 transition-all hover:bg-muted hover:text-muted-foreground",
        isActive &&
          "bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-muted-foreground/90", isActive && "text-primary")}
        />
        {label}
      </div>
      {isActive && <div className="ml-auto h-full border-2 border-primary" />}
    </button>
  );
};

export default SidebarItem;
