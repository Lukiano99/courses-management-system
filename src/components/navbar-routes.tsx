"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname.startsWith("/teacher");
  const isPlayerPage = pathname.startsWith("/chapter");

  return (
    <div className="ml-auto flex items-center gap-x-2">
      {isTeacherPage || isPlayerPage ? (
        <Link href={"/"}>
          <Button variant={"ghost"}>
            <LogOutIcon className="mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={"/teacher/courses"}>
          <Button size={"sm"} variant={"ghost"}>
            Teacher Mode
          </Button>
        </Link>
      )}
      <div className="flex size-fit rounded-full">
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  );
};

export default NavbarRoutes;
