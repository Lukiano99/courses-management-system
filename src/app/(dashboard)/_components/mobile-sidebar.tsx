"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Sidebar from "./sidebar";
import { useState } from "react";

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pr-4 transition-all hover:opacity-75 md:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="bg-background p-0"
        onClick={() => setOpen(false)}
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
