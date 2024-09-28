import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "../search/_components/courses-list";
import { CheckCircleIcon, ClockIcon } from "lucide-react";
import InfoCard from "./_components/info-card";

const DashboardPage = async () => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const { completedCourses, coursesInProgress } =
    await api.dashboardCourses.get();

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={ClockIcon}
          label="In Progess"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircleIcon}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
};

export default DashboardPage;
