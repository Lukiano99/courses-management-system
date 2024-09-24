"use client";

import { type Category } from "@prisma/client";
import {
  type LucideIcon,
  BadgePercentIcon,
  CameraIcon,
  CircleIcon,
  DumbbellIcon,
  FilmIcon,
  MonitorSmartphoneIcon,
  MusicIcon,
  SettingsIcon,
} from "lucide-react";
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], LucideIcon> = {
  Music: MusicIcon,
  Photography: CameraIcon,
  Fitness: DumbbellIcon,
  Accounting: BadgePercentIcon,
  "Computer Science": MonitorSmartphoneIcon,
  Filming: FilmIcon,
  Engineering: SettingsIcon,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name] ?? CircleIcon}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
