import CourseCard from "@/components/course-card";
import { type Category, type Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  Category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}
const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      {items.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No courses founded
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id}>
            {/*
             We can override those properties because we know that this course card will never render
             if course is not published. And if course is published it means that it has all the properties
            */}
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress}
              category={item?.Category?.name ?? ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesList;
