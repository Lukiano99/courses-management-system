import Banner from "@/components/banner";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

 

  if (!isTeacher(userId)) {
    return redirect("/");
  }

  return (
    <>
      <Banner label="Currently you are in TEACHER mode" variant={"info"} />
      {children}
    </>
  );
};

export default TeacherLayout;
