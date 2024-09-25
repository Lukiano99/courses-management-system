import { api } from "@/trpc/server";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import CoursesList from "./_components/courses-list";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { title?: string; categoryId?: string };
}) => {
  const { categories } = await api.category.list();
  const courses = await api.course.getWithSearch({
    categoryId: searchParams.categoryId,
    title: searchParams.title,
  });
  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
