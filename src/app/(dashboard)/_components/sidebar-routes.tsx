"use client";
import { BarChart2Icon, CompassIcon, LayoutIcon, ListIcon } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
const guestRoutes = [
  {
    icon: LayoutIcon,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: CompassIcon,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: ListIcon,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart2Icon,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarItem
          key={route.label}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
