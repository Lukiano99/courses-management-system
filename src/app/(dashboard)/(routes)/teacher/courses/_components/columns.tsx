"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Course } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  MoreHorizontalIcon,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      const isSortedAsc = column.getIsSorted() === "asc";
      const isSortedDesc = column.getIsSorted() === "desc";

      return (
        <Button
          variant="link"
          className={cn(
            "px-0 text-muted-foreground hover:text-accent-foreground hover:no-underline",
            (isSortedAsc || isSortedDesc) && "text-primary hover:text-primary",
          )}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {!isSortedAsc && !isSortedDesc && (
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          )}
          {isSortedAsc && !isSortedDesc && (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          )}
          {isSortedDesc && !isSortedAsc && (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = String(row.getValue("title"));
      return <div className="font-semibold">{title}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      const isSortedAsc = column.getIsSorted() === "asc";
      const isSortedDesc = column.getIsSorted() === "desc";

      return (
        <Button
          variant="link"
          className={cn(
            "px-0 text-muted-foreground hover:text-accent-foreground hover:no-underline",
            (isSortedAsc || isSortedDesc) && "text-primary hover:text-primary",
          )}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          {!isSortedAsc && !isSortedDesc && (
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          )}
          {isSortedAsc && !isSortedDesc && (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          )}
          {isSortedDesc && !isSortedAsc && (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      const isSortedAsc = column.getIsSorted() === "asc";
      const isSortedDesc = column.getIsSorted() === "desc";

      return (
        <Button
          variant="link"
          className={cn(
            "px-0 text-muted-foreground hover:text-accent-foreground hover:no-underline",
            (isSortedAsc || isSortedDesc) && "text-primary hover:text-primary",
          )}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          {!isSortedAsc && !isSortedDesc && (
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          )}
          {isSortedAsc && !isSortedDesc && (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          )}
          {isSortedDesc && !isSortedAsc && (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge variant={isPublished ? "default" : "draft"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      return (
        <Button variant="link" disabled={true} size={"icon"}>
          <MoreHorizontalIcon size={18} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreHorizontalIcon size={18} />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <PencilIcon className="mr-2" size={14} />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
