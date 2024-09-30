"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { ToggleTheme } from "./toggle-theme";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";
import React, { useEffect, useState } from "react";

const NavbarRoutes = () => {
  const { userId } = useAuth();

  const pathname = usePathname();

  const isTeacherPage = pathname.startsWith("/teacher");
  const isCoursePage = pathname.startsWith("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex items-center gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link href={"/"}>
            <Button variant={"ghost"}>
              <LogOutIcon className="mr-2" size={18} strokeWidth={1.4} />
              Exit
            </Button>
          </Link>
        ) : (
          isTeacher(userId) && (
            <Link href={"/teacher/courses"}>
              <Button size={"sm"} variant={"ghost"}>
                Teacher Mode
              </Button>
            </Link>
          )
        )}
        <div className="mx-2">
          <ToggleTheme />
        </div>
        <div className="flex size-fit rounded-full">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
