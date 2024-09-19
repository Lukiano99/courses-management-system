"use client";
import { CompassIcon, LayoutIcon } from "lucide-react";
import SidebarItem from "./sidebar-item";
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

const SidebarRoutes = () => {
  const routes = guestRoutes;
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
