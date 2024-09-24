import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { api } from "@/trpc/server";

const CoursesPage = async () => {
  const { courses } = await api.course.list();
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
