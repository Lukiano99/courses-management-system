"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      <SearchIcon
        size={16}
        className="absolute left-3 top-3 text-muted-foreground"
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-full bg-muted pl-9 focus-visible:ring-1 focus-visible:ring-muted-foreground md:w-[300px]"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
